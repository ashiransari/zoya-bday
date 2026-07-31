import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "../components/Section";
import { content } from "../content";
import { pop } from "../lib/confetti";
import {
  REASONS_TIMING,
  reducedMotion,
  SPRING,
} from "../lib/motion";
import { seededRotation } from "../lib/seededRandom";

type FinalCardStyle = CSSProperties & {
  "--reason-shimmer-duration": string;
};

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function S5_ReasonsDeck() {
  const [drawnCount, setDrawnCount] = useState(0);
  const celebratedIndex = useRef<number | null>(null);
  const isDesktop = useDesktopLayout();
  const revealedIndex = drawnCount - 1;
  const revealedReason = content.reasons[revealedIndex];
  const isComplete = drawnCount >= content.reasons.length;
  const isFinalCard =
    revealedIndex >= 0 && revealedIndex === content.reasons.length - 1;

  useEffect(() => {
    if (
      isFinalCard &&
      celebratedIndex.current !== revealedIndex &&
      !reducedMotion
    ) {
      celebratedIndex.current = revealedIndex;
      pop();
    }
  }, [isFinalCard, revealedIndex]);

  function drawReason() {
    if (!isComplete) {
      setDrawnCount((current) => current + 1);
    }
  }

  function startOver() {
    celebratedIndex.current = null;
    setDrawnCount(0);
  }

  const finalCardStyle: FinalCardStyle = {
    "--reason-shimmer-duration": `${REASONS_TIMING.shimmer}s`,
  };

  return (
    <section
      id="reasons-deck"
      className="relative overflow-hidden bg-paper px-5 py-24 md:px-8 md:py-32"
    >
      <Section className="relative z-10 mx-auto mb-14 max-w-4xl text-center md:mb-20">
        <div>
          <h2 className="font-display text-[clamp(2.3rem,6vw,4.7rem)] leading-[1.02] text-cherry">
            {content.her.turningAge} reasons you&apos;re my favorite person
          </h2>
          <p className="mt-4 font-handwriting text-2xl text-ink/65">
            one for every year of you.
          </p>
        </div>
      </Section>

      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col items-center">
          <div
            className="reason-deck relative h-[230px] w-full max-w-[330px]"
            data-testid="reasons-card-deck"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-y-3 rotate-2 rounded-2xl border border-cherry/10 bg-paper-deep shadow-paper"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-y-1.5 -rotate-2 rounded-2xl border border-cherry/10 bg-[#f7ead8] shadow-paper"
            />
            <motion.button
              type="button"
              className="absolute inset-0 flex min-h-[44px] w-full touch-manipulation flex-col items-center justify-center rounded-2xl border border-cherry/15 bg-paper-deep px-8 text-center shadow-paper disabled:cursor-default"
              onClick={drawReason}
              disabled={isComplete || content.reasons.length === 0}
              whileTap={
                reducedMotion || isComplete ? undefined : { scale: 0.98 }
              }
              transition={SPRING.card}
              aria-label={
                isComplete
                  ? "All reasons revealed"
                  : `Draw reason ${drawnCount + 1}`
              }
            >
              <span className="font-display text-5xl leading-none text-cherry">
                ♥
              </span>
              <span className="mt-4 font-handwriting text-2xl text-ink/70">
                {isComplete ? "every card is yours" : "tap to draw a reason"}
              </span>
            </motion.button>
          </div>

          <p
            className="mt-8 font-body text-xs font-medium uppercase tracking-[0.18em] text-ink/55 [font-variant-numeric:tabular-nums]"
            aria-live="polite"
            data-testid="reasons-counter"
          >
            {drawnCount} / {content.her.turningAge}
          </p>
        </div>

        <div className="flex min-h-[300px] flex-col items-center justify-center md:min-h-[340px]">
          <AnimatePresence mode="wait">
            {revealedReason ? (
              <motion.article
                key={revealedIndex}
                className={`reason-card relative flex min-h-[260px] w-full max-w-md flex-col items-start justify-center overflow-hidden rounded-2xl px-8 py-10 shadow-paper ${
                  isFinalCard
                    ? "reason-card-final border-2 border-gold bg-cherry text-paper"
                    : "border border-cherry/15 bg-paper-deep text-ink"
                }`}
                style={isFinalCard ? finalCardStyle : undefined}
                data-testid="revealed-reason-card"
                data-final={isFinalCard ? "true" : "false"}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        x: isDesktop ? -160 : 0,
                        y: isDesktop ? 0 : -90,
                        rotate: seededRotation(`reason-${revealedIndex}`, 2),
                        scale: 0.94,
                      }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotate: isFinalCard
                          ? 0
                          : seededRotation(`reason-${revealedIndex}`, 2),
                        scale: isFinalCard ? 1.08 : 1,
                      }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 18, scale: 0.97 }
                }
                transition={
                  reducedMotion
                    ? { duration: REASONS_TIMING.reducedFade }
                    : SPRING.card
                }
                aria-live="polite"
              >
                <span
                  className={`relative z-10 inline-flex rounded-full px-3 py-1 font-body text-xs font-medium uppercase tracking-[0.14em] ${
                    isFinalCard
                      ? "bg-gold text-ink"
                      : "bg-cherry text-paper"
                  }`}
                >
                  Reason #{revealedIndex + 1}
                </span>
                <p className="relative z-10 mt-6 font-handwriting text-[22px] leading-snug">
                  {revealedReason}
                </p>
              </motion.article>
            ) : (
              <motion.p
                key="reason-placeholder"
                className="font-handwriting text-2xl text-ink/45"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                your first reason is waiting…
              </motion.p>
            )}
          </AnimatePresence>

          {isComplete && content.reasons.length > 0 ? (
            <button
              type="button"
              className="mt-9 min-h-11 px-4 font-body text-sm font-medium text-cherry underline decoration-cherry/35 underline-offset-4 transition-colors hover:text-cherry-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              onClick={startOver}
            >
              start over
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
