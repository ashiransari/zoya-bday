import { useCallback, useEffect, useRef, useState } from "react";
import { reducedMotion } from "./motion";

export function useTypewriter(paragraphs: string[]) {
  const [rendered, setRendered] = useState<string[]>(
    reducedMotion ? [...paragraphs] : [],
  );
  const [done, setDone] = useState(reducedMotion);
  const timerRef = useRef<number>();
  const skippedRef = useRef(reducedMotion);

  const skip = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    skippedRef.current = true;
    setRendered([...paragraphs]);
    setDone(true);
  }, [paragraphs]);

  useEffect(() => {
    if (reducedMotion) {
      setRendered([...paragraphs]);
      setDone(true);
      return;
    }

    skippedRef.current = false;
    setRendered([]);
    setDone(false);
    let paragraphIndex = 0;
    let characterIndex = 0;

    const typeNext = () => {
      if (skippedRef.current) return;

      if (paragraphIndex >= paragraphs.length) {
        setDone(true);
        timerRef.current = undefined;
        return;
      }

      const paragraph = paragraphs[paragraphIndex];
      if (characterIndex >= paragraph.length) {
        paragraphIndex += 1;
        characterIndex = 0;
        if (paragraphIndex >= paragraphs.length) {
          setDone(true);
          timerRef.current = undefined;
          return;
        }
        setRendered((current) => {
          const next = [...current];
          next[paragraphIndex] = "";
          return next;
        });
        timerRef.current = window.setTimeout(typeNext, 500);
        return;
      }

      const character = paragraph[characterIndex];
      setRendered((current) => {
        const next = [...current];
        next[paragraphIndex] = `${next[paragraphIndex] ?? ""}${character}`;
        return next;
      });
      characterIndex += 1;

      const punctuationPause = /[.,—;:]/.test(character) ? 260 : 0;
      const delay = 22 + Math.random() * 10 + punctuationPause;
      timerRef.current = window.setTimeout(typeNext, delay);
    };

    timerRef.current = window.setTimeout(typeNext, 22 + Math.random() * 10);

    return () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [paragraphs]);

  return { rendered, done, skip };
}
