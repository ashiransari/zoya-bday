import { useCallback, useEffect, useRef, useState } from "react";

export type MicBlowStatus =
  | "idle"
  | "listening"
  | "denied"
  | "unsupported"
  | "done";

export function useMicBlow(onBlow: () => void) {
  const [status, setStatus] = useState<MicBlowStatus>("idle");
  const animationFrameRef = useRef<number>();
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      const buffer = new Uint8Array(analyser.fftSize);
      source.connect(analyser);

      setStatus("listening");

      let since: number | null = null;

      const listen = (now: number) => {
        analyser.getByteTimeDomainData(buffer);
        let sum = 0;

        for (const value of buffer) {
          const normalized = (value - 128) / 128;
          sum += normalized ** 2;
        }

        const rms = Math.sqrt(sum / buffer.length);

        if (rms > 0.09) {
          since ??= now;
          if (now - since >= 400) {
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

  return { start, status };
}
