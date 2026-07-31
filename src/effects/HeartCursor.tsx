import { useEffect, useRef } from "react";
import { EASTER_EGG_TIMING, reducedMotion } from "../lib/motion";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
  size: number;
}

const MAX_SPARKLES = 30;

export function HeartCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reducedMotion || navigator.maxTouchPoints > 0 || !finePointer) return;

    const canvas = canvasRef.current;
    const heart = heartRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !heart || !context) return;

    const sparkles: Sparkle[] = [];
    let animationFrame: number | undefined;
    let lastSparkleAt = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      heart.style.opacity = "1";
      heart.style.transform = `translate3d(${event.clientX + 8}px, ${event.clientY + 8}px, 0)`;

      const now = performance.now();
      if (now - lastSparkleAt < EASTER_EGG_TIMING.sparkleThrottleMs) return;
      lastSparkleAt = now;
      sparkles.push({
        x: event.clientX,
        y: event.clientY,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.35 - Math.random() * 0.35,
        bornAt: now,
        size: 1.5 + Math.random() * 2.5,
      });
      if (sparkles.length > MAX_SPARKLES) sparkles.splice(0, sparkles.length - MAX_SPARKLES);
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = sparkles.length - 1; index >= 0; index -= 1) {
        const sparkle = sparkles[index];
        const age = now - sparkle.bornAt;
        if (age >= EASTER_EGG_TIMING.sparkleLifeMs) {
          sparkles.splice(index, 1);
          continue;
        }

        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        const life = 1 - age / EASTER_EGG_TIMING.sparkleLifeMs;
        context.beginPath();
        context.fillStyle = `rgb(201 162 39 / ${life * 0.72})`;
        context.arc(sparkle.x, sparkle.y, sparkle.size * life, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    document.body.classList.add("heart-cursor-active");
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      document.body.classList.remove("heart-cursor-active");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="heart-cursor-canvas" aria-hidden="true" />
      <span ref={heartRef} className="heart-cursor-heart" aria-hidden="true">
        ♥
      </span>
    </>
  );
}
