import confetti from "canvas-confetti";

export type ConfettiOrigin = confetti.Options["origin"];

export function micro(origin?: ConfettiOrigin) {
  void confetti({
    particleCount: 40,
    spread: 60,
    origin,
  });
}

export function pop() {
  void confetti({
    particleCount: 80,
    spread: 70,
  });
}

export function mega() {
  [0, 250, 500].forEach((delay) => {
    window.setTimeout(() => {
      void confetti({
        particleCount: 160,
        spread: 100,
        scalar: 1.1,
      });
    }, delay);
  });
}
