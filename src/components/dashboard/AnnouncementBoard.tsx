import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, CheckCheck, ChevronDown, Pin } from "lucide-react";
import { ANNOUNCEMENTS } from "@/config/event";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/event";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const noteColors = [
  "bg-brand-yellow",
  "bg-brand-pink",
  "bg-brand-sky",
  "bg-brand-lavender",
  "bg-brand-lime",
  "bg-brand-orange",
  "bg-brand-pink",
];

interface AnnouncementBoardProps {
  readIds: string[];
  expandedId: string | null;
  onExpand: (id: string | null) => void;
  onMarkAllRead: () => void;
}

function AnnouncementNote({
  item,
  index,
  unread,
  expanded,
  onToggle,
}: {
  item: Announcement;
  index: number;
  unread: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <li className="h-fit">
      <div
        className={cn(
          "relative border-[3px] border-ink bg-white shadow-[3px_3px_0_#171717] transition-colors",
          unread && "bg-[#fffdf6]",
        )}
      >
        <div
          aria-hidden="true"
          className={cn("h-2.5 border-b-2 border-ink", noteColors[index % noteColors.length])}
        />
        <span
          aria-hidden="true"
          className="absolute -top-2 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center border-2 border-ink bg-white"
        >
          <span className="h-1 w-1 bg-ink" />
        </span>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`announcement-${item.id}`}
          className="w-full p-3 text-left"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {unread ? (
                <span className="flex items-center gap-1 border-2 border-ink bg-brand-lime px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase">
                  <span className="h-1.5 w-1.5 bg-ink" />
                  New
                </span>
              ) : (
                <span className="border-2 border-ink/20 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-ink/40">
                  Read
                </span>
              )}
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-ink/45">
                {item.tag}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform",
                expanded && "rotate-180",
              )}
            />
          </div>

          <h3 className="mt-2 font-heading text-sm font-bold leading-snug">
            {item.title}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-2 border-t-2 border-ink/10 pt-1.5">
            <span className="flex items-center gap-1 font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-ink/50">
              <Pin className="h-2.5 w-2.5" />
              {item.dateLabel}
            </span>
            <span className="font-mono text-[8px] font-bold uppercase text-ink/45">
              {expanded ? "Close" : "Open"}
            </span>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              id={`announcement-${item.id}`}
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="border-t-2 border-ink/15 px-3 pb-3 pt-2.5">
                <p className="text-xs leading-relaxed text-ink/70">{item.body}</p>
                {item.isScheduled ? (
                  <p className="mt-2 border-2 border-ink bg-brand-yellow/50 px-2 py-1 font-mono text-[8px] font-bold uppercase leading-relaxed tracking-[0.04em]">
                    Scheduled notice — not a confirmed published result.
                  </p>
                ) : (
                  <p className="mt-2 border-2 border-ink/20 bg-paper px-2 py-1 font-mono text-[8px] font-bold uppercase leading-relaxed tracking-[0.04em] text-ink/55">
                    Demo notice · saved read state on this device.
                  </p>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </li>
  );
}

export function AnnouncementBoard({
  readIds,
  expandedId,
  onExpand,
  onMarkAllRead,
}: AnnouncementBoardProps) {
  const unreadCount = ANNOUNCEMENTS.filter(
    (item) => !readIds.includes(item.id),
  ).length;

  return (
    <Reveal>
      <section
        id="announcements"
        aria-labelledby="announcements-heading"
        className="scroll-mt-24 px-3 py-3 sm:px-5 sm:py-4 lg:px-6"
      >
        <div className="section-shell mx-auto max-w-[1500px] p-3 sm:p-4 lg:p-5">
          <SectionHeading
            index="06"
            title="Announcements"
            color="yellow"
            action={
              <div className="flex items-center gap-2">
                <span className="border-2 border-ink bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase">
                  {unreadCount} unread
                </span>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 border-2 border-ink bg-brand-lime px-2 py-1 font-mono text-[9px] font-bold uppercase hover:bg-[#e4ff7a]"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              </div>
            }
          />

          <h2 id="announcements-heading" className="sr-only">
            HACKRUSH 2026 announcements
          </h2>

          <div className="mb-3 flex items-start gap-2 border-2 border-ink bg-brand-yellow/45 p-2.5">
            <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p className="text-[10px] font-medium leading-relaxed text-ink/70">
              A retro bulletin board of scheduled event notices. Read state is
              saved locally. Scheduled items are never presented as published
              results.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ANNOUNCEMENTS.map((item, index) => (
              <AnnouncementNote
                key={item.id}
                item={item}
                index={index}
                unread={!readIds.includes(item.id)}
                expanded={expandedId === item.id}
                onToggle={() =>
                  onExpand(expandedId === item.id ? null : item.id)
                }
              />
            ))}
          </ul>
        </div>
      </section>
    </Reveal>
  );
}
