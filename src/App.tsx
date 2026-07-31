import { Section } from "./components/Section";
import { Grain } from "./effects/Grain";

function App() {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-paper text-ink">
      <Grain />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-blush/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
      />

      <Section className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-5 font-handwriting text-2xl text-cherry">
          a little something is being wrapped…
        </p>
        <h1 className="font-display text-display leading-[0.98] text-cherry">
          The Story of Her
        </h1>
        <div
          aria-hidden="true"
          className="my-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <p className="max-w-md font-body text-sm leading-7 text-ink/70 md:text-base">
          One page, one scroll, her whole story.
        </p>
        <span className="mt-10 inline-block rotate-[-2deg] rounded-sm bg-paper-deep px-5 py-3 font-handwriting text-xl shadow-paper">
          made with too much love
        </span>
      </Section>
    </main>
  );
}

export default App;
