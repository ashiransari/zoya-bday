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
  /** Frame shape. Defaults to landscape so existing call sites are unaffected. */
  aspect?: "landscape" | "portrait";
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
  aspect = "landscape",
}: PolaroidProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const rotation = seededRotation(id);
  const canFlip = Boolean(backNote);
  const portrait = aspect === "portrait";

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

            <div
              className={`relative overflow-hidden bg-paper-deep ${
                portrait ? "aspect-[3/4]" : "aspect-[4/3]"
              }`}
            >
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
                  width={portrait ? "900" : "1200"}
                  height={portrait ? "1200" : "900"}
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
              {/* Landscape faces are much shorter, so long notes need smaller
                  type to stay inside the frame. */}
              <p
                className={`font-handwriting leading-snug text-ink/80 ${
                  portrait
                    ? "text-[clamp(1.35rem,3vw,1.75rem)]"
                    : "text-[clamp(1rem,2.3vw,1.3rem)]"
                }`}
              >
                {backNote}
              </p>
              {signature ? (
                <p
                  className={`text-right font-handwriting text-cherry ${
                    portrait ? "mt-5 text-lg" : "mt-2 text-base"
                  }`}
                >
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
