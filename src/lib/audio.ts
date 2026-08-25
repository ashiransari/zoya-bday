import { Howl } from "howler";
import { content } from "../content";

// The instrumental ships at -16.5 LUFS, streaming-normal loudness, and the
// quiet-background feel comes from this gain alone. Phone speakers eat
// anything subtler than this.
const FULL_VOLUME = 0.5;
const DUCKED_VOLUME = 0.14;
const SWELL_VOLUME = 0.75;
const FADE_IN_MS = 2_000;
const SWELL_UP_MS = 180;
const SWELL_HOLD_MS = 220;
const SWELL_DOWN_MS = 450;

// The hero song is optional until its file lands. Everything below degrades
// to silence rather than erroring, and `subscribe` lets the toggle hide itself
// so she never meets a button that does nothing.
let available = true;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function markUnavailable() {
  if (!available) return;
  available = false;
  notify();
}

const music = new Howl({
  src: [content.music.heroSong.src],
  loop: true,
  html5: true,
  preload: "metadata",
  volume: 0,
  onloaderror: markUnavailable,
  onplayerror: markUnavailable,
});

function isAvailable() {
  return available;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let started = false;
let soundId: number | undefined;
let muted = false;
let swellTimer: number | undefined;

function start() {
  if (started || !available) {
    return;
  }

  started = true;
  soundId = music.play();
  music.volume(0, soundId);
  music.fade(0, FULL_VOLUME, FADE_IN_MS, soundId);
}

function duck() {
  if (soundId !== undefined) {
    music.volume(DUCKED_VOLUME, soundId);
  }
}

/**
 * The letter reading runs about fifteen minutes with the song looping
 * quietly underneath the whole way. Restart the song from the top so the
 * two begin together, and hold it at the ducked level so his voice stays
 * the only thing asking for her attention.
 */
function restartBed() {
  if (!available || !started || soundId === undefined) return;
  music.seek(0, soundId);
  if (!music.playing(soundId)) {
    suspended = false;
    music.play(soundId);
  }
  music.volume(DUCKED_VOLUME, soundId);
}

function restore() {
  if (soundId !== undefined) {
    // Eased, not snapped. After minutes at a whisper a jump to full reads
    // as a jolt.
    const current = music.volume() as number;
    music.fade(current, FULL_VOLUME, 1_500, soundId);
  }
}

function swell() {
  if (soundId === undefined) {
    return;
  }

  if (swellTimer !== undefined) {
    window.clearTimeout(swellTimer);
  }

  const currentVolume = music.volume() as number;
  music.fade(currentVolume, SWELL_VOLUME, SWELL_UP_MS, soundId);
  swellTimer = window.setTimeout(() => {
    if (soundId !== undefined) {
      music.fade(SWELL_VOLUME, FULL_VOLUME, SWELL_DOWN_MS, soundId);
    }
    swellTimer = undefined;
  }, SWELL_UP_MS + SWELL_HOLD_MS);
}

let suspended = false;

// The vinyl takes the floor entirely. Not a duck. The hero song pauses and
// picks back up from the same spot once the record stops.
function suspend() {
  if (started && soundId !== undefined && music.playing(soundId)) {
    music.pause(soundId);
    suspended = true;
  }
}

function resume() {
  if (suspended && soundId !== undefined) {
    suspended = false;
    music.play(soundId);
    music.volume(FULL_VOLUME, soundId);
  }
}

function toggleMute() {
  muted = !muted;
  music.mute(muted, soundId);
  return muted;
}

export const audio = {
  start,
  duck,
  restartBed,
  restore,
  swell,
  suspend,
  resume,
  toggleMute,
  isAvailable,
  subscribe,
};
