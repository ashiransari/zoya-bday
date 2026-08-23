import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { audio } from "../lib/audio";

interface AudioNoteProps {
  src: string;
}

export function AudioNote({ src }: AudioNoteProps) {
  const soundRef = useRef<Howl>();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const sound = new Howl({
      src: [src],
      html5: true,
      preload: "metadata",
      onplay: () => {
        setPlaying(true);
        audio.duck();
      },
      onpause: () => {
        setPlaying(false);
        audio.restore();
      },
      onstop: () => {
        setPlaying(false);
        audio.restore();
      },
      onend: () => {
        setPlaying(false);
        audio.restore();
      },
      onloaderror: () => {
        // A missing or broken file should leave no dead control behind.
        setFailed(true);
        setPlaying(false);
        audio.restore();
      },
      onplayerror: () => {
        setFailed(true);
        setPlaying(false);
        audio.restore();
      },
    });

    soundRef.current = sound;
    return () => {
      if (sound.playing()) audio.restore();
      sound.unload();
      soundRef.current = undefined;
    };
  }, [src]);

  if (failed) return null;

  const toggle = () => {
    const sound = soundRef.current;
    if (!sound) return;
    if (sound.playing()) sound.pause();
    else sound.play();
  };

  return (
    <button
      type="button"
      className="audio-note"
      aria-label={playing ? "Pause the voice recording" : "Hear the letter in his voice"}
      aria-pressed={playing}
      onClick={toggle}
    >
      {playing ? "❚❚ pause my voice" : "▶ hear it in my voice"}
    </button>
  );
}
