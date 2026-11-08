import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  GraduationCap,
  LaptopMinimal,
  Users,
} from "lucide-react";
import { EVENT, EVENT_INFO } from "@/config/event";
import { useNow } from "@/hooks/use-now";
import {
  formatISTTime,
  getCountdownParts,
  getNextMilestone,
  pad,
} from "@/lib/date";
import { colorBlock, colorChip } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { ArrowDoodle, RetroComputer, Sparkle, Starburst } from "./Decor";
import { BrutalButton } from "./BrutalButton";
import type { EventInfo } from "@/types/event";

const infoIcons = {
  team: Users,
  cap: GraduationCap,
  laptop: LaptopMinimal,
  calendar: CalendarDays,
};

function EventInfoCard({ info }: { info: EventInfo }) {
  const Icon = infoIcons[info.icon];
  return (
    <div className="flex min-w-0 items-center gap-2.5 border-[3px] border-ink bg-white px-2.5 py-3 shadow-[3px_3px_0_#171717] sm:gap-3 sm:px-3">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink sm:h-10 sm:w-10",
          colorBlock[info.color],
        )}
      >
        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[8px] font-bold uppercase leading-tight tracking-[0.1em] text-ink/55 sm:text-[9px]">
          {info.label}
        </span>
        <span className="mt-0.5 block font-heading text-[11px] font-bold leading-tight sm:text-[13px]">
          {info.value}
        </span>
      </span>
    </div>
  );
}

function CountdownCard({ now }: { now: Date }) {
  const next = getNextMilestone(now);
  const parts = next?.start
    ? getCountdownParts(next.start, now)
    : { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

  const blocks = [
    { label: "Days", value: pad(parts.days) },
    { label: "Hrs", value: pad(parts.hours) },
    { label: "Min", value: pad(parts.minutes) },
    { label: "Sec", value: pad(parts.seconds) },
  ];

  return (
    <article className="relative border-[3px] border-ink bg-brand-pink p-4 shadow-[6px_6px_0_#171717] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-ink/60">Next milestone in</p>
          <p className="mt-1 font-display text-sm uppercase leading-tight sm:text-base">
            {next?.targetLabel ?? "Schedule complete"}
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-white">
          <Clock3 className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="border-[3px] border-ink bg-white px-0.5 py-2 text-center shadow-[3px_3px_0_#171717]"
          >
            <span className="block font-mono text-[clamp(1.35rem,3.4vw,2.15rem)] font-bold leading-none tracking-tight">
              {next ? block.value : "--"}
            </span>
            <span className="mt-1.5 block font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-ink/60">
              {block.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-ink/65">
        <span className="truncate">
          {next ? next.dateLabel : "All checkpoints reached"}
        </span>
        <span className="shrink-0">Asia/Kolkata</span>
      </div>
    </article>
  );
}

interface HeroSectionProps {
  onOpenRegistration: () => void;
  onExplore: () => void;
}

export function HeroSection({
  onOpenRegistration,
  onExplore,
}: HeroSectionProps) {
  const now = useNow(1000);
  const next = getNextMilestone(now);

  return (
    <section
      id="dashboard"
      aria-labelledby="hero-heading"
      className="relative scroll-mt-24 overflow-hidden px-3 pb-10 pt-7 sm:px-5 sm:pb-12 sm:pt-10 lg:px-6"
    >
      <div className="pointer-events-none absolute right-4 top-6 hidden text-brand-yellow xl:block">
        <Starburst className="h-24 w-24" />
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6">
        <div className="min-w-0 lg:col-span-7">
          <div className="flex items-start justify-between gap-2">
            <div className="relative w-fit max-w-full">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-2 translate-y-2 bg-ink sm:translate-x-3 sm:translate-y-3"
              />
              <div className="relative border-[3px] border-ink bg-brand-pink px-3 pb-2 pt-1.5 sm:px-5">
                <h1
                  id="hero-heading"
                  className="font-display text-[clamp(3.05rem,9.4vw,7.7rem)] leading-[0.8] tracking-[-0.04em] text-ink"
                >
                  HACKRUSH
                </h1>
                <div className="mt-1.5 flex items-end justify-between gap-3 border-t-2 border-ink/20 pt-1.5">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-ink/70 sm:text-[10px]">
                    IGDTUW edition
                  </span>
                  <span className="border-2 border-ink bg-ink px-2 py-0.5 font-display text-[clamp(1.9rem,4.8vw,3.3rem)] leading-none text-paper">
                    2026
                  </span>
                </div>
              </div>
            </div>

            <div className="relative hidden shrink-0 sm:block">
              <Sparkle className="h-10 w-10 text-brand-lime lg:h-14 lg:w-14" />
              <span className="mt-1 block rotate-0 font-mono text-[8px] font-bold uppercase leading-tight tracking-[0.1em] text-ink/55">
                Build
                <br />
                things
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="min-w-0 sm:max-w-[270px]">
              <p className="font-heading text-base font-bold leading-snug sm:text-lg">
                {EVENT.subtitle}
              </p>
              <p className="mt-3 inline-block border-2 border-ink bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase leading-relaxed tracking-[0.1em] shadow-[2px_2px_0_#171717] sm:text-[10px]">
                {EVENT.tagline}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <ArrowDoodle className="h-10 w-24 shrink-0" />
                <span className="pb-1 font-mono text-[8px] font-bold uppercase leading-tight text-ink/50">
                  the
                  <br />
                  mission
                </span>
              </div>
            </div>
            <RetroComputer className="w-full sm:flex-1" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:col-span-5">
          <article className="relative flex flex-1 flex-col border-[3px] border-ink bg-brand-lavender p-4 shadow-[6px_6px_0_#171717] sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="border-2 border-ink bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
                Next up
              </span>
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-ink/55">
                HACKRUSH / 2026
              </span>
            </div>

            <p className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60">
              Your next mission
            </p>
            <h2 className="mt-1.5 text-balance font-display text-[clamp(1.45rem,3.2vw,2.25rem)] uppercase leading-[0.98]">
              {next?.title ?? "The schedule is complete"}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em]">
              <span className="border-2 border-ink bg-white px-1.5 py-0.5">
                {next?.dateLabel ?? "All checkpoints passed"}
              </span>
              {next?.start ? (
                <span className="text-ink/60">
                  {formatISTTime(next.start)} IST target
                </span>
              ) : null}
            </p>
            <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-ink/75">
              {next?.summary ??
                "All published HACKRUSH 2026 checkpoints have passed. This demo does not publish results."}
            </p>

            <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2">
              <BrutalButton
                variant="lime"
                className="w-full justify-between px-3 py-3"
                onClick={onOpenRegistration}
              >
                Register team
                <ArrowRight className="h-4 w-4" />
              </BrutalButton>
              <button
                type="button"
                onClick={onExplore}
                className="brutal-btn w-full justify-between bg-white px-3 py-3 text-xs uppercase tracking-[0.08em] hover:bg-paper"
              >
                Explore event
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 border-t-2 border-ink/15 pt-2 font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-ink/55">
              Interactive demo · dates follow the published schedule, not an
              official registration link.
            </p>
          </article>

          <CountdownCard now={now} />
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-12 lg:grid-cols-4">
          {EVENT_INFO.map((info) => (
            <EventInfoCard key={info.id} info={info} />
          ))}
        </div>
      </div>
    </section>
  );
}
