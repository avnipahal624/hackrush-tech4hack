import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "lime" | "pink" | "lavender" | "white" | "ink" | "orange";

const variants: Record<Variant, string> = {
  lime: "bg-brand-lime text-ink hover:bg-[#e4ff7a]",
  pink: "bg-brand-pink text-ink hover:bg-[#ffa9d5]",
  lavender: "bg-brand-lavender text-ink hover:bg-[#d3bbff]",
  white: "bg-white text-ink hover:bg-paper",
  ink: "bg-ink text-paper hover:bg-[#2c2c2c]",
  orange: "bg-brand-orange text-ink hover:bg-[#ffbd8d]",
};

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function BrutalButton({
  variant = "lime",
  className,
  children,
  type = "button",
  ...props
}: BrutalButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "brutal-btn px-4 py-3 text-xs uppercase tracking-[0.08em] sm:px-5 sm:text-sm",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
