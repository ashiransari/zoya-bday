import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "../content";
import { EASTER_EGG_TIMING, reducedMotion } from "../lib/motion";
import { HeartRain } from "./HeartRain";

export const TEDDY_TAP_EVENT = "birthday-teddy-tap";

interface TapHeart {
  id: number;
  x: number;
  y: number;
}

export function EasterEggs() {
  const [heartRainRun, setHeartRainRun] = useState<number | null>(null);
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretImageFailed, setSecretImageFailed] = useState(false);
  const [tapHearts, setTapHearts] = useState<TapHeart[]>([]);
  const nicknameBufferRef = useRef("");
  const teddyTapsRef = useRef(0);
  const tapHeartIdRef = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const portraitSecret = content.easterEggs.secretAspect === "portrait";

  // The modal only mounts on the seventh tap, so without this the photo starts
  // downloading at the exact moment she is waiting to see it. Fetch it quietly
  // as soon as the eggs arm instead.
  useEffect(() => {
    const preload = new Image();
    preload.src = content.easterEggs.secretPhoto;
  }, []);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const isDesktop =
      navigator.maxTouchPoints === 0 &&
      window.matchMedia("(pointer: fine)").matches;
    const nickname = content.her.nickname.trim().toLowerCase();
    if (!isDesktop || reducedMotion || !nickname) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
      nicknameBufferRef.current = `${nicknameBufferRef.current}${event.key.toLowerCase()}`.slice(-20);
      if (!nicknameBufferRef.current.includes(nickname)) return;
      nicknameBufferRef.current = "";
      setHeartRainRun((current) => (current ?? 0) + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleTeddyTap = () => {
      teddyTapsRef.current += 1;
      if (teddyTapsRef.current < content.easterEggs.teddyTapCount) return;
      teddyTapsRef.current = 0;
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setSecretOpen(true);
    };

    window.addEventListener(TEDDY_TAP_EVENT, handleTeddyTap);
    return () => window.removeEventListener(TEDDY_TAP_EVENT, handleTeddyTap);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const isTouch =
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;

    const handleTouchStart = (event: TouchEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest("#gift, #finale")) return;
      const touch = event.touches[0];
      if (!touch) return;
      tapHeartIdRef.current += 1;
      setTapHearts((current) => [
        ...current,
        { id: tapHeartIdRef.current, x: touch.clientX, y: touch.clientY },
      ]);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => window.removeEventListener("touchstart", handleTouchStart);
  }, []);

  useEffect(() => {
    if (!secretOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSecretOpen(false);
        window.requestAnimationFrame(() => previousFocusRef.current?.focus());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [secretOpen]);

  const closeSecret = () => {
    setSecretOpen(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  };

  return (
    <>
      {heartRainRun !== null && (
        <HeartRain
          key={heartRainRun}
          runId={heartRainRun}
          onComplete={() => setHeartRainRun(null)}
        />
      )}

      <div className="mobile-tap-hearts" aria-hidden="true">
        {tapHearts.map((heart) => (
          <span
            key={heart.id}
            onAnimationEnd={() =>
              setTapHearts((current) => current.filter((item) => item.id !== heart.id))
            }
            style={
              {
                left: heart.x,
                top: heart.y,
                animationDuration: `${EASTER_EGG_TIMING.tapHeart}s`,
              } as CSSProperties
            }
          >
            ♥
          </span>
        ))}
      </div>

      <AnimatePresence>
        {secretOpen && (
          <motion.div
            className="secret-modal-scrim"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: EASTER_EGG_TIMING.modal }}
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) closeSecret();
            }}
          >
            <motion.div
              className="secret-modal"
              data-aspect={content.easterEggs.secretAspect}
              data-testid="teddy-secret-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="secret-modal-line"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: -2 }}
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, rotate: -1 }
              }
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: EASTER_EGG_TIMING.modal }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="secret-modal-close"
                aria-label="Close the secret photo"
                onClick={closeSecret}
              >
                ×
              </button>
              <div
                className="secret-photo-frame"
                data-aspect={content.easterEggs.secretAspect}
              >
                <div className="secret-photo-fallback" aria-hidden="true">
                  secret photo goes here
                </div>
                {!secretImageFailed && (
                  <img
                    src={content.easterEggs.secretPhoto}
                    alt={`A secret memory with ${content.her.name}`}
                    width={portraitSecret ? "900" : "1200"}
                    height={portraitSecret ? "1200" : "900"}
                    decoding="async"
                    onError={() => setSecretImageFailed(true)}
                  />
                )}
              </div>
              <p id="secret-modal-line">{content.easterEggs.secretLine}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
