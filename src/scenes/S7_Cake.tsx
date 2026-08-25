import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "../content";
import { audio } from "../lib/audio";
import { mega } from "../lib/confetti";
import {
  CAKE_TIMING,
  DUR,
  EASE,
  reducedMotion,
} from "../lib/motion";
import { seeded } from "../lib/seededRandom";
import { useMicBlow } from "../lib/useMicBlow";

type CakePhase =
  | "ready"
  | "extinguishing"
  | "blackout"
  | "wish"
  | "celebrated";

interface BlowControlsProps {
  onBlow: () => void;
}

function BlowControls({ onBlow }: BlowControlsProps) {
  const { start, status, level } = useMicBlow(onBlow);
  // Offer the microphone everywhere. Laptops have one too, and if it is
  // refused or missing the denied/unsupported branch below drops straight
  // to tapping.
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (status === "denied" || status === "unsupported") {
      setFallbackVisible(true);
      return;
    }

    // While listening, the candles are guaranteed to go out on their own, so
    // offering a tap button here would only flash on screen and then vanish.
    // The fallback is for when the microphone was refused or is unavailable.
  }, [status]);

  const handleTap = () => {
    const nextCount = tapCount + 1;
    if (nextCount >= CAKE_TIMING.fallbackTaps) {
      onBlow();
      return;
    }
    setTapCount(nextCount);
  };

  return (
    <div className="cake-controls" data-mic-status={status}>
      <p className="cake-cta">
        <strong>blow out your candles</strong>. yes, really. use your breath 🎂
      </p>

      {fallbackVisible ? (
        <div className="cake-fallback-wrap">
          <button
            type="button"
            className="cake-action cake-fallback"
            data-testid="cake-tap-fallback"
            onClick={handleTap}
          >
            tap-tap-tap to blow 💨
          </button>
          <span className="cake-tap-progress" aria-live="polite">
            {tapCount} / {CAKE_TIMING.fallbackTaps}
          </span>
        </div>
      ) : status === "idle" ? (
        <button type="button" className="cake-action" onClick={() => void start()}>
          use my microphone
        </button>
      ) : status === "listening" ? (
        <div className="cake-listening-wrap">
          <p className="cake-listening" role="status">
            listening… take a breath and blow
          </p>
          {/* Shows her the mic is actually hearing something, and tells us
              whether a failure is detection or permission. */}
          <span className="cake-level" aria-hidden="true">
            <span
              className="cake-level-fill"
              style={{ transform: `scaleX(${Math.max(0.02, level)})` }}
            />
          </span>
        </div>
      ) : null}
    </div>
  );
}

function chunkCandles(count: number) {
  const rows: number[][] = [];
  for (let start = 0; start < count; start += 9) {
    rows.push(
      Array.from({ length: Math.min(9, count - start) }, (_, index) =>
        start + index,
      ),
    );
  }
  return rows;
}

