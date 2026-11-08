import { ArrowRight, ArrowUpRight, Keyboard } from "lucide-react";
import { EVENT } from "@/config/event";
import { BrutalButton } from "./BrutalButton";
import { Checkerboard, Sparkle } from "./Decor";

interface FooterProps {
  onOpenRegistration: () => void;
  onOpenSubmission: () => void;
}

export function Footer({ onOpenRegistration, onOpenSubmission }: FooterProps) {
  return (
    <footer className="mt-6 border-t-[3px] border-ink bg-ink text-paper">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 border-b-2 border-paper/20 pb-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-brand-lime">// Ready when you are</p>
            <h2 className="mt-2 max-w-2xl font-display text-[clamp(2rem,5vw,3.75rem)] uppercase leading-[0.9]">
              Build something
              <br />
              <span className="text-brand-pink">loud.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
              Pick a track, gather your squad, and take your idea from a
              scribble to a demo. This dashboard is a playground — no data is
              sent anywhere.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <BrutalButton
              variant="lime"
              className="w-full justify-between py-4 text-sm"
              onClick={onOpenRegistration}
            >
              Register your team
              <ArrowRight className="h-4 w-4" />
            </BrutalButton>
            <BrutalButton
              variant="pink"
              className="w-full justify-between py-4 text-sm"
              onClick={onOpenSubmission}
            >
              Drop your big idea
              <ArrowUpRight className="h-4 w-4" />
            </BrutalButton>
          </div>
        </div>

        <div className="grid gap-7 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex items-center gap-2 border-[3px] border-paper bg-brand-lime px-2.5 py-1.5 text-ink shadow-[3px_3px_0_#FFF8ED]">
              <span className="font-display text-lg leading-none">TECH4HACK®</span>
              <Sparkle className="h-4 w-4 text-brand-pink" />
            </div>
            <p className="mt-3 font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.08em] text-paper/60">
              @ IGDTUW
              <br />
              HACKRUSH 2026
            </p>
            <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-paper/55">
              A student hacker community festival. Online hackathon, offline
              award ceremony.
            </p>
          </div>

          <div>
            <p className="eyebrow text-brand-pink">Jump to</p>
            <nav aria-label="Footer" className="mt-2 grid gap-1.5">
              {[
                ["Dashboard", "#dashboard"],
                ["Timeline", "#timeline"],
                ["Tracks", "#tracks"],
                ["Awards", "#rewards"],
                ["Announcements", "#announcements"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="w-fit border-b border-paper/20 pb-0.5 font-heading text-xs font-bold uppercase tracking-wide text-paper/80 hover:border-brand-lime hover:text-brand-lime"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="eyebrow text-brand-pink">Important</p>
            <p className="mt-2 text-xs leading-relaxed text-paper/60">
              {EVENT.registrationNote} Registration and idea submission here are
              interactive frontend demos.
            </p>
            <p className="mt-2 border-l-2 border-brand-yellow pl-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.04em] text-paper/50">
              {EVENT.registrationDisclaimer}
            </p>
          </div>

          <div>
            <p className="eyebrow text-brand-pink">Keyboard & device</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-paper/60">
                <span className="border-2 border-paper/40 px-1.5 py-0.5 font-mono text-[10px] text-paper">
                  R
                </span>
                Open registration
              </div>
              <div className="flex items-center gap-2 text-xs text-paper/60">
                <span className="border-2 border-paper/40 px-1.5 py-0.5 font-mono text-[10px] text-paper">
                  Esc
                </span>
                Close dialogs
              </div>
              <div className="flex items-start gap-2 text-xs leading-relaxed text-paper/60">
                <Keyboard className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Demo data is stored only in this browser via LocalStorage.
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t-2 border-paper/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Checkerboard className="h-5 w-16 border-paper/40" />
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-paper/45">
              © 2026 interactive demo · {EVENT.organization} × {EVENT.hackathon}
            </p>
          </div>
          <p className="max-w-xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.04em] text-paper/40">
            {EVENT.demoNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
