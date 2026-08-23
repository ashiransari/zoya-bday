import { useCallback, useEffect, useRef } from "react";
import { reducedMotion } from "./motion";

/**
 * Keeps the typewriter's writing line on screen the way a chat log follows new
 * messages: the page follows on its own, but the moment she scrolls back to
 * re-read, following stops dead. It resumes only once she has scrolled far
 * enough down that the writing line is in view again — so the page never yanks
 * her away from a paragraph she is still reading.
 *
 * Deliberately listens to `wheel` / `touchmove` / navigation keys rather than
 * `scroll`: those fire only for her own input, while `scroll` also fires for
 * our own `scrollIntoView` and would pause the follow immediately.
 */
export function useScrollFollow(active: boolean) {
  const tailRef = useRef<HTMLDivElement>(null);
  const followingRef = useRef(true);
  const tailVisibleRef = useRef(true);

  useEffect(() => {
    if (!active || reducedMotion) return;

    const pause = () => {
      followingRef.current = false;
    };
    const navigationKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ]);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (navigationKeys.has(event.key)) pause();
    };

    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchmove", pause);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  useEffect(() => {
    if (!active || reducedMotion) return;
    const node = tailRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      tailVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [active]);

  const follow = useCallback(() => {
    if (!active || reducedMotion) return;

    // She has caught back up on her own — start following again.
    if (tailVisibleRef.current) {
      followingRef.current = true;
      return;
    }

    if (!followingRef.current) return;
    tailRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return { tailRef, follow };
}
