type FullscreenTarget = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

/**
 * Asks for fullscreen, quietly.
 *
 * Must be called from inside a real tap or click, since browsers gate this on
 * a user gesture rather than a permission prompt. Laptops and Android Chrome
 * honour it; iOS Safari has no fullscreen for ordinary elements and simply
 * does nothing, which is the intended outcome there. Every failure path is
 * swallowed, because a page that refuses to go fullscreen should never be
 * something she notices.
 */
export function enterFullscreen() {
  const element = document.documentElement as FullscreenTarget;
  const request =
    element.requestFullscreen?.bind(element) ??
    element.webkitRequestFullscreen?.bind(element);

  if (!request) return;
  if (document.fullscreenElement) return;

  try {
    const result = request();
    if (result && typeof result.then === "function") {
      result.catch(() => {});
    }
  } catch {
    // Refused or unsupported. Nothing to do and nothing worth saying.
  }
}
