import { Howl } from "howler";
import { content } from "../content";

// Plain gain only. Compressing the range was a mistake: a track that never
// gets quiet never recedes, and it read as louder than the same music left
// alone. The original dynamics stay, and the level does the work.
const FULL_VOLUME = 0.3;
const DUCKED_VOLUME = 0.09;
const SWELL_VOLUME = 0.46;
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
  // No code-side fade. The gentle entrance is baked into the file itself,
  // and fading a just-queued html5 sound races its pending playback. On a
  // slow load the fade finished before playback began and the song stayed
  // at volume zero until the next explicit volume write.
  music.volume(FULL_VOLUME);
  soundId = music.play();
  music.volume(FULL_VOLUME, soundId);
}

function duck() {
  if (soundId !== undefined) {
    music.volume(DUCKED_VOLUME, soundId);
  }
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
  restore,
  swell,
  suspend,
  resume,
  toggleMute,
  isAvailable,
  subscribe,
};
