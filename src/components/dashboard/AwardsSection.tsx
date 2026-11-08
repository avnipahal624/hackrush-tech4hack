import { Award as AwardIcon, Medal, Rocket, Sparkles, Trophy } from "lucide-react";
import { AWARDS } from "@/config/event";
import { colorBlock, colorSoft } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { Award } from "@/types/event";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Sparkle, TrophyIllustration } from "./Decor";

const awardIcons = {
  trophy: Trophy,
  medal: Medal,
  award: AwardIcon,
  sparkles: Sparkles,
  rocket: Rocket,
};

function AwardCard({ award, featured }: { award: Award; featured: boolean }) {
  const Icon = awardIcons[award.icon];

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between border-[3px] border-ink p-3 shadow-[3px_3px_0_#171717] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#171717]",
        featured ? "sm:col-span-2 sm:p-4" : "",
        colorSoft[award.color],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center border-2 border-ink bg-white",
            featured && "h-11 w-11",
          )}
        >
          <Icon className={cn("h-[18px] w-[18px]", featured && "h-5 w-5")} strokeWidth={2.2} />
        </span>
        <span
          className={cn(
            "border-2 border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none",
            colorBlock[award.color],
          )}
        >
          {award.rank}
        </span>
      </div>

      <div className="mt-3">
        <h3
          className={cn(
            "font-display uppercase leading-none",
            featured ? "text-lg sm:text-xl" : "text-sm sm:text-base",
          )}
        >
          {award.title}
        </h3>
        <p className="mt-1.5 text-[11px] font-medium leading-snug text-ink/70 sm:text-xs">
          {award.perks}
        </p>
      </div>

      <div className="mt-2.5 flex items-center gap-2 border-t-2 border-ink/15 pt-1.5">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-ink/50">
          {award.id === "female-team"
            ? "Special recognition"
            : award.id === "startup-idea"
              ? "Special recognition"
              : "Podium award"}
        </span>
        {featured ? (
          <span className="ml-auto flex items-center gap-1 bg-brand-yellow px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase">
            <Sparkles className="h-2.5 w-2.5" />
            Top spot
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function AwardsSection() {
  return (
    <Reveal>
      <section
        id="rewards"
        aria-labelledby="awards-heading"
        className="scroll-mt-24 px-3 py-3 sm:px-5 sm:py-4 lg:px-6"
      >
        <div className="section-shell mx-auto max-w-[1500px] p-3 sm:p-4 lg:p-5">
          <SectionHeading
            index="05"
            title="Awards & recognition"
            color="lavender"
            action={
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ink/50">
                5 categories · as published
              </p>
            }
          />

          <h2 id="awards-heading" className="sr-only">
            HACKRUSH 2026 awards and recognition
          </h2>

          <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-4">
              <div className="relative flex h-full flex-col border-[3px] border-ink bg-brand-lime p-3 shadow-[4px_4px_0_#171717] sm:p-4">
                <div className="relative mx-auto w-full max-w-[230px]">
                  <span className="absolute -left-2 -top-2 z-10 font-mono text-[9px] font-bold uppercase tracking-[0.1em]">
                    Est. 2026
                  </span>
                  <TrophyIllustration className="bob mt-3" />
                  <Sparkle className="absolute -right-2 top-2 h-7 w-7 text-brand-pink" />
                </div>
                <p className="mt-2 font-display text-lg uppercase leading-[1.05] sm:text-xl">
                  One trophy.
                  <br />
                  Five ways to shine.
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/70">
                  Recognising the top three teams and two special mentions from
                  the published award list.
                </p>
                <div className="mt-auto flex items-center gap-2 border-t-2 border-ink/20 pt-2">
                  <span className="flex h-5 w-5 items-center justify-center border border-ink bg-white">
                    <Trophy className="h-3 w-3" />
                  </span>
                  <span className="font-mono text-[8px] font-bold uppercase leading-tight tracking-[0.06em] text-ink/55">
                    No cash prizes or winner names are invented on this demo.
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2.5 sm:col-span-2 sm:grid-cols-2 lg:col-span-8">
              {AWARDS.map((award, index) => (
                <AwardCard
                  key={award.id}
                  award={award}
                  featured={index === 0}
                />
              ))}
            </div>
          </div>

          <p className="mt-3 border-t-2 border-ink/15 pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.06em] text-ink/50">
            Award details are reproduced from the published HACKRUSH 2026
            material: internship opportunity, credits and goodies for the top
            three positions; goodies for best female team and most promising
            startup idea.
          </p>
        </div>
      </section>
    </Reveal>
  );
}
