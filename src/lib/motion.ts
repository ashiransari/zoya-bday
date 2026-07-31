export const SPRING = {
  settle: { type: "spring", stiffness: 120, damping: 16 },
  card: { type: "spring", stiffness: 260, damping: 22 },
  gentle: { type: "spring", stiffness: 80, damping: 20 },
} as const;

export const DUR = {
  ribbonUntie: 0.4,
  lidLift: 0.45,
  boxFade: 0.35,
  sealCrack: 0.3,
  flapOpen: 0.5,
  sheetRise: 0.6,
  flip: 0.5,
  expand: 0.35,
  flameStagger: 0.06,
  wishHold: 2.5,
  lockFlash: 0.25,
} as const;

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const STAGGER = { children: 0.08 } as const;

export const GIFT_TIMING = {
  celebration: 0.5,
  heroReveal: DUR.ribbonUntie + DUR.lidLift + DUR.boxFade,
  scrollHint: 2,
  scrollBounce: 1.6,
  balloonDrift: 3,
  reducedFade: 0.2,
} as const;

export const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
