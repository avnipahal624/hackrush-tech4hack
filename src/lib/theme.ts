import type { TrackColor } from "@/types/event";

/** Explicit class strings so Tailwind can statically see every colour. */
export const colorBlock: Record<TrackColor, string> = {
  lavender: "bg-brand-lavender",
  lime: "bg-brand-lime",
  pink: "bg-brand-pink",
  sky: "bg-brand-sky",
  yellow: "bg-brand-yellow",
};

export const colorSoft: Record<TrackColor, string> = {
  lavender: "bg-brand-lavender/35",
  lime: "bg-brand-lime/35",
  pink: "bg-brand-pink/35",
  sky: "bg-brand-sky/35",
  yellow: "bg-brand-yellow/40",
};

export const colorChip: Record<TrackColor, string> = {
  lavender: "bg-brand-lavender",
  lime: "bg-brand-lime",
  pink: "bg-brand-pink",
  sky: "bg-brand-sky",
  yellow: "bg-brand-yellow",
};
