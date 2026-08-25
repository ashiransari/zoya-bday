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

/** Things she can pick up and move. Checked first, since they are also buttons. */
const DRAGGABLE = "[data-polaroid-id]";
/** Things that respond to a click. */
const CLICKABLE =
  'button, a[href], [role="button"], input, select, textarea, label, summary';

type CursorState = "idle" | "click" | "drag" | "grabbing";

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
    let held = false;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    // The native cursor is hidden, so this has to carry every affordance the
    // arrow normally would: a ring when something is clickable, a wider dashed
    // ring when it can be dragged, and a tightened one while it is held.
    const stateFor = (target: EventTarget | null): CursorState => {
      if (!(target instanceof Element)) return "idle";
      if (target.closest(DRAGGABLE)) return held ? "grabbing" : "drag";
      if (target.closest(CLICKABLE)) return "click";
      return "idle";
    };

    const applyState = (target: EventTarget | null) => {
      heart.dataset.state = stateFor(target);
    };

    const handlePointerMove = (event: PointerEvent) => {
      heart.style.opacity = "1";
      heart.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      applyState(event.target);

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
      if (sparkles.length > MAX_SPARKLES) {
        sparkles.splice(0, sparkles.length - MAX_SPARKLES);
      }
    };

    const handleDown = (event: PointerEvent) => {
      held = true;
      applyState(event.target);
    };

    const handleUp = (event: PointerEvent) => {
      held = false;
      applyState(event.target);
    };

    const handleLeave = () => {
      heart.style.opacity = "0";
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
        context.fillStyle = `rgba(201, 162, 39, ${life * 0.72})`;
        context.arc(sparkle.x, sparkle.y, sparkle.size * life, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    document.body.classList.add("heart-cursor-active");
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      document.body.classList.remove("heart-cursor-active");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointerleave", handleLeave);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="heart-cursor-canvas" aria-hidden="true" />
      <span
        ref={heartRef}
        className="heart-cursor-heart"
        data-state="idle"
        aria-hidden="true"
      >
        <span className="heart-cursor-ring" />
        <span className="heart-cursor-glyph">♥</span>
      </span>
    </>
  );
}
