import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "../content";
import { micro } from "../lib/confetti";
import { DUR, LOCK_TIMING, reducedMotion } from "../lib/motion";

interface S1MidnightLockProps {
  onUnlock: () => void;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EMPTY_COUNTDOWN: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdown(targetTime: number): Countdown {
  const remaining = Math.max(0, targetTime - Date.now());

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor(remaining / 3_600_000) % 24,
    minutes: Math.floor(remaining / 60_000) % 60,
    seconds: Math.floor(remaining / 1_000) % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function S1_MidnightLock({ onUnlock }: S1MidnightLockProps) {
  const targetTime = useMemo(
    () => Date.parse(content.her.birthdayISO),
    [],
  );
  const [countdown, setCountdown] = useState(() => getCountdown(targetTime));
  const [unlocking, setUnlocking] = useState(false);
  const hasTriggered = useRef(false);

  const beginUnlock = useCallback(() => {
    if (hasTriggered.current) {
      return;
    }

    hasTriggered.current = true;
    setCountdown(EMPTY_COUNTDOWN);
    setUnlocking(true);

    if (!reducedMotion) {
      micro();
    }
  }, []);

  useEffect(() => {
    function updateCountdown() {
      const remaining = targetTime - Date.now();

      if (remaining <= 0) {
        beginUnlock();
        return;
      }

      setCountdown(getCountdown(targetTime));
    }

    updateCountdown();
    const interval = window.setInterval(updateCountdown, LOCK_TIMING.tickMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [beginUnlock, targetTime]);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-paper px-4 py-12 text-center">
      <motion.div
        animate={
          reducedMotion
            ? { opacity: 1 }
            : { opacity: [1, 0.75, 1] }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: LOCK_TIMING.pulse,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
        }
      >
        <p className="mb-7 font-handwriting text-2xl text-cherry">
          patience, {content.her.nickname}… 🥱
        </p>

        <p
          className="whitespace-nowrap font-display text-[clamp(1.65rem,8vw,4.5rem)] leading-none text-ink [font-variant-numeric:tabular-nums]"
          aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
        >
          {pad(countdown.days)} : {pad(countdown.hours)} :{" "}
          {pad(countdown.minutes)} : {pad(countdown.seconds)}
        </p>

        <div
          aria-hidden="true"
          className="mt-4 grid grid-cols-4 gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-ink/55 md:text-xs"
        >
          <span>days</span>
          <span>hours</span>
          <span>mins</span>
          <span>secs</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {unlocking ? (
          <motion.div
            className="fixed inset-0 z-[70] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: DUR.lockFlash,
              times: [0, 0.4, 1],
            }}
            onAnimationComplete={onUnlock}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
