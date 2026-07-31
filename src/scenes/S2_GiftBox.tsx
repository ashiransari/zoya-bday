import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { content } from "../content";
import { audio } from "../lib/audio";
import { useAppCtx } from "../lib/AppCtx";
import { micro, type ConfettiOrigin } from "../lib/confetti";
import {
  DUR,
  EASE,
  GIFT_TIMING,
  reducedMotion,
  SPRING,
  STAGGER,
} from "../lib/motion";
import { seededRotation } from "../lib/seededRandom";

type GiftPhase = "closed" | "opening" | "open";

const BALLOONS = [
  { left: "20%", color: "bg-blush", drift: -28 },
  { left: "36%", color: "bg-cherry-bright", drift: 18 },
  { left: "61%", color: "bg-gold", drift: -14 },
  { left: "76%", color: "bg-blush", drift: 24 },
] as const;

export function S2_GiftBox() {
  const { setGiftOpened } = useAppCtx();
  const [phase, setPhase] = useState<GiftPhase>("closed");
  const boxRef = useRef<HTMLDivElement>(null);
  const confettiOrigin = useRef<ConfettiOrigin>();
  const isOpening = phase !== "closed";
  const rotation = seededRotation("birthday-gift", 1.5);

  // SPEC-silent: chose a quiet personalized subline because S2 does not specify its copy.
  const heroSubline = `today is all yours, ${content.her.name}.`;

  useEffect(() => {
    if (phase !== "opening") {
      return;
    }

    const celebrationTimer = window.setTimeout(() => {
      micro(confettiOrigin.current);
    }, GIFT_TIMING.celebration * 1_000);

    const revealTimer = window.setTimeout(() => {
      setGiftOpened(true);
      setPhase("open");
    }, GIFT_TIMING.heroReveal * 1_000);

    return () => {
      window.clearTimeout(celebrationTimer);
      window.clearTimeout(revealTimer);
    };
  }, [phase, setGiftOpened]);

  function openGift() {
    if (phase !== "closed") {
      return;
    }

    const bounds = boxRef.current?.getBoundingClientRect();
    if (bounds) {
      confettiOrigin.current = {
        x: (bounds.left + bounds.width / 2) / window.innerWidth,
        y: (bounds.top + bounds.height * 0.4) / window.innerHeight,
      };
    }

    audio.start();
    setPhase("opening");
  }

  const fadeOnly = reducedMotion ? { opacity: 0 } : undefined;

  return (
    <section className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-12">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[70vw] max-h-[460px] w-[70vw] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 blur-3xl"
      />

      {isOpening && !reducedMotion
        ? BALLOONS.map((balloon, index) => (
            <motion.div
              key={balloon.left}
              aria-hidden="true"
              className={`balloon ${balloon.color}`}
              style={{ left: balloon.left }}
              initial={{ opacity: 0, y: 80, x: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: "-115dvh",
                x: [0, balloon.drift, -balloon.drift / 2],
              }}
              transition={{
                delay: GIFT_TIMING.celebration + index * STAGGER.children,
                duration: GIFT_TIMING.balloonDrift,
                ease: EASE.out,
              }}
            />
          ))
        : null}

      <motion.div
        ref={boxRef}
        className="relative z-10 h-[330px] w-[min(80vw,360px)]"
        style={{ rotate: rotation }}
        animate={
          isOpening
            ? reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.9 }
            : { opacity: 1, scale: 1 }
        }
        transition={{
          delay: DUR.ribbonUntie + DUR.lidLift,
          duration: DUR.boxFade,
          ease: EASE.out,
        }}
        aria-hidden={phase === "open"}
      >
        <p className="absolute inset-x-0 top-0 text-center font-handwriting text-xl text-cherry md:text-2xl">
          for {content.her.name} — tap the bow 🎀
        </p>

        <div
          aria-hidden="true"
          className="absolute inset-x-[8%] bottom-2 h-8 rounded-[50%] bg-ink/20 blur-xl"
        />

        <div className="gift-gingham absolute inset-x-0 bottom-7 h-[202px] overflow-hidden rounded-b-xl shadow-paper">
          <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gold/95" />
          <motion.div
            className="absolute left-0 top-[82px] h-9 w-1/2 bg-gold"
            animate={
              isOpening
                ? fadeOnly ?? { x: -60, opacity: 0 }
                : { x: 0, opacity: 1 }
            }
            transition={{ duration: DUR.ribbonUntie, ease: EASE.out }}
          />
          <motion.div
            className="absolute right-0 top-[82px] h-9 w-1/2 bg-gold"
            animate={
              isOpening
                ? fadeOnly ?? { x: 60, opacity: 0 }
                : { x: 0, opacity: 1 }
            }
            transition={{ duration: DUR.ribbonUntie, ease: EASE.out }}
          />
        </div>

        <motion.div
          className="gift-gingham absolute inset-x-[-3%] bottom-[218px] h-14 rounded-lg shadow-paper"
          animate={
            isOpening
              ? reducedMotion
                ? { opacity: 0 }
                : { y: -60, rotate: 8, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          transition={{
            delay: DUR.ribbonUntie,
            duration: DUR.lidLift,
            ease: EASE.out,
          }}
        >
          <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gold/95" />
        </motion.div>

        <motion.button
          type="button"
          className="gift-bow absolute left-1/2 top-[53px] z-20 h-16 w-20 -translate-x-1/2 touch-manipulation"
          aria-label={`Open ${content.her.name}'s birthday gift`}
          onClick={openGift}
          disabled={phase !== "closed"}
          animate={isOpening ? { opacity: 0, scale: reducedMotion ? 1 : 0.8 } : { opacity: 1, scale: 1 }}
          transition={{ duration: DUR.ribbonUntie, ease: EASE.out }}
        >
          <span className="bow-loop bow-loop-left" aria-hidden="true" />
          <span className="bow-loop bow-loop-right" aria-hidden="true" />
          <span className="bow-knot" aria-hidden="true" />
          <span className="bow-tail bow-tail-left" aria-hidden="true" />
          <span className="bow-tail bow-tail-right" aria-hidden="true" />
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-20 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
        aria-hidden={!isOpening}
        initial={false}
        animate={isOpening ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, pointerEvents: "none" },
          visible: {
            opacity: 1,
            pointerEvents: "auto",
            transition: {
              delayChildren: GIFT_TIMING.heroReveal,
              staggerChildren: STAGGER.children,
            },
          },
        }}
      >
        <motion.p
          className="font-display text-display leading-none text-cherry"
          variants={{
            hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: reducedMotion
                ? { duration: GIFT_TIMING.reducedFade }
                : SPRING.settle,
            },
          }}
        >
          Happy Birthday
        </motion.p>

        <motion.p
          className="age-outline -my-2 font-display text-age leading-none"
          variants={{
            hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.78 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: reducedMotion
                ? { duration: GIFT_TIMING.reducedFade }
                : SPRING.card,
            },
          }}
        >
          {content.her.turningAge}
        </motion.p>

        <motion.p
          className="max-w-sm font-handwriting text-2xl text-ink/75 md:text-3xl"
          variants={{
            hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: reducedMotion
                ? { duration: GIFT_TIMING.reducedFade }
                : SPRING.settle,
            },
          }}
        >
          {heroSubline}
        </motion.p>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] text-2xl text-cherry"
          initial={{ opacity: 0 }}
          animate={
            isOpening
              ? reducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: [0, 8, 0] }
              : { opacity: 0 }
          }
          transition={
            reducedMotion
              ? {
                  delay: GIFT_TIMING.scrollHint,
                  duration: GIFT_TIMING.reducedFade,
                }
              : {
                  delay: GIFT_TIMING.scrollHint,
                  duration: GIFT_TIMING.scrollBounce,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
          }
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
