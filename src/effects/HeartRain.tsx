import { useRef, type CSSProperties } from "react";
import { EASTER_EGG_TIMING } from "../lib/motion";
import { seeded } from "../lib/seededRandom";

const HEART_COUNT = 36;

interface HeartRainProps {
  runId: number;
  onComplete: () => void;
}

export function HeartRain({ runId, onComplete }: HeartRainProps) {
  const completedRef = useRef(0);

  const handleAnimationEnd = () => {
    completedRef.current += 1;
    if (completedRef.current === HEART_COUNT) onComplete();
  };

  return (
    <div className="nickname-heart-rain" data-testid="nickname-heart-rain" aria-hidden="true">
      {Array.from({ length: HEART_COUNT }, (_, index) => {
        const key = `${runId}-${index}`;
        const duration = 3 + seeded(`nickname-duration-${key}`) * 0.6;
        const delay = seeded(`nickname-delay-${key}`) * 0.35;

        return (
          <span
            key={key}
            onAnimationEnd={handleAnimationEnd}
            style={
              {
                left: `${seeded(`nickname-x-${key}`) * 100}%`,
                fontSize: `${12 + seeded(`nickname-size-${key}`) * 20}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${Math.min(duration, EASTER_EGG_TIMING.heartRain - delay)}s`,
              } as CSSProperties
            }
          >
            ♥
          </span>
        );
      })}
    </div>
  );
}
