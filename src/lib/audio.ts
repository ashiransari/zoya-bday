import { Howl } from "howler";
import { content } from "../content";

const FULL_VOLUME = 0.55;
const DUCKED_VOLUME = 0.12;
const SWELL_VOLUME = 0.7;
const FADE_IN_MS = 2_000;
const SWELL_UP_MS = 180;
const SWELL_HOLD_MS = 220;
const SWELL_DOWN_MS = 450;

const music = new Howl({
  src: [content.music.heroSong.src],
  loop: true,
  html5: true,
  preload: "metadata",
  volume: 0,
});

let started = false;
let soundId: number | undefined;
let muted = false;
let swellTimer: number | undefined;

function start() {
  if (started) {
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

function restore() {
  if (soundId !== undefined) {
    music.volume(FULL_VOLUME, soundId);
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

export const audio = { start, duck, restore, swell, suspend, resume, toggleMute };
