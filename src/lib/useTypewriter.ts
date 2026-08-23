import { useCallback, useEffect, useRef, useState } from "react";
import { reducedMotion } from "./motion";

// Pacing for a long letter: fast inside a sentence so it reads like a hand
// moving, with a real breath at every full stop. Lands around 290 wpm — ahead
// of a natural reading pace, so she is never left waiting on the next word.
const CHAR_BASE_MS = 28;
const CHAR_JITTER_MS = 8;
const SENTENCE_PAUSE_MS = 420;
const CLAUSE_PAUSE_MS = 160;
const PARAGRAPH_PAUSE_MS = 600;

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
        timerRef.current = window.setTimeout(typeNext, PARAGRAPH_PAUSE_MS);
        return;
      }

      const character = paragraph[characterIndex];
      setRendered((current) => {
        const next = [...current];
        next[paragraphIndex] = `${next[paragraphIndex] ?? ""}${character}`;
        return next;
      });
      characterIndex += 1;

      let pause = 0;
      if (/[.!?]/.test(character)) pause = SENTENCE_PAUSE_MS;
      else if (/[,;:—]/.test(character)) pause = CLAUSE_PAUSE_MS;

      const delay = CHAR_BASE_MS + Math.random() * CHAR_JITTER_MS + pause;
      timerRef.current = window.setTimeout(typeNext, delay);
    };

    timerRef.current = window.setTimeout(
      typeNext,
      CHAR_BASE_MS + Math.random() * CHAR_JITTER_MS,
    );

    return () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [paragraphs]);

  return { rendered, done, skip };
}
