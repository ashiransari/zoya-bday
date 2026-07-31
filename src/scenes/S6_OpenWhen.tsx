import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "framer-motion";
import { MiniEnvelope } from "../components/MiniEnvelope";
import { Section } from "../components/Section";
import { content } from "../content";
import {
  OPEN_WHEN_TIMING,
  reducedMotion,
  SPRING,
} from "../lib/motion";

function envelopeId(index: number) {
  return `open-when-${index}`;
}

export function S6_OpenWhen() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [breakingId, setBreakingId] = useState<string | null>(null);
  const [openedIds, setOpenedIds] = useState<Set<string>>(() => new Set());
  const openingTimer = useRef<number | null>(null);
  const activeLetter =
    activeIndex === null ? undefined : content.openWhen[activeIndex];

  useEffect(() => {
    return () => {
      if (openingTimer.current !== null) {
        window.clearTimeout(openingTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeIndex]);

  function openEnvelope(index: number) {
    if (activeIndex !== null || breakingId !== null) {
      return;
    }

    const id = envelopeId(index);
    if (openedIds.has(id)) {
      setActiveIndex(index);
      return;
    }

    setBreakingId(id);
    openingTimer.current = window.setTimeout(() => {
      setOpenedIds((current) => new Set(current).add(id));
      setBreakingId(null);
      setActiveIndex(index);
      openingTimer.current = null;
    }, OPEN_WHEN_TIMING.sealBreak * 1_000);
  }

  function closeLetter() {
    setActiveIndex(null);
  }

  return (
    <section
      id="open-when"
      className="relative overflow-hidden bg-paper px-5 py-24 md:px-8 md:py-32"
    >
      <Section className="relative z-10 mx-auto mb-14 max-w-4xl text-center md:mb-20">
        <div>
          <h2 className="font-display text-display leading-none text-cherry">
            open when…
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-handwriting text-2xl leading-snug text-ink/65">
            little letters for later. these don&apos;t expire — come back whenever
            you need one.
          </p>
        </div>
      </Section>

      <LayoutGroup id="open-when-letters">
        <div
          className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4"
          data-testid="open-when-grid"
        >
          {content.openWhen.map((letter, index) => {
            const id = envelopeId(index);
            const layoutId = `${id}-layout`;

            if (activeIndex === index) {
              return (
                <div
                  key={id}
                  className="min-h-[176px]"
                  aria-hidden="true"
                />
              );
            }

            return (
              <MiniEnvelope
                key={id}
                id={id}
                layoutId={layoutId}
                letter={letter}
                opened={openedIds.has(id)}
                breaking={breakingId === id}
                disabled={breakingId !== null}
                onOpen={() => openEnvelope(index)}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {activeLetter && activeIndex !== null ? (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-night/55 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: OPEN_WHEN_TIMING.reducedFade }}
              onClick={closeLetter}
              data-testid="open-when-scrim"
            >
              <motion.article
                layoutId={`${envelopeId(activeIndex)}-layout`}
                className="open-when-note relative max-h-[82dvh] w-full max-w-xl overflow-y-auto rounded-md border border-cherry/15 px-7 pb-9 pt-16 shadow-[0_24px_70px_rgb(23_16_22_/_0.32)] md:px-12 md:pb-12 md:pt-20"
                transition={reducedMotion ? { duration: 0 } : SPRING.card}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="open-when-note-title"
                data-testid="open-when-note"
              >
                <button
                  type="button"
                  className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full font-body text-xl text-cherry transition-colors hover:bg-cherry/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  onClick={closeLetter}
                  aria-label="Close letter"
                  autoFocus
                >
                  ×
                </button>

                <div className="relative z-10">
                  <p
                    id="open-when-note-title"
                    className="font-handwriting text-2xl font-semibold text-cherry md:text-3xl"
                  >
                    {activeLetter.emoji ? `${activeLetter.emoji} ` : ""}
                    {activeLetter.label}
                  </p>
                  <p className="mt-7 whitespace-pre-line font-handwriting text-xl leading-relaxed text-ink/80">
                    {activeLetter.note}
                  </p>
                  <p className="mt-8 text-right font-handwriting text-xl text-cherry">
                    — {content.you.name.charAt(0)}
                  </p>
                </div>
              </motion.article>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
