import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Info } from "lucide-react";
import { MILESTONES } from "@/config/event";
import { useNow } from "@/hooks/use-now";
import {
  getMilestoneStatus,
  getTimelineProgress,
  getTodayIST,
  statusTone,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import type { MilestoneState } from "@/types/event";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const statusOrder: MilestoneState[] = [
  "upcoming",
  "in-progress",
  "passed",
  "tba",
];

const statusCopy: Record<MilestoneState, string> = {
  upcoming: "Upcoming",
  "in-progress": "In progress",
  passed: "Date passed",
  tba: "Date TBA",
};

export function EventTimeline() {
  const now = useNow(60000);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const progress = getTimelineProgress(now);

  return (
    <Reveal>
      <section
        id="timeline"
        aria-labelledby="timeline-heading"
        className="scroll-mt-24 px-3 py-3 sm:px-5 sm:py-4 lg:px-6"
      >
        <div className="section-shell mx-auto max-w-[1500px] p-3 sm:p-4 lg:p-5">
          <SectionHeading
            index="04"
            title="Event timeline"
            color="pink"
            action={
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ink/50">
                {getTodayIST(now)} · IST
              </p>
            }
          />

          <h2 id="timeline-heading" className="sr-only">
            Tech4Hack HACKRUSH 2026 event timeline
          </h2>

          <div className="grid gap-5 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="border-[3px] border-ink bg-brand-yellow p-3 shadow-[4px_4px_0_#171717] sm:p-4">
                <p className="eyebrow text-ink/60">Schedule progress</p>
                <div className="mt-1 flex items-end justify-between gap-2">
                  <p className="font-display text-4xl leading-none">
                    {String(progress.completed).padStart(2, "0")}
                    <span className="ml-1 font-mono text-sm font-bold text-ink/50">
                      / {String(progress.total).padStart(2, "0")}
                    </span>
                  </p>
                  <span className="border-2 border-ink bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold">
                    {progress.percent}%
                  </span>
                </div>
                <div className="mt-3 h-4 border-[3px] border-ink bg-white p-0.5">
                  <div
                    className="h-full bg-brand-pink transition-[width] duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[9px] font-bold uppercase leading-relaxed tracking-[0.06em] text-ink/60">
                  Checkpoints passed on the published schedule. Progress is not
                  a result status.
                </p>
              </div>

              <div className="mt-3 border-[3px] border-ink bg-white p-3 shadow-[3px_3px_0_#171717]">
                <p className="eyebrow text-ink/50">Legend</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {statusOrder.map((state) => (
                    <div key={state} className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 border-2 border-ink",
                          statusTone[state].dot,
                        )}
                      />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wide">
                        {statusCopy[state]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 border-2 border-ink bg-brand-lavender/40 p-2.5">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p className="text-[10px] font-medium leading-relaxed text-ink/70">
                  Scheduled result checkpoints are never shown as announced.
                  This demo publishes no winners, teams, or scores.
                </p>
              </div>

              <a
                href="#announcements"
                className="mt-3 flex items-center justify-between border-2 border-ink bg-white px-2.5 py-2 font-heading text-[10px] font-bold uppercase tracking-wide hover:bg-brand-lime"
              >
                Read announcements
                <span aria-hidden="true">→</span>
              </a>
            </aside>

            <ol className="relative min-w-0 space-y-2 lg:col-span-8">
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-[7px] top-4 w-[2px] bg-ink/20"
              />
              {MILESTONES.map((milestone, index) => {
                const status = getMilestoneStatus(milestone, now);
                const expanded = expandedId === milestone.id;
                const isCurrent = status.state === "in-progress";

                return (
                  <li
                    key={milestone.id}
                    className="relative pl-6 sm:pl-7"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-0 top-4 z-10 h-4 w-4 border-[3px] border-ink",
                        statusTone[status.state].dot,
                        isCurrent && "animate-pulse",
                      )}
                    />
                    <Reveal delay={index * 0.03}>
                      <div
                        className={cn(
                          "border-[3px] border-ink bg-white shadow-[3px_3px_0_#171717] transition-colors",
                          expanded ? "bg-paper" : "hover:bg-paper/70",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId((current) =>
                              current === milestone.id ? null : milestone.id,
                            )
                          }
                          aria-expanded={expanded}
                          aria-controls={`milestone-${milestone.id}`}
                          className="flex w-full items-start gap-2 p-2.5 text-left sm:items-center sm:gap-3 sm:px-3"
                        >
                          <span className="w-[58px] shrink-0 font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.02em] text-ink/60 sm:w-[74px] sm:text-[10px]">
                            {milestone.dateLabel}
                          </span>
                          <span className="min-w-0 flex-1 font-heading text-[11px] font-bold leading-snug sm:text-[13px]">
                            {milestone.title}
                          </span>
                          <span className="flex shrink-0 items-center gap-1.5">
                            <span
                              className={cn(
                                "hidden border-2 border-ink px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase leading-tight tracking-wide sm:inline-block",
                                statusTone[status.state].chip,
                              )}
                            >
                              {status.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 transition-transform",
                                expanded && "rotate-180",
                              )}
                            />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {expanded ? (
                            <motion.div
                              id={`milestone-${milestone.id}`}
                              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                              animate={
                                reduceMotion
                                  ? undefined
                                  : { height: "auto", opacity: 1 }
                              }
                              exit={
                                reduceMotion
                                  ? undefined
                                  : { height: 0, opacity: 0 }
                              }
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="border-t-2 border-ink/15 px-2.5 py-3 sm:px-3">
                                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                                  <span
                                    className={cn(
                                      "border-2 border-ink px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase",
                                      statusTone[status.state].chip,
                                    )}
                                  >
                                    {status.label}
                                  </span>
                                  <span className="font-mono text-[9px] uppercase tracking-wide text-ink/50">
                                    {status.note}
                                  </span>
                                  {milestone.isResult ? (
                                    <span className="border-2 border-ink bg-white px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase">
                                      Scheduled result
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-sm leading-relaxed text-ink/75">
                                  {milestone.summary}
                                </p>
                                <ul className="mt-2.5 space-y-1.5">
                                  {milestone.details.map((detail) => (
                                    <li
                                      key={detail}
                                      className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ink/65"
                                    >
                                      <Check
                                        className="mt-0.5 h-3 w-3 shrink-0"
                                        strokeWidth={3}
                                      />
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                                <p className="mt-3 border-t-2 border-ink/10 pt-2 font-mono text-[8px] uppercase tracking-[0.06em] text-ink/45">
                                  Milestone {String(index + 1).padStart(2, "0")} ·{" "}
                                  {milestone.tba
                                    ? "Date to be announced"
                                    : `${milestone.dateLabel} · Asia/Kolkata`}
                                </p>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-4 border-t-2 border-ink/15 pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.06em] text-ink/50">
            Schedule follows the published HACKRUSH 2026 timeline. Dates can
            change — always confirm with official Tech4Hack communication.
          </p>
        </div>
      </section>
    </Reveal>
  );
}
