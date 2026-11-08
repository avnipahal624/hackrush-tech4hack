import { EVENT, MILESTONES } from "@/config/event";
import type {
  EventMilestone,
  MilestoneState,
  MilestoneStatus,
} from "@/types/event";

const DAY_MS = 24 * 60 * 60 * 1000;

export const IST_TIME_ZONE = EVENT.timeZone;

export function parseISODate(value: string): Date {
  return new Date(value);
}

export function getNextMilestone(now: Date = new Date()): EventMilestone | undefined {
  return MILESTONES.filter((milestone) => {
    if (!milestone.start) return false;
    return parseISODate(milestone.start).getTime() > now.getTime();
  }).sort(
    (a, b) =>
      parseISODate(a.start as string).getTime() -
      parseISODate(b.start as string).getTime(),
  )[0];
}

/**
 * Date-aware status. Result milestones that have passed are never labelled as
 * announced — they explicitly say the result is not published here.
 */
export function getMilestoneStatus(
  milestone: EventMilestone,
  now: Date = new Date(),
): MilestoneStatus {
  if (milestone.tba || !milestone.start) {
    return {
      state: "tba",
      label: "Date TBA",
      note: "Awaiting an official date.",
    };
  }

  const start = parseISODate(milestone.start);
  const end = milestone.end
    ? parseISODate(milestone.end)
    : new Date(start.getTime() + DAY_MS - 1);

  if (now.getTime() < start.getTime()) {
    return {
      state: "upcoming",
      label: "Upcoming",
      note: "Scheduled checkpoint.",
    };
  }

  if (now.getTime() > end.getTime()) {
    if (milestone.isResult) {
      return {
        state: "passed",
        label: "Date passed",
        note: "Result not published on this demo.",
      };
    }
    return {
      state: "passed",
      label: "Date passed",
      note: "Checkpoint complete.",
    };
  }

  return {
    state: "in-progress",
    label: milestone.end ? "In progress" : "Scheduled today",
    note: milestone.isResult
      ? "Scheduled — result not published here."
      : "Happening now on the published schedule.",
  };
}

export const statusTone: Record<
  MilestoneState,
  { chip: string; dot: string; text: string }
> = {
  upcoming: {
    chip: "bg-white text-ink",
    dot: "bg-white",
    text: "text-ink/60",
  },
  "in-progress": {
    chip: "bg-brand-lime text-ink",
    dot: "bg-brand-lime",
    text: "text-ink/70",
  },
  passed: {
    chip: "bg-brand-pink text-ink",
    dot: "bg-brand-pink",
    text: "text-ink/60",
  },
  tba: {
    chip: "bg-brand-yellow text-ink",
    dot: "bg-brand-yellow",
    text: "text-ink/60",
  },
};

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function getCountdownParts(
  target: Date | string,
  now: Date = new Date(),
): CountdownParts {
  const targetMs =
    typeof target === "string" ? parseISODate(target).getTime() : target.getTime();
  const total = Math.max(0, targetMs - now.getTime());
  const totalSeconds = Math.floor(total / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    total,
  };
}

export function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatIST(
  value: Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
): string {
  const date = typeof value === "string" ? parseISODate(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    ...options,
    timeZone: IST_TIME_ZONE,
  }).format(date);
}

export function formatISTTime(value: Date | string): string {
  const date = typeof value === "string" ? parseISODate(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: IST_TIME_ZONE,
  }).format(date);
}

export function getTodayIST(now: Date = new Date()): string {
  return formatIST(now, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getTimelineProgress(now: Date = new Date()): {
  completed: number;
  total: number;
  percent: number;
} {
  const dated = MILESTONES.filter((milestone) => Boolean(milestone.start));
  const completed = dated.filter(
    (milestone) => getMilestoneStatus(milestone, now).state === "passed",
  ).length;

  return {
    completed,
    total: dated.length,
    percent: dated.length ? Math.round((completed / dated.length) * 100) : 0,
  };
}

export function timeUntilLabel(
  milestone: EventMilestone | undefined,
  now: Date = new Date(),
): string {
  if (!milestone?.start) return "No further scheduled checkpoints";
  const parts = getCountdownParts(milestone.start, now);
  if (parts.total <= 0) return "Checkpoint reached";

  if (parts.days > 0) {
    return `${parts.days} day${parts.days === 1 ? "" : "s"}, ${parts.hours}h ${parts.minutes}m`;
  }
  if (parts.hours > 0) {
    return `${parts.hours}h ${parts.minutes}m`;
  }
  return `${parts.minutes}m ${parts.seconds}s`;
}
