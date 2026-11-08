import { useEffect, useRef } from "react";

/** Tiny opt-in interface blip. No audio assets, no autoplay. */
export function useClickSound(enabled: boolean): void {
  const contextRef = useRef<AudioContext | null>(null);
  const lastPlayed = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (
        !target?.closest(
          "button, a, [role='button'], [role='checkbox'], label[for]",
        )
      ) {
        return;
      }

      const now = performance.now();
      if (now - lastPlayed.current < 45) return;
      lastPlayed.current = now;

      try {
        if (!contextRef.current) {
          contextRef.current = new AudioContext();
        }
        const context = contextRef.current;
        if (context.state === "suspended") {
          void context.resume();
        }
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(520, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          290,
          context.currentTime + 0.045,
        );
        gain.gain.setValueAtTime(0.028, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          context.currentTime + 0.06,
        );
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.065);
      } catch {
        // Audio is a progressive enhancement; ignore unavailable contexts.
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [enabled]);
}
