import { useState } from "react";
import { motion } from "framer-motion";
import { DUR, EASE, reducedMotion } from "../lib/motion";
import { seededRotation } from "../lib/seededRandom";

interface PolaroidProps {
  id: string;
  src: string;
  caption: string;
  alt?: string;
  className?: string;
  backNote?: string;
  signature?: string;
  flipped?: boolean;
}

export function Polaroid({
  id,
  src,
  caption,
  alt = caption,
  className = "",
  backNote,
  signature,
  flipped = false,
}: PolaroidProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const rotation = seededRotation(id);
  const canFlip = Boolean(backNote);

  return (
    <figure
      className={`polaroid-frame ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <motion.div
        className="polaroid-flip-inner"
        animate={
          reducedMotion || !canFlip
            ? { rotateY: 0 }
            : { rotateY: flipped ? 180 : 0 }
        }
        transition={{ duration: DUR.flip, ease: EASE.inOut }}
      >
        <motion.div
          className="polaroid-face polaroid-front"
          animate={
            reducedMotion && canFlip
              ? { opacity: flipped ? 0 : 1 }
              : { opacity: 1 }
          }
          transition={{ duration: DUR.flip }}
          aria-hidden={flipped && canFlip}
        >
          <div className="polaroid-surface">
            <span
              className="polaroid-tape polaroid-tape-left"
              aria-hidden="true"
            />
            <span
              className="polaroid-tape polaroid-tape-right"
              aria-hidden="true"
            />

            <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
              <div
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_35%_30%,rgba(243,197,204,0.65),transparent_48%),linear-gradient(145deg,var(--paper-deep),var(--paper))] font-handwriting text-xl text-cherry/55"
              >
                photo goes here
              </div>
              {!imageFailed ? (
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src={src}
                  alt={alt}
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span className="sr-only">{alt}</span>
              )}
            </div>

            <figcaption className="polaroid-caption">{caption}</figcaption>
          </div>
        </motion.div>

        {canFlip ? (
          <motion.div
            className="polaroid-face polaroid-back"
            style={{ transform: reducedMotion ? "none" : "rotateY(180deg)" }}
            animate={
              reducedMotion
                ? { opacity: flipped ? 1 : 0 }
                : { opacity: 1 }
            }
            transition={{ duration: DUR.flip }}
            aria-hidden={!flipped}
          >
            <div className="polaroid-surface polaroid-back-paper">
              <p className="font-handwriting text-[clamp(1.35rem,3vw,1.75rem)] leading-snug text-ink/80">
                {backNote}
              </p>
              {signature ? (
                <p className="mt-5 text-right font-handwriting text-lg text-cherry">
                  — {signature}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </motion.div>
    </figure>
  );
}
