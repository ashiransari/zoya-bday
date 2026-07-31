import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { audio } from "../lib/audio";

interface AudioNoteProps {
  src: string;
}

export function AudioNote({ src }: AudioNoteProps) {
  const soundRef = useRef<Howl>();
  const [playing, setPlaying] = useState(false);

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
        setPlaying(false);
        audio.restore();
      },
      onplayerror: () => {
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
      aria-label={playing ? "Pause voice note" : "Play voice note"}
      aria-pressed={playing}
      onClick={toggle}
    >
      {playing ? "❚❚ pause my voice" : "▶ press play to hear me read it"}
    </button>
  );
}
