import { useCallback, useEffect, useRef, useState } from "react";

export type MicBlowStatus =
  | "idle"
  | "listening"
  | "denied"
  | "unsupported"
  | "done";

/** Sustained loudness that counts as a blow, and how long it must hold. */
const BLOW_RMS = 0.045;
const BLOW_HOLD_MS = 260;

/**
 * She is standing there blowing at her phone either way, so the candles go out
 * on this timer even if the microphone never reports it. Real detection still
 * runs and usually wins, which lands the moment on her actual breath. This is
 * only the safety net underneath it.
 */
const ASSUME_BLOWN_MS = 4_200;

export function useMicBlow(onBlow: () => void) {
  const [status, setStatus] = useState<MicBlowStatus>("idle");
  const [level, setLevel] = useState(0);
  const animationFrameRef = useRef<number>();
  const assumeTimerRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const streamRef = useRef<MediaStream>();
  const startingRef = useRef(false);
  const mountedRef = useRef(true);
  const onBlowRef = useRef(onBlow);

  onBlowRef.current = onBlow;

  const cleanUp = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (assumeTimerRef.current !== undefined) {
      window.clearTimeout(assumeTimerRef.current);
      assumeTimerRef.current = undefined;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = undefined;

    const context = audioContextRef.current;
    audioContextRef.current = undefined;
    if (context && context.state !== "closed") {
      void context.close();
    }
  }, []);

  const trigger = useCallback(() => {
    cleanUp();
    if (!mountedRef.current) return;
    setLevel(0);
    setStatus("done");
    onBlowRef.current();
  }, [cleanUp]);

  const start = useCallback(async () => {
    if (startingRef.current || status !== "idle") return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    startingRef.current = true;

    try {
      // Noise suppression and auto gain exist to remove exactly the sound a
      // blow makes, so ask for the raw signal. Echo cancellation stays on so
      // the song coming out of her speaker cannot trigger the candles.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: false,
          autoGainControl: false,
          echoCancellation: true,
        },
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) {
        cleanUp();
        setStatus("unsupported");
        return;
      }

      const context = new AudioContextClass();
      audioContextRef.current = context;

      // Built after awaiting permission, so the original tap no longer counts
      // as a gesture and mobile hands back a suspended context that reads pure
      // silence. Without this the analyser never sees anything at all.
      if (context.state === "suspended") {
        await context.resume();
      }

      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      const buffer = new Uint8Array(analyser.fftSize);
      source.connect(analyser);

      setStatus("listening");

      assumeTimerRef.current = window.setTimeout(trigger, ASSUME_BLOWN_MS);

      let since: number | null = null;
      let lastPaint = 0;

      const listen = (now: number) => {
        analyser.getByteTimeDomainData(buffer);
        let sum = 0;

        for (const value of buffer) {
          const normalized = (value - 128) / 128;
          sum += normalized ** 2;
        }

        const rms = Math.sqrt(sum / buffer.length);

        // Feed the on-screen meter, throttled so it does not thrash React.
        if (now - lastPaint > 80) {
          lastPaint = now;
          setLevel(Math.min(1, rms / (BLOW_RMS * 1.6)));
        }

        if (rms > BLOW_RMS) {
          since ??= now;
          if (now - since >= BLOW_HOLD_MS) {
            trigger();
            return;
          }
        } else {
          since = null;
        }

        animationFrameRef.current = requestAnimationFrame(listen);
      };

      animationFrameRef.current = requestAnimationFrame(listen);
    } catch {
      cleanUp();
      if (mountedRef.current) setStatus("denied");
    } finally {
      startingRef.current = false;
    }
  }, [cleanUp, status, trigger]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanUp();
    };
  }, [cleanUp]);

  return { start, status, level };
}
