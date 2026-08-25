import { content } from "../content";

/**
 * The background song, on a plain audio element.
 *
 * This used Howler, and its volume calls were not reaching the underlying
 * node: the song played at full level even with every volume constant set to
 * zero. There is nothing here that needs a library, so the element is driven
 * directly and `element.volume` is the only thing standing between the file
 * and the speakers.
 *
 * The value below is a straight multiplier on his file, exactly like a volume
 * slider in an editor.
 */
const FULL_VOLUME = 0.25;
const DUCKED_VOLUME = 0.08;
const SWELL_VOLUME = 0.38;
const SWELL_HOLD_MS = 400;

let available = true;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

const song = new Audio(content.music.heroSong.src);
song.loop = true;
song.preload = "metadata";
song.volume = FULL_VOLUME;

song.addEventListener("error", () => {
  if (!available) return;
  available = false;
  notify();
});

function isAvailable() {
  return available;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let started = false;
let suspended = false;
let swellTimer: number | undefined;

function setVolume(value: number) {
  // Guard the range: an out-of-bounds assignment throws and would leave the
  // element at whatever it was last set to.
  song.volume = Math.min(1, Math.max(0, value));
}

function start() {
  if (started || !available) return;
  started = true;
  setVolume(FULL_VOLUME);
  void song.play().catch(() => {
    available = false;
    notify();
  });
}

function duck() {
  setVolume(DUCKED_VOLUME);
}

function restore() {
  setVolume(FULL_VOLUME);
}

function swell() {
  if (!started) return;
  if (swellTimer !== undefined) window.clearTimeout(swellTimer);
  setVolume(SWELL_VOLUME);
  swellTimer = window.setTimeout(() => {
    setVolume(FULL_VOLUME);
    swellTimer = undefined;
  }, SWELL_HOLD_MS);
}

/** The vinyl and the letter recording take the floor outright, not a duck. */
function suspend() {
  if (started && !song.paused) {
    song.pause();
    suspended = true;
  }
}

function resume() {
  if (!suspended) return;
  suspended = false;
  setVolume(FULL_VOLUME);
  void song.play().catch(() => {});
}

function toggleMute() {
  song.muted = !song.muted;
  return song.muted;
}

export const audio = {
  start,
  duck,
  restore,
  swell,
  suspend,
  resume,
  toggleMute,
  isAvailable,
  subscribe,
};
