import { useSyncExternalStore, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "../content";
import { audio } from "../lib/audio";
import { useAppCtx } from "../lib/AppCtx";
import { GIFT_TIMING, reducedMotion, SPRING } from "../lib/motion";

export function MusicToggle() {
  const { giftOpened } = useAppCtx();
  const [muted, setMuted] = useState(false);
  const hasSong = useSyncExternalStore(audio.subscribe, audio.isAvailable);

  function handleToggle() {
    setMuted(audio.toggleMute());
  }

  return (
    <AnimatePresence>
      {giftOpened && hasSong ? (
        <motion.button
          type="button"
          className="music-toggle"
          aria-label={`${muted ? "Play" : "Mute"} ${content.music.heroSong.title}`}
          aria-pressed={muted}
          onClick={handleToggle}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0 }}
          transition={
            reducedMotion
              ? { duration: GIFT_TIMING.reducedFade }
              : SPRING.settle
          }
        >
          <svg
            className="music-note"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 17.5V6.2l9-2v11.1" />
            <circle cx="6.6" cy="17.6" r="2.4" />
            <circle cx="15.6" cy="15.3" r="2.4" />
            {muted && <line className="music-slash" x1="3.6" y1="20.6" x2="20.4" y2="3.4" />}
          </svg>
          <span className="sr-only">{muted ? "Music is muted" : "Music is playing"}</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
