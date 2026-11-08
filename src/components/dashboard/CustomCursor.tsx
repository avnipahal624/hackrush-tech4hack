import { useEffect, useRef } from "react";

/**
 * Subtle square cursor companion for desktop pointers. It never replaces the
 * native cursor, and is disabled for touch devices and reduced-motion users.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reduceMotion) return;

    const element = cursorRef.current;
    if (!element) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let visible = false;
    let hovering = false;
    let frame = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;
      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(animate);
    };

    const applyHover = (nextHovering: boolean) => {
      if (hovering === nextHovering) return;
      hovering = nextHovering;
      element.style.width = hovering ? "34px" : "16px";
      element.style.height = hovering ? "34px" : "16px";
      element.style.backgroundColor = hovering
        ? "rgba(217, 255, 67, 0.5)"
        : "rgba(217, 255, 67, 0.14)";
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
        element.style.opacity = "1";
      }
      const target = event.target as Element | null;
      applyHover(
        Boolean(
          target?.closest(
            "a, button, [role='button'], [role='checkbox'], input, textarea, select, label[for]",
          ),
        ),
      );
    };

    const onPointerLeave = () => {
      visible = false;
      element.style.opacity = "0";
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-4 w-4 border-2 border-ink opacity-0 transition-[width,height,background-color,opacity] duration-150 md:block"
    />
  );
}
