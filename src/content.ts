export interface Chapter {
  id: string;
  title: string;
  dateLabel: string;
  photo: string;
  lines: string[];
  artifact?: {
    kind: "image" | "note";
    src?: string;
    text?: string;
    label?: string;
  };
}

export interface PolaroidItem {
  src: string;
  caption: string;
  backNote: string;
}

export interface OpenWhenLetter {
  label: string;
  note: string;
  emoji?: string;
}

export const content = {
  her: {
    name: "Zoya",
    nickname: "Baby",
    turningAge: 23,
    birthdayISO: "2026-08-27T00:00:00+05:30",
  },
  you: { name: "Ashir", signOff: "Your Husband" },
  us: {
    startedISO: "2025-02-28T00:00:00+05:30",
    counterLabel: "loving you for",
    cantWaitFor: ["the first dance", "every ordinary Tuesday", "that trip we keep talking about"],
  },
  music: { heroSong: { src: "/audio/our-song.mp3", title: "Song — Artist" } },

  chapters: [
    // REPLACE ALL — 5–7 items, childhood → today, incl. the "and then, luckily for me…" chapter
    {
      id: "ch-1",
      title: "Before Everything",
      dateLabel: "circa 2003",
      photo: "/photos/ch1.webp",
      lines: ["exhibit A: the cutest kid in the world.", "some things never change."],
    },
    {
      id: "ch-2",
      title: "The Day We Met",
      dateLabel: "14 Feb 2022",
      photo: "/photos/ch2.webp",
      lines: ["you laughed at my worst joke.", "i was done for."],
      artifact: {
        kind: "image",
        src: "/photos/first-text.webp",
        label: "our actual first text",
      },
    },
  ] as Chapter[],

  polaroids: [
    // REPLACE ALL — 10–16 items
    {
      src: "/photos/p01.webp",
      caption: "that day.",
      backNote: "you have no idea how hard i was trying to be cool here.",
    },
  ] as PolaroidItem[],

  reasons: [
    // REPLACE ALL — length MUST equal her.turningAge; LAST item is the special one
    "the way you narrate the dog's thoughts.",
    "Reason #26: you said yes.",
  ] as string[],

  openWhen: [
    // REPLACE ALL — 5–8 items; see label ideas in Appendix B
    {
      label: "open when you miss me",
      emoji: "🥺",
      note: "close your eyes. remember [our place]. i'm right there. now call me — yes, even at 3am. especially at 3am.",
    },
    {
      label: "open when you're mad at me",
      emoji: "😬",
      note: "i'm sorry. i'm probably wrong. [inside joke]. come find me — i'll have your favorite snack ready.",
    },
  ] as OpenWhenLetter[],

  letter: {
    paragraphs: [
      // REPLACE — written by the owner, in his own words. Not generated.
      "placeholder paragraph one…",
      "placeholder paragraph two…",
    ] as string[],
    voiceSrc: undefined as string | undefined,
  },

  giftClue: undefined as { riddle: string } | undefined,

  finale: {
    line1: "Happy birthday, Baby.",
    line2: "I love you. Today, tomorrow, always.",
  },

  easterEggs: { secretPhoto: "/photos/secret.webp", teddyTapCount: 7 },
};
