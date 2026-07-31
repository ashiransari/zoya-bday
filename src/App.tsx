import { useMemo, useState } from "react";
import { MusicToggle } from "./components/MusicToggle";
import { Grain } from "./effects/Grain";
import { AppCtx } from "./lib/AppCtx";
import { S2_GiftBox } from "./scenes/S2_GiftBox";

function App() {
  const [giftOpened, setGiftOpened] = useState(false);
  const appCtxValue = useMemo(
    () => ({ giftOpened, setGiftOpened }),
    [giftOpened],
  );

  return (
    <AppCtx.Provider value={appCtxValue}>
      <main className="relative isolate min-h-[100dvh] overflow-hidden bg-paper text-ink">
        <Grain />
        <MusicToggle />
        <S2_GiftBox />
      </main>
    </AppCtx.Provider>
  );
}

export default App;
