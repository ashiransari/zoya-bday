import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "../content";
import { mega } from "../lib/confetti";
import {
  DUR,
  EASE,
  FINALE_TIMING,
  reducedMotion,
  SPRING,
} from "../lib/motion";
import { seeded } from "../lib/seededRandom";
import { useCountUp } from "../lib/useCountUp";

const TAKEOVER_HEARTS = 24;

export function S9_Finale() {
  const elapsed = useCountUp(content.us.startedISO);
  const [giftFlipped, setGiftFlipped] = useState(false);
  const [takeover, setTakeover] = useState(false);
  const giftClue = content.giftClue;
  const birthdayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
        new Date(content.her.birthdayISO),
      ),
    [],
  );

  const revealFinale = () => {
    if (takeover) return;
    setTakeover(true);
    if (!reducedMotion) mega();
  };

  return (
    <section id="finale" className="finale-scene">
      <motion.div
        className="finale-content"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={
          reducedMotion
            ? { duration: FINALE_TIMING.reducedFade }
            : SPRING.settle
        }
      >
        <p className="finale-counter-label">{content.us.counterLabel}</p>
        <p className="finale-counter" data-testid="relationship-counter">
          <span data-testid="counter-days">{elapsed.days}</span> days,{" "}
          <span data-testid="counter-hours">{elapsed.hours}</span> hours,{" "}
          <span data-testid="counter-minutes">{elapsed.minutes}</span> minutes
          <span className="finale-seconds">
            , <span data-testid="counter-seconds">{elapsed.seconds}</span> seconds
          </span>
        </p>
        <p className="finale-counting">…and counting. forever to go.</p>

        <div className="finale-someday">
          <h2>someday soon:</h2>
          <ul>
            {content.us.cantWaitFor.map((item) => (
              <li key={item}>
                <span className="finale-checkbox" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {giftClue && (
          <button
            type="button"
            className="finale-gift-tag"
            aria-label={giftFlipped ? "Hide the gift clue" : "Reveal the gift clue"}
            aria-pressed={giftFlipped}
            onClick={() => setGiftFlipped((current) => !current)}
          >
            <motion.span
              className="finale-gift-inner"
              animate={{ rotateY: giftFlipped ? 180 : 0 }}
              transition={{ duration: DUR.flip, ease: EASE.inOut }}
            >
              <span className="finale-gift-face finale-gift-front">
                one more thing… 🎁
              </span>
              <span className="finale-gift-face finale-gift-back">
                {giftClue.riddle}
              </span>
            </motion.span>
          </button>
        )}

        <button type="button" className="finale-button" onClick={revealFinale}>
          one last thing
        </button>

        <footer>
          made with too much love and a questionable amount of code —{" "}
          {content.you.name}, {birthdayLabel}
        </footer>
      </motion.div>

      <AnimatePresence>
        {takeover && (
          <motion.div
            className="finale-takeover"
            data-testid="finale-takeover"
            role="dialog"
            aria-modal="true"
            aria-label="Birthday finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: FINALE_TIMING.reducedFade }}
          >
            {!reducedMotion && (
              <div className="finale-heart-rain" aria-hidden="true">
                {Array.from({ length: TAKEOVER_HEARTS }, (_, index) => (
                  <span
                    key={index}
                    style={
                      {
                        left: `${seeded(`finale-heart-x-${index}`) * 100}%`,
                        fontSize: `${12 + seeded(`finale-heart-size-${index}`) * 18}px`,
                        animationDelay: `${-(seeded(`finale-heart-delay-${index}`) * FINALE_TIMING.heartRain)}s`,
                        animationDuration: `${FINALE_TIMING.heartRain + seeded(`finale-heart-duration-${index}`) * 2}s`,
                      } as CSSProperties
                    }
                  >
                    ♥
                  </span>
                ))}
              </div>
            )}

            <motion.div
              className="finale-takeover-copy"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: FINALE_TIMING.lineStagger },
                },
              }}
            >
              {[content.finale.line1, content.finale.line2].map((line) => (
                <motion.p
                  key={line}
                  variants={{
                    hidden: reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 18 },
                    visible: reducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: FINALE_TIMING.reducedFade }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
