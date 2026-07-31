import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { LOADING_TIMING, reducedMotion } from "../lib/motion";

interface S0LoadingProps {
  onComplete: () => void;
}

type LoadingStyle = CSSProperties & {
  "--heart-fill-duration": string;
};

export function S0_Loading({ onComplete }: S0LoadingProps) {
  const [readyToExit, setReadyToExit] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let minimumTimer: number | undefined;
    const startedAt = performance.now();

    // SPEC-silent: S2 is CSS-only, so there is no hero bitmap to preload.
    const heroAssetReady = Promise.resolve();
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    void Promise.all([fontsReady, heroAssetReady]).then(() => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, LOADING_TIMING.minimumMs - elapsed);

      minimumTimer = window.setTimeout(() => {
        if (!cancelled) {
          setReadyToExit(true);
        }
      }, remaining);
    });

    return () => {
      cancelled = true;
      if (minimumTimer !== undefined) {
        window.clearTimeout(minimumTimer);
      }
    };
  }, []);

  const loadingStyle: LoadingStyle = {
    "--heart-fill-duration": `${LOADING_TIMING.heartPulse}s`,
  };

  return (
    <motion.section
      className="fixed inset-0 z-[60] grid min-h-[100dvh] place-items-center bg-paper px-6 text-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: readyToExit ? 0 : 1 }}
      transition={{ duration: LOADING_TIMING.fade }}
      onAnimationComplete={() => {
        if (readyToExit) {
          onComplete();
        }
      }}
      aria-label="Preparing your birthday gift"
    >
      <div className="flex flex-col items-center">
        <span
          className={`loading-heart ${reducedMotion ? "loading-heart-reduced" : ""}`}
          style={loadingStyle}
          aria-hidden="true"
        >
          <span className="loading-heart-outline">♡</span>
          <span className="loading-heart-fill">♥</span>
        </span>
        <p className="mt-5 font-handwriting text-2xl text-cherry">
          wrapping your gift…
        </p>
      </div>
    </motion.section>
  );
}
