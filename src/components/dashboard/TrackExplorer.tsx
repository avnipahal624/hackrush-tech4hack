import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Coins,
  Cpu,
  HeartPulse,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { TRACKS } from "@/config/event";
import { colorBlock, colorSoft } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { Track, TrackIcon, TrackId } from "@/types/event";
import { SectionHeading } from "./SectionHeading";
import { BrutalButton } from "./BrutalButton";
import { Reveal } from "./Reveal";

const trackIcons = {
  cpu: Cpu,
  coins: Coins,
  heart: HeartPulse,
  shield: ShieldCheck,
  leaf: Leaf,
};

function TrackIconGlyph({ icon, className }: { icon: TrackIcon; className?: string }) {
  const Icon = trackIcons[icon];
  return <Icon className={className} strokeWidth={2} />;
}

interface TrackCardProps {
  track: Track;
  index: number;
  selected: boolean;
  onSelect: (id: TrackId) => void;
}

function TrackCard({ track, index, selected, onSelect }: TrackCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(track.id)}
      aria-expanded={selected}
      aria-controls={`track-detail-${track.id}`}
      className={cn(
        "group relative flex min-h-[152px] w-full flex-col justify-between border-[3px] border-ink p-3 text-left transition-all duration-150 focus-visible:outline-offset-4 sm:min-h-[168px]",
        colorBlock[track.color],
        selected
          ? "translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0_#171717]"
          : "shadow-[4px_4px_0_#171717] hover:-translate-y-1 hover:shadow-[7px_7px_0_#171717]",
      )}
    >
      <div className="flex w-full items-start justify-between gap-1">
        <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-white transition-transform duration-200 group-hover:rotate-[-4deg]">
          <TrackIconGlyph icon={track.icon} className="h-[18px] w-[18px]" />
        </span>
        <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-ink/50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-3 w-full">
        <h3 className="font-display text-[12px] uppercase leading-[1.05] sm:text-[13px]">
          {track.shortName}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[10px] font-medium leading-snug text-ink/70">
          {track.tagline}
        </p>
      </div>

      <div className="mt-3 flex w-full items-center justify-between border-t-2 border-ink/20 pt-1.5">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.1em]">
          {selected ? "Open" : "View track"}
        </span>
        {selected ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
        )}
      </div>
    </button>
  );
}

interface TrackExplorerProps {
  onSelectTrack: (trackId: TrackId) => void;
}

export function TrackExplorer({ onSelectTrack }: TrackExplorerProps) {
  const [selectedId, setSelectedId] = useState<TrackId | null>(null);
  const selected = TRACKS.find((track) => track.id === selectedId) ?? null;
  const reduceMotion = useReducedMotion();

  return (
    <Reveal>
      <section
        id="tracks"
        aria-labelledby="tracks-heading"
        className="scroll-mt-24 px-3 py-3 sm:px-5 sm:py-4 lg:px-6"
      >
        <div className="section-shell mx-auto max-w-[1500px] p-3 sm:p-4 lg:p-5">
          <SectionHeading
            index="03"
            title="Explore the tracks"
            color="lime"
            action={
              <p className="hidden font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ink/50 sm:block">
                Pick a track · pass it to your squad
              </p>
            }
          />

          <h2 id="tracks-heading" className="sr-only">
            Explore the Tech4Hack HACKRUSH 2026 tracks
          </h2>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {TRACKS.map((track, index) => (
              <div
                key={track.id}
                className={cn(
                  index === TRACKS.length - 1 && "col-span-2 sm:col-span-1",
                )}
              >
                <TrackCard
                  track={track}
                  index={index}
                  selected={selectedId === track.id}
                  onSelect={(id) =>
                    setSelectedId((current) => (current === id ? null : id))
                  }
                />
              </div>
            ))}
          </div>

          <AnimatePresence initial={false} mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                id={`track-detail-${selected.id}`}
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
                exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 border-[3px] border-ink bg-white shadow-[4px_4px_0_#171717]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/15 px-3 py-2 sm:px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center border-2 border-ink",
                          colorBlock[selected.color],
                        )}
                      >
                        <TrackIconGlyph icon={selected.icon} className="h-4 w-4" />
                      </span>
                      <p className="font-heading text-xs font-bold uppercase tracking-wide sm:text-sm">
                        {selected.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="border-2 border-ink bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wide hover:bg-brand-pink"
                    >
                      Collapse
                    </button>
                  </div>

                  <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="min-w-0">
                      <p className="max-w-3xl text-sm leading-relaxed text-ink/75">
                        {selected.detail}
                      </p>
                      <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
                        {selected.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className={cn(
                              "flex items-start gap-1.5 border-2 border-ink p-2 text-[11px] font-medium leading-snug",
                              colorSoft[selected.color],
                            )}
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <BrutalButton
                      variant="ink"
                      className="w-full shrink-0 md:w-auto"
                      onClick={() => onSelectTrack(selected.id)}
                    >
                      Select this track
                      <ArrowRight className="h-4 w-4" />
                    </BrutalButton>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <p className="mt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.06em] text-ink/50">
            Track selection is saved with your demo registration in this browser.
            No data leaves this device.
          </p>
        </div>
      </section>
    </Reveal>
  );
}
