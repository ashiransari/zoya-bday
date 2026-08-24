import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { Section } from "../components/Section";
import { content } from "../content";
import { audio } from "../lib/audio";
import { reducedMotion } from "../lib/motion";

const SKIP_SECONDS = 10;

function formatTime(totalSeconds: number) {
  const safe = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function S8b_Vinyl() {
  const soundRef = useRef<Howl>();
  const frameRef = useRef<number>();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

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
    const sound = new Howl({
      src: [content.music.vinyl.src],
      html5: true,
      preload: "metadata",
      onload: () => setDuration(sound.duration()),
      onplay: () => {
        setPlaying(true);
        // The record takes the floor. The background song pauses entirely.
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
      onloaderror: () => setFailed(true),
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
  }, [stopTracking, track]);

  const toggle = useCallback(() => {
    const sound = soundRef.current;
    if (!sound || failed) return;
    if (sound.playing()) sound.pause();
    else sound.play();
  }, [failed]);

  const skip = useCallback(
    (delta: number) => {
      const sound = soundRef.current;
      if (!sound || failed) return;
      const seek = sound.seek();
      if (typeof seek !== "number") return;
      const total = sound.duration();
      const next = Math.min(Math.max(0, seek + delta), Math.max(0, total - 0.2));
      sound.seek(next);
      setPosition(next);
    },
    [failed],
  );

  const seekTo = useCallback(
    (value: number) => {
      const sound = soundRef.current;
      if (!sound || failed) return;
      sound.seek(value);
      setPosition(value);
    },
    [failed],
  );

  const spinning = playing && !reducedMotion;

  return (
    <section id="vinyl" className="vinyl-scene">
      <Section className="relative z-10 mx-auto mb-12 max-w-3xl text-center md:mb-14">
        <div>
          <p className="mb-3 font-handwriting text-xl text-cherry">
            {content.music.vinyl.kicker}
          </p>
          <h2 className="font-display text-display leading-none text-cherry">
            {content.music.vinyl.title}
          </h2>
          <p className="mt-4 font-handwriting text-2xl text-ink/65">
            {content.music.vinyl.subtitle}
          </p>
        </div>
      </Section>

      <Section className="relative z-10 mx-auto flex max-w-xl flex-col items-center">
        <div className="vinyl-player" data-playing={spinning}>
          <button
            type="button"
            className="vinyl-disc"
            onClick={toggle}
            disabled={failed}
            aria-label={
              playing
                ? `Pause ${content.music.vinyl.title}`
                : `Play ${content.music.vinyl.title}`
            }
            aria-pressed={playing}
          >
            <span className="vinyl-grooves" aria-hidden="true" />
            <span className="vinyl-sheen" aria-hidden="true" />
            <span className="vinyl-label" aria-hidden="true">
              <span className="vinyl-label-initials">A ♥ Z</span>
              <span className="vinyl-label-title">
                {content.music.vinyl.title}
              </span>
            </span>
            <span className="vinyl-spindle" aria-hidden="true" />
          </button>

          <div className="vinyl-arm" aria-hidden="true">
            <span className="vinyl-arm-base" />
            <span className="vinyl-arm-rod">
              <span className="vinyl-arm-head" />
            </span>
          </div>
        </div>

        {failed ? (
          <p className="mt-8 text-center font-handwriting text-xl text-ink/55">
            the record is still being pressed… come back on the big day.
          </p>
        ) : (
          <div className="vinyl-controls">
            <div className="vinyl-buttons">
              <button
                type="button"
                className="vinyl-skip"
                onClick={() => skip(-SKIP_SECONDS)}
                aria-label={`Back ${SKIP_SECONDS} seconds`}
              >
                «10
              </button>
              <button
                type="button"
                className="vinyl-play"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? "❚❚" : "▶"}
              </button>
              <button
                type="button"
                className="vinyl-skip"
                onClick={() => skip(SKIP_SECONDS)}
                aria-label={`Forward ${SKIP_SECONDS} seconds`}
              >
                10»
              </button>
            </div>

            <input
              className="vinyl-seek"
              type="range"
              min={0}
              max={Math.max(1, duration)}
              step={0.1}
              value={Math.min(position, duration || position)}
              onChange={(event) => seekTo(Number(event.target.value))}
              aria-label="Seek through the song"
            />

            <p className="vinyl-time" aria-hidden="true">
              {formatTime(position)} / {formatTime(duration)}
            </p>
          </div>
        )}
      </Section>
    </section>
  );
}
