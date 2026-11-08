import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  angle: number;
  spin: number;
  life: number;
}

const COLORS = ["#D9FF43", "#FF8FC7", "#C6A7FF", "#89DDF8", "#FFD966", "#FFAB70", "#171717"];

/** Lightweight canvas confetti, only mounted after a successful demo save. */
export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: Particle[] = Array.from({ length: 110 }, () => ({
      x: width / 2 + (Math.random() - 0.5) * width * 0.45,
      y: height * 0.24 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 11 - 2,
      size: 5 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.25,
      life: 1,
    }));

    let animationId = 0;
    const startedAt = performance.now();

    const draw = (time: number) => {
      const elapsed = time - startedAt;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.vy += 0.26;
        particle.vx *= 0.995;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.spin;
        particle.life = Math.max(0, 1 - elapsed / 3200);

        context.save();
        context.globalAlpha = particle.life;
        context.translate(particle.x, particle.y);
        context.rotate(particle.angle);
        context.fillStyle = particle.color;
        context.fillRect(
          -particle.size / 2,
          -particle.size / 4,
          particle.size,
          particle.size / 2,
        );
        context.restore();
      });

      if (elapsed < 3600) {
        animationId = window.requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    animationId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
