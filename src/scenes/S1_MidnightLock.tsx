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

/** How long she waits at zero before it takes her in on its own. */
const AUTO_ENTER_SECONDS = 5;

export function S1_MidnightLock({ onUnlock }: S1MidnightLockProps) {
  const targetTime = useMemo(
    () => Date.parse(content.her.birthdayISO),
    [],
  );
  const [countdown, setCountdown] = useState(() => getCountdown(targetTime));
  const [arrived, setArrived] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_ENTER_SECONDS);
  const [unlocking, setUnlocking] = useState(false);
  const hasTriggered = useRef(false);
  const hasEntered = useRef(false);

  // Zero does not hand her straight over any more. She gets a moment, a count,
  // and a way in of her own in case anything about the automatic step fails.
  const enter = useCallback(() => {
    if (hasEntered.current) return;
    hasEntered.current = true;
    setUnlocking(true);
  }, []);

  const beginUnlock = useCallback(() => {
    if (hasTriggered.current) {
      return;
    }

    hasTriggered.current = true;
    setCountdown(EMPTY_COUNTDOWN);
    setArrived(true);

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

    // Phones throttle or freeze timers in a backgrounded tab, so if she leaves
    // this open and comes back after midnight the interval alone can be late.
    // Checking on return means it has already unlocked by the time she looks.
    window.addEventListener("focus", updateCountdown);
    document.addEventListener("visibilitychange", updateCountdown);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", updateCountdown);
      document.removeEventListener("visibilitychange", updateCountdown);
    };
  }, [beginUnlock, targetTime]);

  useEffect(() => {
    if (!arrived) return;

    const tick = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(tick);
          enter();
          return 0;
        }
        return current - 1;
      });
    }, 1_000);

    return () => window.clearInterval(tick);
  }, [arrived, enter]);

  // The flash hands over on its animation callback. If that ever fails to
  // fire, this makes sure she is not left staring at a white screen.
  useEffect(() => {
    if (!unlocking) return;
    const failsafe = window.setTimeout(onUnlock, DUR.lockFlash * 1_000 + 400);
    return () => window.clearTimeout(failsafe);
  }, [unlocking, onUnlock]);

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
          {arrived
            ? `it's midnight, ${content.her.nickname.toLowerCase()}.`
            : `patience, ${content.her.nickname}… 🥱`}
        </p>

        <p
          className="whitespace-nowrap font-display text-[clamp(1.65rem,8vw,4.5rem)] leading-none text-ink [font-variant-numeric:tabular-nums]"
          aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
        >
          {pad(countdown.days)} : {pad(countdown.hours)} :{" "}
          {pad(countdown.minutes)} : {pad(countdown.seconds)}
        </p>

        {arrived ? (
          <motion.div
            className="lock-arrived"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p aria-live="polite">
              taking you in
              {secondsLeft > 0 ? ` in ${secondsLeft}…` : "…"}
            </p>
            <button type="button" onClick={enter}>
              or tap here to go in now
            </button>
          </motion.div>
        ) : (
          <div
            aria-hidden="true"
            className="mt-4 grid grid-cols-4 gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-ink/55 md:text-xs"
          >
            <span>days</span>
            <span>hours</span>
            <span>mins</span>
            <span>secs</span>
          </div>
        )}
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
