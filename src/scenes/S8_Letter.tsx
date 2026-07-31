import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioNote } from "../components/AudioNote";
import { content } from "../content";
import {
  DUR,
  EASE,
  LETTER_TIMING,
  reducedMotion,
  SPRING,
} from "../lib/motion";
import { seededRotation } from "../lib/seededRandom";
import { useTypewriter } from "../lib/useTypewriter";

type LetterPhase = "sealed" | "opening" | "open";

function LetterText() {
  const { rendered, done, skip } = useTypewriter(content.letter.paragraphs);
  const visibleParagraphs = rendered.length > 0 ? rendered : [""];

  return (
    <div className="letter-copy" data-typewriter-done={done}>
      {!done && (
        <button type="button" className="letter-skip" onClick={skip}>
          skip →
        </button>
      )}

      {content.letter.voiceSrc && <AudioNote src={content.letter.voiceSrc} />}

      <div className="letter-paragraphs">
        {visibleParagraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph}
            {!done && index === visibleParagraphs.length - 1 && (
              <span
                className="typewriter-cursor"
                style={
                  {
                    "--cursor-duration": `${LETTER_TIMING.cursorBlink}s`,
                  } as CSSProperties
                }
                aria-hidden="true"
              />
            )}
          </p>
        ))}
      </div>

      {done && (
        <motion.div
          className="letter-signature"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: LETTER_TIMING.reducedFade }}
        >
          <span>{content.you.signOff}</span>
          <strong>{content.you.name}</strong>
        </motion.div>
      )}
    </div>
  );
}

export function S8_Letter() {
  const [phase, setPhase] = useState<LetterPhase>("sealed");
  const [typingStarted, setTypingStarted] = useState(reducedMotion);
  const paperRef = useRef<HTMLElement>(null);
  const openedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const initial = content.her.name.trim().charAt(0).toUpperCase() || "♥";
  const rotation = reducedMotion ? 0 : seededRotation("the-letter", 1.8);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    if (phase !== "open") return;
    const frame = window.requestAnimationFrame(() => {
      paperRef.current?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  const openLetter = () => {
    if (openedRef.current) return;
    openedRef.current = true;

    if (reducedMotion) {
      setPhase("open");
      setTypingStarted(true);
      return;
    }

    setPhase("opening");
    timersRef.current.push(
      window.setTimeout(
        () => setPhase("open"),
        LETTER_TIMING.paperReveal * 1_000,
      ),
      window.setTimeout(
        () => setTypingStarted(true),
        LETTER_TIMING.typewriterStart * 1_000,
      ),
    );
  };

  return (
    <section id="letter" className="letter-scene" data-letter-phase={phase}>
      <motion.p
        className="letter-intro"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: LETTER_TIMING.reducedFade }}
      >
        one more thing. this one&apos;s sealed.
      </motion.p>

      <AnimatePresence mode="sync">
        {phase !== "open" ? (
          <motion.div
            key="envelope-stage"
            className="letter-envelope-stage"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: LETTER_TIMING.reducedFade }}
          >
            <motion.button
              type="button"
              className="letter-envelope"
              data-testid="letter-envelope"
              aria-label={`Open the sealed letter for ${content.her.name}`}
              disabled={phase === "opening"}
              onClick={openLetter}
              style={{ rotate: rotation }}
              animate={
                phase === "opening"
                  ? { opacity: [1, 1, 0] }
                  : { opacity: 1 }
              }
              transition={{
                duration: LETTER_TIMING.paperReveal,
                times: [0, (DUR.sealCrack + DUR.flapOpen) / LETTER_TIMING.paperReveal, 1],
              }}
            >
              <motion.span
                className="letter-sheet-preview"
                layoutId="birthday-letter-sheet"
                animate={
                  phase === "opening"
                    ? reducedMotion
                      ? { opacity: 0 }
                      : { y: "-48%", scale: 1.18, opacity: 1 }
                    : { y: 0, scale: 1, opacity: 0.62 }
                }
                transition={{
                  delay: DUR.sealCrack + DUR.flapOpen,
                  duration: DUR.sheetRise,
                  ...SPRING.gentle,
                }}
              />

              <motion.span
                className="letter-envelope-flap"
                animate={
                  phase === "opening" && !reducedMotion
                    ? { rotateX: -170 }
                    : { rotateX: 0 }
                }
                transition={{
                  delay: DUR.sealCrack,
                  duration: DUR.flapOpen,
                  ease: EASE.inOut,
                }}
              />
              <span className="letter-envelope-pocket" />
              <span className="letter-address">For {content.her.name}</span>

              <span className="letter-wax-position">
                <motion.span
                  className="letter-wax-seal"
                  data-testid="letter-wax-seal"
                  animate={
                    phase === "opening"
                      ? reducedMotion
                        ? { opacity: 0 }
                        : {
                            scale: [1, 1.15, 0.9],
                            rotate: [0, 12, 12],
                            opacity: [1, 1, 0],
                          }
                      : { scale: 1, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: DUR.sealCrack, ease: EASE.out }}
                >
                  <span className="letter-wax-half letter-wax-half-left" />
                  <span className="letter-wax-half letter-wax-half-right" />
                  <span className="letter-wax-initial">{initial}</span>
                </motion.span>
              </span>
            </motion.button>
            <p className="letter-open-prompt">
              {phase === "sealed" ? "tap to break the seal" : "opening…"}
            </p>
          </motion.div>
        ) : (
          <motion.article
            ref={paperRef}
            key="letter-paper"
            layoutId="birthday-letter-sheet"
            className="letter-paper"
            data-testid="letter-paper"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: LETTER_TIMING.reducedFade }
                : SPRING.gentle
            }
          >
            {typingStarted && <LetterText />}
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  );
}
