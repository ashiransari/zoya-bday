import { useEffect, useState } from "react";

function calculateElapsed(iso: string) {
  const diff = Date.now() - Date.parse(iso);

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

export function useCountUp(iso: string, tickMs = 1_000) {
  const [elapsed, setElapsed] = useState(() => calculateElapsed(iso));

  useEffect(() => {
    const tick = () => setElapsed(calculateElapsed(iso));
    tick();
    const interval = window.setInterval(tick, tickMs);
    return () => window.clearInterval(interval);
  }, [iso, tickMs]);

  return elapsed;
}
