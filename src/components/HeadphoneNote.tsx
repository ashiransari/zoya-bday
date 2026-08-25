import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "../content";
import { reducedMotion, SPRING } from "../lib/motion";
import { seededRotation } from "../lib/seededRandom";

/**
 * Sits over the gift before she can tap the bow. The music starts on that tap,
 * so the suggestion has to land before it rather than after, and she has to
 * clear it deliberately rather than scroll past it.
 */
export function HeadphoneNote({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => buttonRef.current?.focus(), 700);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="headphone-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.aside
            className="headphone-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="headphone-note-title"
            style={{
              rotate: reducedMotion ? 0 : seededRotation("headphones", 1.8),
            }}
            initial={
              reducedMotion ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.98 }
            }
            transition={
              reducedMotion ? { duration: 0.25 } : { delay: 0.15, ...SPRING.settle }
            }
          >
            <span className="headphone-tape" aria-hidden="true" />

            <svg
              className="headphone-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 14.5v-2.5a8 8 0 0 1 16 0v2.5" />
              <rect x="2.2" y="13.4" width="4.2" height="7" rx="2.1" />
              <rect x="17.6" y="13.4" width="4.2" height="7" rx="2.1" />
            </svg>

            <p id="headphone-note-title" className="headphone-line">
              headphones in, {content.her.nickname.toLowerCase()}.
            </p>
            <p className="headphone-sub">
              there&apos;s music. it is better this way, i promise.
            </p>

            <button
              ref={buttonRef}
              type="button"
              className="headphone-confirm"
              onClick={onDismiss}
            >
              i have my earphones on
            </button>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
