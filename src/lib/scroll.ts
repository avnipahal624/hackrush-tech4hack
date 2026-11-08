/** Scroll to a section while respecting the visitor's motion preference. */
export function scrollToSection(id: string): void {
  if (typeof window === "undefined") return;
  const element = document.getElementById(id);
  if (!element) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  element.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}
