import { motion } from "framer-motion";
import type { OpenWhenLetter } from "../content";
import {
  OPEN_WHEN_TIMING,
  reducedMotion,
  SPRING,
} from "../lib/motion";
import { seededRotation } from "../lib/seededRandom";

interface MiniEnvelopeProps {
  id: string;
  layoutId: string;
  letter: OpenWhenLetter;
  opened: boolean;
  breaking: boolean;
  disabled?: boolean;
  onOpen: () => void;
}

export function MiniEnvelope({
  id,
  layoutId,
  letter,
  opened,
  breaking,
  disabled = false,
  onOpen,
}: MiniEnvelopeProps) {
  const rotation = reducedMotion ? 0 : seededRotation(id);

  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      className="mini-envelope touch-manipulation"
      style={{ rotate: rotation }}
      transition={reducedMotion ? { duration: 0 } : SPRING.card}
      onClick={onOpen}
      disabled={disabled}
      aria-label={`${opened ? "Reopen" : "Open"} letter: ${letter.label}`}
      data-opened={opened ? "true" : "false"}
    >
      <span className="mini-envelope-flap" aria-hidden="true" />
      <span className="mini-envelope-pocket" aria-hidden="true" />

      {letter.emoji ? (
        <span className="absolute right-3 top-3 z-20 text-xl" aria-hidden="true">
          {letter.emoji}
        </span>
      ) : null}

      <span className="absolute inset-x-3 bottom-4 z-20 font-handwriting text-xl leading-tight text-ink/80">
        {letter.label}
      </span>

      <motion.span
        className={`mini-wax-seal ${opened ? "mini-wax-seal-broken" : ""}`}
        aria-hidden="true"
        animate={
          breaking
            ? reducedMotion
              ? { opacity: 0 }
              : { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
            : { scale: 1, opacity: opened ? 0.5 : 1 }
        }
        transition={{ duration: OPEN_WHEN_TIMING.sealBreak }}
      />
    </motion.button>
  );
}
