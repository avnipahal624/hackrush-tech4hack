import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Starburst({ className }: { className?: string }) {
  const points = Array.from({ length: 24 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 24;
    const radius = index % 2 === 0 ? 100 : 60;
    return `${100 + Math.cos(angle) * radius},${100 + Math.sin(angle) * radius}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <polygon
        points={points}
        fill="currentColor"
        stroke="#171717"
        strokeWidth="5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M50 2C54 34 66 46 98 50C66 54 54 66 50 98C46 66 34 54 2 50C34 46 46 34 50 2Z"
        fill="currentColor"
        stroke="#171717"
        strokeWidth="4"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function Checkerboard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("checker brutal-border h-8 w-24", className)}
    />
  );
}

export function ArrowDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 64"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M5 17C30 4 73 7 105 34"
        stroke="#171717"
        strokeWidth="4"
        strokeLinecap="square"
      />
      <path
        d="M88 28L108 37L99 18"
        stroke="#171717"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M18 48C35 41 55 42 72 50" stroke="#FF8FC7" strokeWidth="6" />
    </svg>
  );
}

export function TrophyIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 170"
      role="img"
      aria-label="Illustrated first-place trophy"
      className={cn("h-auto w-full", className)}
    >
      <rect x="8" y="8" width="154" height="154" fill="#C6A7FF" />
      <rect
        x="8"
        y="8"
        width="154"
        height="154"
        fill="none"
        stroke="#171717"
        strokeWidth="4"
      />
      <path
        d="M47 42C25 42 21 74 48 78"
        fill="none"
        stroke="#171717"
        strokeWidth="7"
      />
      <path
        d="M123 42C145 42 149 74 122 78"
        fill="none"
        stroke="#171717"
        strokeWidth="7"
      />
      <path
        d="M40 26H130L121 80C118 101 101 115 85 115C69 115 52 101 49 80L40 26Z"
        fill="#FFD966"
        stroke="#171717"
        strokeWidth="5"
        strokeLinejoin="miter"
      />
      <path
        d="M45 34H125"
        stroke="#171717"
        strokeWidth="4"
        strokeLinecap="square"
      />
      <path
        d="M85 49L90 61L103 62L93 70L96 83L85 76L74 83L77 70L67 62L80 61L85 49Z"
        fill="#FFF8ED"
        stroke="#171717"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <rect x="77" y="115" width="16" height="17" fill="#FFAB70" stroke="#171717" strokeWidth="4" />
      <rect x="58" y="132" width="54" height="10" fill="#FFD966" stroke="#171717" strokeWidth="4" />
      <rect x="49" y="142" width="72" height="10" fill="#FF8FC7" stroke="#171717" strokeWidth="4" />
    </svg>
  );
}

const SCRIPT = ["> build", "> innovate", "> solve", "> repeat_"];
const FULL_SCRIPT = SCRIPT.join("\n");

function TerminalTyping() {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setCount(FULL_SCRIPT.length);
      return;
    }

    if (count >= FULL_SCRIPT.length) {
      const reset = window.setTimeout(() => setCount(0), 2600);
      return () => window.clearTimeout(reset);
    }

    const timer = window.setTimeout(() => setCount((value) => value + 1), 68);
    return () => window.clearTimeout(timer);
  }, [count, reduceMotion]);

  const visible = FULL_SCRIPT.slice(0, count).split("\n");

  return (
    <div className="font-mono text-[11px] leading-[1.6] text-ink sm:text-xs">
      <span className="sr-only">Terminal: build, innovate, solve, repeat.</span>
      <div aria-hidden="true">
        <p className="mb-1 text-[9px] font-bold tracking-[0.14em] text-ink/60">
          HACKRUSH.SH
        </p>
        {visible.map((line, index) => (
          <p key={`${line}-${index}`} className="whitespace-pre">
            {line}
            {index === visible.length - 1 && count < FULL_SCRIPT.length ? (
              <span className="caret ml-0.5" />
            ) : null}
          </p>
        ))}
        {count >= FULL_SCRIPT.length ? (
          <p className="whitespace-pre">
            {""}
            <span className="caret ml-0.5" />
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function RetroComputer({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("relative w-full max-w-[350px]", className)}>
      <Starburst className="absolute -left-12 top-3 -z-10 h-44 w-44 text-brand-lime sm:-left-16 sm:h-56 sm:w-56" />
      <motion.div
        aria-hidden="true"
        className="absolute -right-5 -top-6 z-10 h-9 w-9"
        animate={reduceMotion ? undefined : { rotate: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkle className="h-full w-full text-brand-pink" />
      </motion.div>

      <div className="relative ml-auto w-[92%] border-[3px] border-ink bg-brand-lavender p-2.5 shadow-[6px_6px_0_#171717]">
        <div className="mb-1.5 flex items-center justify-between px-0.5 font-mono text-[8px] font-bold tracking-[0.12em]">
          <span>T4H-26</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-ink" />
            CRT-01
          </span>
        </div>
        <div className="border-[3px] border-ink bg-ink p-1.5">
          <div className="min-h-[116px] border border-ink bg-brand-lime p-3 sm:min-h-[132px]">
            <TerminalTyping />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-0.5">
          <span className="h-2 w-2 rounded-full border border-ink bg-brand-pink" />
          <span className="h-1 w-12 bg-ink/25" />
          <span className="h-2 w-2 border border-ink bg-brand-sky" />
        </div>
      </div>

      <div className="ml-auto mr-[16%] h-5 w-16 border-x-[3px] border-b-[3px] border-ink bg-brand-lavender" />
      <div className="ml-auto mr-[6%] h-2.5 w-[68%] border-[3px] border-ink bg-brand-lavender" />

      <div className="ml-auto mr-[4%] mt-4 w-[80%] border-[3px] border-ink bg-white p-2 shadow-[4px_4px_0_#171717]">
        <div className="grid grid-cols-10 gap-[3px]">
          {Array.from({ length: 30 }, (_, index) => (
            <span
              key={index}
              className={cn(
                "h-2.5 border border-ink/50",
                index % 7 === 3 ? "bg-brand-pink" : "bg-paper",
              )}
            />
          ))}
        </div>
        <div className="mt-1 h-2.5 w-1/2 border border-ink/50 bg-brand-lavender/40" />
      </div>
    </div>
  );
}
