import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { audio } from "../lib/audio";

interface AudioNoteProps {
  /** Points at the recording. The player hides itself until that file exists. */
  src?: string;
}

const SPEEDS = [1, 1.5, 2] as const;

function formatTime(totalSeconds: number) {
  const safe = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function AudioNote({ src }: AudioNoteProps) {
  const soundRef = useRef<Howl>();
  const frameRef = useRef<number>();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);

  const stopTracking = useCallback(() => {
    if (frameRef.current !== undefined) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, []);

  const track = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;
    const seek = sound.seek();
    if (typeof seek === "number") setPosition(seek);
    frameRef.current = window.requestAnimationFrame(track);
  }, []);

  useEffect(() => {
    if (!src) return;

    const sound = new Howl({
      src: [src],
      html5: true,
      preload: "metadata",
      onload: () => setDuration(sound.duration()),
      onplay: () => {
        setPlaying(true);
        // The recording carries its own backing music, so the site's song
        // stops rather than ducking. Two instrumentals at once would fight.
        audio.suspend();
        stopTracking();
        frameRef.current = window.requestAnimationFrame(track);
      },
      onpause: () => {
        setPlaying(false);
        stopTracking();
        audio.resume();
      },
      onstop: () => {
        setPlaying(false);
        stopTracking();
        audio.resume();
      },
      onend: () => {
        setPlaying(false);
        setPosition(0);
        stopTracking();
        audio.resume();
      },
      onloaderror: () => {
        // A missing or broken file should leave no dead control behind.
        setFailed(true);
        setPlaying(false);
        audio.resume();
      },
      onplayerror: () => {
        setFailed(true);
        setPlaying(false);
        audio.resume();
      },
    });

    soundRef.current = sound;
    return () => {
      stopTracking();
      if (sound.playing()) audio.resume();
      sound.unload();
      soundRef.current = undefined;
    };
  }, [src, stopTracking, track]);

  if (!src || failed) return null;

  const toggle = () => {
    const sound = soundRef.current;
    if (!sound) return;
    if (sound.playing()) sound.pause();
    else sound.play();
  };

  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    soundRef.current?.rate(SPEEDS[next]);
  };

  const seekTo = (value: number) => {
    const sound = soundRef.current;
    if (!sound) return;
    sound.seek(value);
    setPosition(value);
  };

  const speed = SPEEDS[speedIndex];

  return (
    <div className="audio-note-player">
      <div className="audio-note-row">
        <button
          type="button"
          className="audio-note"
          aria-label={playing ? "Pause the voice recording" : "Hear the letter in his voice"}
          aria-pressed={playing}
          onClick={toggle}
        >
          {playing ? "Pause my voice" : "Hear it in my voice"}
        </button>

        <button
          type="button"
          className="audio-note-speed"
          onClick={cycleSpeed}
          aria-label={`Playback speed ${speed}x. Tap to change.`}
        >
          {speed}x
        </button>

        <span className="audio-note-time" aria-hidden="true">
          {formatTime(position)} / {formatTime(duration)}
        </span>
      </div>

      {(playing || position > 0) && (
        <input
          className="audio-note-seek"
          type="range"
          min={0}
          max={Math.max(1, duration)}
          step={1}
          value={Math.min(position, duration || position)}
          onChange={(event) => seekTo(Number(event.target.value))}
          aria-label="Seek through the recording"
        />
      )}
    </div>
  );
}
