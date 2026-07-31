import { Howl } from "howler";
import { content } from "../content";

const FULL_VOLUME = 0.55;
const DUCKED_VOLUME = 0.12;
const FADE_IN_MS = 2_000;

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

function toggleMute() {
  muted = !muted;
  music.mute(muted, soundId);
  return muted;
}

export const audio = { start, duck, restore, toggleMute };
