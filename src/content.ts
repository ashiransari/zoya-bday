export interface Chapter {
  id: string;
  title: string;
  dateLabel: string;
  photo: string;
  /** Frame shape for this photo. Defaults to landscape. */
  aspect?: "landscape" | "portrait";
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
  aspect?: "landscape" | "portrait";
}

export interface Reason {
  title: string;
  text: string;
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
    cantWaitFor: [
      "that trip to japan, just the two of us",
      "eating our way through every restaurant and cafe until there are none left",
      "making love in every corner of the world",
    ],
  },
  music: {
    heroSong: { src: "/audio/our-song.mp3?v=2", title: "Song by Artist" },
    vinyl: {
      src: "/audio/barbaad.mp3?v=2",
      title: "Barbaad",
      subtitle: "sung by me, only for you",
      kicker: "remember reason #12? i heard you.",
    },
  },

  chapters: [
    {
      id: "ch-1",
      title: "Before Everything",
      dateLabel: "the very beginning",
      photo: "/photos/ch1.webp",
      aspect: "portrait",
      lines: [
        "the world just got lucky and didn't even know it yet.",
      ],
    },
    {
      id: "ch-2",
      title: "Madam Serious",
      dateLabel: "tiny and furious",
      photo: "/photos/ch2.webp",
      aspect: "portrait",
      lines: [
        "the attitude arrived early.",
        "this exact expression still shows up when i annoy you.",
      ],
    },
    {
      id: "ch-3",
      title: "The Haircut Era",
      dateLabel: "school days",
      photo: "/photos/ch3.webp",
      aspect: "portrait",
      lines: [
        "whoever chose this haircut... thank you. genuinely. iconic.",
      ],
    },
    {
      id: "ch-4",
      title: "Before I Knew You",
      dateLabel: "growing up",
      photo: "/photos/ch4.webp",
      aspect: "landscape",
      lines: [
        "somewhere out there, a boy was failing maths who'd one day write you all this.",
      ],
    },
    {
      id: "ch-5",
      title: "Fourteen-ish",
      dateLabel: "the tuition years",
      photo: "/photos/ch5.webp",
      aspect: "landscape",
      lines: [
        "this is the face that ruined my concentration in tuition forever.",
      ],
    },
    {
      id: "ch-6",
      title: "All Grown Up",
      dateLabel: "now",
      photo: "/photos/ch6.webp",
      aspect: "portrait",
      lines: [
        "that hair. that grace.",
        "the little girl from these photos became the most beautiful woman i've ever seen.",
      ],
    },
    {
      id: "ch-7",
      title: "And Then, Luckily for Me…",
      dateLabel: "the day you said yes",
      photo: "/photos/ch7.webp",
      aspect: "landscape",
      lines: [
        "the little girl in those photos, all grown up, wearing my ring.",
        "still can't believe you picked me.",
      ],
    },
  ] as Chapter[],

  polaroids: [
    {
      src: "/photos/p01.webp",
      aspect: "landscape",
      caption: "10.01.2026.",
      backNote: "the best decision either of us ever made. mine was asking. yours was saying yes.",
    },
    {
      src: "/photos/p02.webp",
      aspect: "landscape",
      caption: "gateway, no boats.",
      backNote: "we came for the sea. the sea said no. honestly? it did us a favour. look at these photos.",
    },
    {
      src: "/photos/p03.webp",
      aspect: "portrait",
      caption: "the professional.",
      backNote: "your company will put this face on their website like it belongs to them. it doesn't. it's taken.",
    },
    {
      src: "/photos/p04.webp",
      aspect: "portrait",
      caption: "the first date.",
      backNote: "chowpatty, the sunset, and me pretending my heart wasn't doing 200.",
    },
    {
      src: "/photos/p05.webp",
      aspect: "portrait",
      caption: "a ♥ z.",
      backNote: "three beads. the whole story.",
    },
    {
      src: "/photos/p06.webp",
      aspect: "portrait",
      caption: "no caption needed.",
      backNote: "i just stare at this one sometimes. you're not even doing anything. that's the problem.",
    },
    {
      src: "/photos/p07.webp",
      aspect: "portrait",
      caption: "ammi's saree.",
      backNote: "some kinds of beautiful are inherited. this one clearly is.",
    },
    {
      src: "/photos/p08.webp",
      aspect: "portrait",
      caption: "birthday no. 22.",
      backNote: "one hand full of gifts, the other full of you.",
    },
    {
      src: "/photos/p09.webp",
      aspect: "portrait",
      caption: "yjhd.",
      backNote: "some couples have a song. we have a whole film too, a borrowed hoodie, and a boy crying in the dark next to you.",
    },
    {
      src: "/photos/p10.webp",
      aspect: "portrait",
      caption: "his turn.",
      backNote: "first birthday of mine as your fiancé. i've decided every one from now on needs you in it. non-negotiable.",
    },
    {
      src: "/photos/p11.webp",
      aspect: "portrait",
      caption: "your other me.",
      backNote: "you say he looks exactly like me. he's also quieter and better behaved. keep him close when i'm not there.",
    },
    {
      src: "/photos/p12.webp",
      aspect: "portrait",
      caption: "seekh + sharbat + you.",
      backNote: "the face of a woman who takes food exactly as seriously as i do. this is why it works.",
    },
    {
      src: "/photos/p13.webp",
      aspect: "portrait",
      caption: "professor zoya.",
      backNote: "no notes. wear them more. that's it. that's the message.",
    },
    {
      src: "/photos/p14.webp",
      aspect: "portrait",
      caption: "art.",
      backNote: "museums have security guards for things like this. i just have a lock screen.",
    },
  ] as PolaroidItem[],

  reasons: [
    {
      title: "Your face. All of it.",
      text: "Your eyes, your smile, your longgggg hair, your tiny hands, that beautiful face… I genuinely can't pick one. I love all of you.",
    },
    {
      title: "Your kisses.",
      text: "You can fix my mood with one kiss and make me think that life isn't that bad.",
    },
    {
      title: "The way you mock me.",
      text: "You mimic me just to annoy me, but somehow you still sound so fucking cute doing it.",
    },
    {
      title: "Your possessiveness.",
      text: "That little “he's mine” side of you makes me feel ridiculously loved.",
    },
    {
      title: "Your “stupid.”",
      text: "You can call me stupid and somehow I'll still be sitting there smiling like an idiot.",
    },
    {
      title: "Our silent VCs.",
      text: "I love that we can be on a call doing absolutely nothing and still be perfectly happy just knowing we're together.",
    },
    {
      title: "You listen to my nonsense.",
      text: "I can talk about movies, actors, behind-the-scenes gossip and completely useless shit for hours, and you still listen. ❤️",
    },
    {
      title: "Our KitKat milkshake.",
      text: "That little spark in your eyes when you take the first sip will never stop making me happy.",
    },
    {
      title: "Food fixes everything.",
      text: "Watching your mood instantly improve the moment you get something tasty is one of my favourite things.",
    },
    {
      title: "Your “Babyyyyy.”",
      text: "I don't think you'll ever understand how much I love hearing you call me Babyyyyy or Jaanu.",
    },
    {
      title: "Your “I miss you.”",
      text: "Because I know your “I miss you” secretly means “I love you.” And I love hearing both.",
    },
    {
      title: "Your Barbaad obsession.",
      text: "I love that you only want to hear Barbaad when I sing it. And I bet you're wishing you could hear it right now. 😌",
    },
    {
      title: "Your heart.",
      text: "You're kind and respectful to people even when you don't have to be. I notice that.",
    },
    {
      title: "Your loyalty.",
      text: "You've given me a kind of security and peace that I never want to take for granted.",
    },
    {
      title: "The way you take care of me.",
      text: "When I'm lost or down, you somehow know how to be there. Sometimes that's all I need.",
    },
    {
      title: "Your determination.",
      text: "Even when you're sleepy, tired or sick, you still make sure your work gets done. I genuinely admire that about you.",
    },
    {
      title: "Your happy face.",
      text: "I love watching your entire face light up when you're genuinely happy. Your happiness makes me happy.",
    },
    {
      title: "The way you make me feel wanted.",
      text: "When you miss me, want me around or insist that I come see you, I love knowing that you genuinely want me there.",
    },
    {
      title: "How comfortable I am with you.",
      text: "I can sit beside you, say nothing, do nothing and still be completely happy. I've never felt that comfortable with anyone else.",
    },
    {
      title: "Your little habits.",
      text: "The random things you say, your expressions, your reactions, your weird little ways. I notice them all, and I love them.",
    },
    {
      title: "Sharing life with you.",
      text: "Food, movies, random conversations, stupid jokes. Everything somehow becomes better when I'm doing it with you.",
    },
    {
      title: "The little things you do.",
      text: "A message, a call, a kiss, your laugh, seeing your name on my phone. Tiny things, but somehow you make my entire day better.",
    },
    {
      title: "Because you feel like reaching the top.",
      text: "Loving you feels like finishing the hardest trek of my life. Exhausted, breathless, wondering if I can take another step.\n\nThen I reach the top. The breeze hits, the rain falls, I see the view and suddenly realise every step was worth it.\n\nThat's you, Baby.\n\nAnd I'd walk the whole fucking trek again, just to reach you. ❤️",
    },
  ] as Reason[],

  openWhen: [
    {
      label: "open when you miss me",
      emoji: "🥺",
      note: "Baby,\n\nI know your first instinct is probably to call me, find some stupid reason for us to meet, or just sit there thinking about us.\n\nSo here's your reminder. I'm missing you too.\n\nUntil we can actually meet, call me. Even if we have nothing to say. Put me on VC, keep your phone beside you and let's just exist together like we always do.\n\nAnd if even that isn't enough, close your eyes for a second and imagine me sitting beside you, annoying you, and asking you what you want to eat.\n\nWe'll meet soon, Baby. You just have to survive until then. ❤️",
    },
    {
      label: "open when you're mad at me",
      emoji: "😭",
      note: "Okay. You're mad at me.\n\nAnd knowing you, you probably have a whole fucking courtroom case prepared against me already.\n\nSo I'm not going to argue with you. I'm not going to get angry because you're angry. I'm not going to try to win. And I'm definitely not going to say something stupid just because my ego wants the last word.\n\nTake your time. And whenever you're ready, come talk to me. I'll listen properly, I'll understand why you're hurt, and if I'm wrong, I'll say I'm wrong.\n\nBut before you decide to completely hate me for the next 48 hours, just remember one thing.\n\nI'm still your stupid. And you're still my Baby.\n\nNow come here. 🥺",
    },
    {
      label: "open when you can't sleep",
      emoji: "🌙",
      note: "Babyyyy,\n\nFirst of all, if you slept in the evening and are now wondering why you're awake at 2 AM… this is entirely your fault. 😭\n\nBut if you're lying there overthinking everything that has happened in your past, stop for a moment. You don't have to solve your entire life tonight.\n\nWhatever happened has already happened. You don't have to relive it just because your brain has decided that midnight is the perfect time for a documentary about everything that ever hurt you.\n\nPut your phone down, take a deep breath, get comfortable and let yourself rest.\n\nAnd if your brain refuses to shut up, imagine me telling you “Bass karo baby. Ab soo jao. Baaki overthinking kar lena.”\n\nGoodnight, Jaanu. ❤️",
    },
    {
      label: "open when you had a long day",
      emoji: "🫂",
      note: "Baby,\n\nYou've had a long day. So tonight, you don't have to be productive, impressive, strong or anything else.\n\nJust come here.\n\nImagine you're lying next to me, your head on me, we're cuddling and talking about absolutely everything and nothing at the same time.\n\nTell me about your day. Complain about whoever annoyed you. Tell me what pissed you off. Tell me something stupid that happened. And if you don't feel like talking, that's okay too. You can just lie there with me.\n\nNo work. No pressure. No expectations. Just us.\n\nNow breathe. You've done enough for today, Baby. ❤️",
    },
    {
      label: "open when you need to laugh",
      emoji: "😂",
      note: "Okay Baby, I have two stories for you.\n\nStory 1. Remember when we weren't even together and I was meeting you alone outside your college for the first time? I thought smoking a cigarette with one hand while riding my bike would make me look cool.\n\nI reached near you…\n\nAND FUCKING FELL OFF THE BIKE.\n\nThat was my grand entrance. 😭\n\nStory 2. When my family came to your house for the marriage proposal and you looked at your sister-in-law, thought she was Zoya, and got shocked for a few seconds. Imagine being confused about your own identity at your own marriage proposal. 😭😭\n\nSo if you're still not laughing after this, honestly I don't know what to do with you.\n\nBut at least remember one thing. You chose this idiot.",
    },
    {
      label: "open when you doubt yourself",
      emoji: "❤️",
      note: "Baby,\n\nI know sometimes you look at yourself and focus on the things you wish were different. Maybe you wish you were taller. Maybe being an introvert makes you question whether you're capable of doing certain things or putting yourself out there.\n\nBut you're judging yourself from inside your own head, where every little insecurity sounds ten times louder.\n\nI see something different. I see a girl who keeps showing up. Who gets her work done even when she's exhausted. Who can be quiet and still have so much to say. Who doesn't need to be the loudest person in the room to matter.\n\nYou don't have to become some completely different version of yourself to be impressive. You just have to stop underestimating the girl you already are.\n\nSo whenever that little voice tells you “maybe I'm not good enough,” don't believe it immediately. I've spent enough time watching you to know better.\n\nYou're capable of far more than you give yourself credit for.\n\nNow go prove yourself wrong. ❤️",
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
    // Wired ahead of the file. AudioNote hides itself until /audio/letter.mp3
    // actually exists, so dropping the file in is the only step needed.
    voiceSrc: "/audio/letter.mp3?v=2" as string | undefined,
  },

  finale: {
    line1: "Happy birthday, Baby.",
    line2: "I love you. Today, tomorrow, always.",
  },

  easterEggs: {
    secretPhoto: "/photos/secret.webp",
    secretAspect: "portrait" as "landscape" | "portrait",
    secretLine:
      "this is us according to the AI. it got you exactly right. it got me… very optimistic.",
    teddyTapCount: 7,
  },
};
