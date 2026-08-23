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
      "To My Baby,",
      "Happy Birthday to the person who somehow became the most important part of my life.",
      "Sometimes I still think about that first day in tuition when I looked at you sitting in front of me and genuinely couldn't believe that such a cute girl was sitting right there. I obviously had no idea then what you were going to become to me. And honestly, even after you rejected me the first time, I tried to move on. I really did. But I couldn't. Somewhere in that inability to let you go, I realised that this wasn't just some silly crush anymore. I had fallen for you.",
      "And now look at us. From 15th May 2017, to 28th February 2025, and to 10th January 2026. From two people sitting in a tuition class to being engaged and planning a whole life together. Sometimes that still feels crazy to me.",
      "I love so many little things about you. I love when you mock me by mimicking me and somehow even that sounds cute coming from you. I love your stupid little giggle when you're happy, especially when you've got something from me that you wanted. I love that you're as much of a foodie as I am. I love the weird way you sleep. I love how, whenever I'm feeling lost or down, you somehow know how to be there for me. You probably don't even realise how much those things mean to me.",
      "There are so many moments with you that I could talk about forever. Our first date at Chowpatty, eating together, you bringing me gifts, sitting beside each other and watching the sunset. Then that cab ride back, when I held your hand for the first time, touched your thigh, kissed you and hugged you. I don't think I'll ever forget how that felt.",
      "Or back when we weren't together and we went for YJHD. I brought flowers, you wore my hoodie, and I was sitting there crying at that one scene. And then when you had to leave and couldn't take the flowers home, you sat on the bike and went away while I stood there holding them, just watching you leave. Maybe that was the first moment you started feeling something for me beyond friendship. I love thinking about that.",
      "And then our engagement. I still remember seeing you in that dress for the first time. Baby I genuinely couldn't understand how someone could look that fucking beautiful. There might be many things going wrong that day but when I look back, none of that stays with me. I only remember you. Your smile. Your laugh. Us taking pictures. Putting those rings on each other's fingers. You looked so fucking pretty that I was just completely mesmerised.",
      "We've also had some really difficult days. The last few months haven't exactly been easy. We've fought, things have escalated, we've both said things we shouldn't have, and there are things I've done that I genuinely regret because I know they hurt you and broke your trust. Every time things got bad, one thought scared me more than anything else, that I might lose you. That honestly scared me to death.",
      "But through all of it, you stayed. You stood beside me even when I wasn't at my best. You loved me even when loving me wasn't easy. And I don't take that lightly.",
      "I don't want to pretend that our life after marriage will be perfect. It won't be. We'll have problems. We'll fight. We'll annoy each other. We'll have days where you'd want to strangle me. But I know one thing with complete certainty. I want to face all of it with you. I want us to survive the rough patches without ever letting them take away the love we have for each other.",
      "You have changed me in ways I don't think I would've understood before meeting you. Before you, I don't think I would've been this responsible, this willing to grow, this willing to genuinely think about another person before myself. Because of you, I want to become the best version of myself. You've taught me that loving someone isn't just about saying \"I love you.\" It's about taking care of them, being there when they're struggling, choosing them even when things aren't easy, and trying again after you've messed up.",
      "And when I think about our future, weirdly it's not the big things that excite me the most. Yes, I want the travelling, the adventures, the kids, the big moments. But I'm most excited about the ordinary days. Coming home and knowing that I have you to come home to. Waking up on a random Saturday beside you, making love to you, having breakfast, you asking me to go somewhere, me saying \"no I want to rest\" purely to annoy you, you getting angry, me trying to make you happy again, eventually taking you out anyway, coming home late, kissing you and falling asleep next to you.",
      "That's the life I want.",
      "A life where we're both imperfect, where we learn each other's flaws and somehow still choose each other every single day.",
      "And shonu, there's one thing I want you to know more than anything else.",
      "I don't know what life is going to look like ten, twenty or fifty years from now. I don't know what problems we'll have to face or how difficult some days might become. But I know that there isn't anyone else I want beside me through any of it.",
      "I only love you.",
      "It was you. It is you. And it will always be you.",
      "You are enough for me. More than enough.",
      "I don't know whether, years from now, I'll be able to give you the same kind of birthday surprises or do as many things as I can do today. Life will change, we'll change, our responsibilities will change. But I can promise you this, whatever I do for you, whether it's a lot or very little, it will always have a ridiculous amount of effort and love behind it. Because that's what you deserve from me.",
      "And honestly, you're still that girl who can make me absolutely fucking furious and somehow an hour later, make me want to crawl back to you, hug you, kiss you and fix everything just because I can't stay away from you.",
      "So Happy 23rd Birthday My Baby.",
      "I hope when you read this years from now, you can look back at this exact moment and smile because that boy who wrote this was telling you the truth.",
      "I love you more than I know how to put into words.",
      "And I can't wait to spend the rest of my life finding better ways to show you.",
    ] as string[],
    // shown larger, in cherry handwriting, after the body types out
    closingLines: [
      "Happy Birthday Zoya. ❤️",
      "Always you.",
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