export function S7_Cake() {
  const sceneRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<CakePhase>("ready");
  const blowingRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const candleRows = useMemo(
    () => chunkCandles(content.her.turningAge),
    [],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const schedule = useCallback((callback: () => void, delaySeconds: number) => {
    const timer = window.setTimeout(callback, delaySeconds * 1_000);
    timersRef.current.push(timer);
  }, []);

  const extinguish = useCallback(() => {
    if (blowingRef.current) return;
    blowingRef.current = true;

    const lastFlameDelay =
      (content.her.turningAge - 1) * DUR.flameStagger;
    const blackoutAt =
      lastFlameDelay + CAKE_TIMING.flameOut + CAKE_TIMING.smoke;
    const wishAt = blackoutAt + CAKE_TIMING.blackout;
    const celebrateAt = wishAt + DUR.wishHold;

    setPhase("extinguishing");
    schedule(() => setPhase("blackout"), blackoutAt);
    schedule(() => setPhase("wish"), wishAt);
    schedule(() => {
      setPhase("celebrated");
      audio.swell();
      if (!reducedMotion) mega();
    }, celebrateAt);
  }, [schedule]);

  const showCake = phase === "ready" || phase === "extinguishing";
  const showWish = phase === "wish" || phase === "celebrated";

  return (
    <motion.section
      ref={sceneRef}
      id="cake"
      className={`cake-scene cake-phase-${phase}`}
      data-testid="cake-scene"
      data-phase={phase}
      animate={{ backgroundColor: phase === "blackout" ? "#050305" : "#171016" }}
      transition={{
        duration:
          phase === "blackout"
            ? CAKE_TIMING.blackout
            : CAKE_TIMING.reducedFade,
        ease: EASE.inOut,
      }}
    >
      <motion.div
        className="cake-dimmer"
        aria-hidden="true"
        animate={{ opacity: phase === "blackout" || showWish ? 0.72 : 0 }}
        transition={{
          duration:
            phase === "blackout"
              ? CAKE_TIMING.blackout
              : CAKE_TIMING.reducedFade,
          ease: EASE.inOut,
        }}
      />
      <AnimatePresence mode="wait">
        {showCake ? (
          <motion.div
            key="cake"
            className="cake-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CAKE_TIMING.reducedFade }}
          >
            <div
              className="cake"
              aria-label={`${content.her.turningAge} candle birthday cake`}
            >
              <div className="cake-candles" data-testid="cake-candle-rows">
                {candleRows.map((row, rowIndex) => (
                  <div
                    key={`row-${rowIndex}`}
                    className="cake-candle-row"
                    data-testid="cake-candle-row"
                  >
                    {row.map((index) => (
                      <div
                        key={index}
                        className="cake-candle"
                        data-testid="cake-candle"
                        style={
                          {
                            "--candle-hue": `${index % 2 === 0 ? 348 : 42}`,
                          } as CSSProperties
                        }
                      >
                        <AnimatePresence>
                          {phase === "ready" && (
                            <motion.span
                              className="cake-flame"
                              data-testid="cake-flame"
                              initial={{ opacity: 1, scale: 1 }}
                              exit={
                                reducedMotion
                                  ? { opacity: 0 }
                                  : { opacity: 0, scale: 0.15, y: -3 }
                              }
                              transition={{
                                delay: index * DUR.flameStagger,
                                duration: CAKE_TIMING.flameOut,
                              }}
                              style={{
                                animationDelay: `${-(seeded(`candle-${index}`) * CAKE_TIMING.flicker)}s`,
                                animationDuration: `${CAKE_TIMING.flicker}s`,
                              }}
                            />
                          )}
                        </AnimatePresence>
                        {phase === "extinguishing" && !reducedMotion && (
                          <motion.span
                            className="cake-smoke"
                            aria-hidden="true"
                            initial={{ opacity: 0, y: 0, scale: 0.7 }}
                            animate={{ opacity: [0, 0.55, 0], y: -16, scale: 1.15 }}
                            transition={{
                              delay:
                                index * DUR.flameStagger + CAKE_TIMING.flameOut,
                              duration: CAKE_TIMING.smoke,
                            }}
                          />
                        )}
                        <span className="cake-candle-stripe" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="cake-tier cake-tier-top">
                <span className="cake-frosting cake-frosting-top" />
              </div>
              <div className="cake-tier cake-tier-bottom">
                <span className="cake-frosting cake-frosting-bottom" />
              </div>
              <div className="cake-plate" />
            </div>

            {phase === "ready" && <BlowControls onBlow={extinguish} />}
            {phase === "extinguishing" && (
              <p className="cake-hush" aria-live="polite">
                there they go…
              </p>
            )}
          </motion.div>
        ) : showWish ? (
          <motion.div
            key="wish"
            className="cake-wish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CAKE_TIMING.reducedFade }}
          >
            <p>make a wish, my love.</p>
          </motion.div>
        ) : (
          <motion.div key="blackout" className="cake-blackout" aria-hidden="true" />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
