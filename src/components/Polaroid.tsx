import { useState } from "react";
import { seededRotation } from "../lib/seededRandom";

interface PolaroidProps {
  id: string;
  src: string;
  caption: string;
  alt?: string;
  className?: string;
}

export function Polaroid({
  id,
  src,
  caption,
  alt = caption,
  className = "",
}: PolaroidProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const rotation = seededRotation(id);

  return (
    <figure
      className={`polaroid-frame ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="polaroid-tape polaroid-tape-left" aria-hidden="true" />
      <span className="polaroid-tape polaroid-tape-right" aria-hidden="true" />

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
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="sr-only">{alt}</span>
        )}
      </div>

      <figcaption className="polaroid-caption">{caption}</figcaption>
    </figure>
  );
}
