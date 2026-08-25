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
          <span className="cassette-window" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="sr-only">{muted ? "Music is muted" : "Music is playing"}</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
