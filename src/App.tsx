import { useMemo, useState } from "react";
import { MusicToggle } from "./components/MusicToggle";
import { content } from "./content";
import { EasterEggs } from "./effects/EasterEggs";
import { Grain } from "./effects/Grain";
import { HeartCursor } from "./effects/HeartCursor";
import { TabTitle } from "./effects/TabTitle";
import { AppCtx } from "./lib/AppCtx";
import { S0_Loading } from "./scenes/S0_Loading";
import { S1_MidnightLock } from "./scenes/S1_MidnightLock";
import { S2_GiftBox } from "./scenes/S2_GiftBox";
import { S3_StoryOfHer } from "./scenes/S3_StoryOfHer";
import { S4_PolaroidWall } from "./scenes/S4_PolaroidWall";
import { S5_ReasonsDeck } from "./scenes/S5_ReasonsDeck";
import { S6_OpenWhen } from "./scenes/S6_OpenWhen";
import { S7_Cake } from "./scenes/S7_Cake";
import { S8_Letter } from "./scenes/S8_Letter";
import { S9_Finale } from "./scenes/S9_Finale";

if (content.reasons.length !== content.her.turningAge) {
  console.warn("reasons.length ≠ turningAge");
}

function App() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(() => {
    const preview =
      new URLSearchParams(window.location.search).get("preview") === "1";

    return !preview && Date.now() < Date.parse(content.her.birthdayISO);
  });
  const appCtxValue = useMemo(
    () => ({ giftOpened, setGiftOpened }),
    [giftOpened],
  );

  let activeScene;

  if (loading) {
    activeScene = <S0_Loading onComplete={() => setLoading(false)} />;
  } else if (locked) {
    activeScene = <S1_MidnightLock onUnlock={() => setLocked(false)} />;
  } else {
    activeScene = (
      <>
        <S2_GiftBox />
        <S3_StoryOfHer />
        <S4_PolaroidWall />
        <S5_ReasonsDeck />
        <S6_OpenWhen />
        <S7_Cake />
        <S8_Letter />
        <S9_Finale />
      </>
    );
  }

  return (
    <AppCtx.Provider value={appCtxValue}>
      <main className="relative isolate min-h-[100dvh] overflow-hidden bg-paper text-ink">
        <Grain />
        <MusicToggle />
        {giftOpened ? (
          <>
            <TabTitle />
            <HeartCursor />
            <EasterEggs />
          </>
        ) : null}
        {activeScene}
      </main>
    </AppCtx.Provider>
  );
}

export default App;
