export function Grain() {
  return (
    <svg
      aria-hidden="true"
      className="grain"
      focusable="false"
      preserveAspectRatio="none"
    >
      <filter id="paper-grain">
        <feTurbulence
          baseFrequency="0.72"
          numOctaves="4"
          seed="8"
          stitchTiles="stitch"
          type="fractalNoise"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  );
}
