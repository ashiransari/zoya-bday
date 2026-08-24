import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Polaroid } from "../components/Polaroid";
import { Section } from "../components/Section";
import { content, type Chapter } from "../content";
import { TEDDY_TAP_EVENT } from "../effects/EasterEggs";
import { useAppCtx } from "../lib/AppCtx";
import { reducedMotion } from "../lib/motion";
import { seededRotation } from "../lib/seededRandom";

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function ChapterPhoto({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const isDesktop = useDesktopLayout();
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    index % 2 === 0 ? [-20, 20] : [20, -20],
  );

  return (
    <motion.div
      ref={parallaxRef}
      style={{ y: isDesktop && !reducedMotion ? y : 0 }}
      className="relative mx-auto w-full max-w-[390px]"
    >
      <Polaroid
        id={chapter.id}
        src={chapter.photo}
        caption={chapter.dateLabel}
        aspect={chapter.aspect}
        alt={`${chapter.title} — ${chapter.dateLabel}`}
      />
    </motion.div>
  );
}

function ArtifactImage({
  chapter,
}: {
  chapter: Chapter;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const artifact = chapter.artifact;

  if (!artifact || artifact.kind !== "image") {
    return null;
  }

  return (
    <figure
      className="artifact-image-card"
      style={{
        transform: `rotate(${seededRotation(`${chapter.id}-artifact`, 2)}deg)`,
      }}
    >
      <span className="artifact-tape" aria-hidden="true" />
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-handwriting text-lg text-cherry/55"
        >
          screenshot
        </div>
        {artifact.src && !imageFailed ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={artifact.src}
            alt={artifact.label ?? `Artifact from ${chapter.title}`}
            width="1200"
            height="900"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : null}
      </div>
      {artifact.label ? (
        <figcaption className="mt-2 font-handwriting text-lg text-ink/70">
          {artifact.label}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ArtifactNote({ chapter }: { chapter: Chapter }) {
  const artifact = chapter.artifact;

  if (!artifact || artifact.kind !== "note") {
    return null;
  }

  return (
    <aside
      className="artifact-note"
      style={{
        transform: `rotate(${seededRotation(`${chapter.id}-note`, 2)}deg)`,
      }}
    >
      {artifact.label ? (
        <p className="mb-2 font-body text-[11px] font-medium uppercase tracking-[0.16em] text-cherry">
          {artifact.label}
        </p>
      ) : null}
      <p className="font-handwriting text-xl leading-snug text-ink/80">
        {artifact.text}
      </p>
    </aside>
  );
}

export function S3_StoryOfHer() {
  const { giftOpened } = useAppCtx();

  return (
    <section
      id="story-of-her"
      className="relative bg-paper px-5 py-24 md:px-8 md:py-32"
    >
      <Section className="relative z-10 mx-auto mb-20 max-w-3xl text-center md:mb-28">
        <div>
          <p className="mb-3 font-handwriting text-xl text-cherry">
            once upon a you…
          </p>
          <h2 className="font-display text-display leading-none text-cherry">
            The Story of Her
          </h2>
        </div>
      </Section>

      <div className="relative mx-auto max-w-6xl">
        <div
          aria-hidden="true"
          className="absolute bottom-12 left-1/2 top-4 hidden w-px -translate-x-1/2 bg-cherry/20 md:block"
        />

        {content.chapters.map((chapter, index) => {
          const photoPosition =
            index % 2 === 0
              ? "md:col-start-1 md:row-start-1"
              : "md:col-start-3 md:row-start-1";
          const copyPosition =
            index % 2 === 0
              ? "md:col-start-3 md:row-start-1"
              : "md:col-start-1 md:row-start-1 md:text-right";
          const artifactAlignment =
            index % 2 === 0 ? "" : "md:ml-auto";

          return (
            <Section
              key={chapter.id}
              className="relative z-10 mb-24 last:mb-0 md:mb-32"
            >
              <article className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] md:gap-6">
                <div className={`order-1 ${photoPosition}`}>
                  <ChapterPhoto chapter={chapter} index={index} />
                </div>

                <div
                  aria-hidden="true"
                  className="hidden md:col-start-2 md:row-start-1 md:flex md:h-full md:items-center md:justify-center"
                >
                  <span className="h-3 w-3 rounded-full border-2 border-paper bg-cherry shadow-[0_0_0_1px_var(--cherry)]" />
                </div>

                <div className={`order-2 ${copyPosition}`}>
                  <span className="inline-flex rounded-full bg-cherry px-3 py-1 font-body text-xs font-medium uppercase tracking-[0.14em] text-paper">
                    {chapter.dateLabel}
                  </span>
                  <h3 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
                    {chapter.title}
                  </h3>
                  <div className="mt-4 space-y-1 font-handwriting text-2xl leading-snug text-ink/75">
                    {chapter.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>

                  {chapter.artifact?.kind === "image" ? (
                    <div className={`mt-8 max-w-[250px] ${artifactAlignment}`}>
                      <ArtifactImage chapter={chapter} />
                    </div>
                  ) : null}

                  {chapter.artifact?.kind === "note" ? (
                    <div className={`mt-8 max-w-[300px] ${artifactAlignment}`}>
                      <ArtifactNote chapter={chapter} />
                    </div>
                  ) : null}
                </div>
              </article>
            </Section>
          );
        })}

        <Section className="relative z-10 mt-20 flex justify-center md:mt-28">
          <button
            type="button"
            className="teddy-easter-button"
            style={{
              transform: `rotate(${seededRotation("story-teddy")}deg)`,
            }}
            aria-label="Tap the tiny teddy bear"
            disabled={!giftOpened}
            onClick={() => window.dispatchEvent(new Event(TEDDY_TAP_EVENT))}
          >
            <span role="img" aria-hidden="true">
              🧸
            </span>
          </button>
        </Section>
      </div>
    </section>
  );
}
