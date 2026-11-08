import type { ReactNode } from "react";
import type { TrackColor } from "@/types/event";
import { colorBlock } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  title: string;
  color?: TrackColor;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  index,
  title,
  color = "lime",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-wrap items-end justify-between gap-3",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="brutal-border bg-white px-2 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em]">
          {index}
        </span>
        <h2
          className={cn(
            "brutal-border px-3 py-1.5 font-display text-lg uppercase leading-none tracking-tight text-ink shadow-[4px_4px_0_#171717] sm:px-4 sm:py-2 sm:text-xl",
            colorBlock[color],
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
