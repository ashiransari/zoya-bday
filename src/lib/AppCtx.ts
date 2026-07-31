import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

interface AppCtxValue {
  giftOpened: boolean;
  setGiftOpened: Dispatch<SetStateAction<boolean>>;
}

export const AppCtx = createContext<AppCtxValue | null>(null);

export function useAppCtx() {
  const value = useContext(AppCtx);

  if (!value) {
    throw new Error("useAppCtx must be used inside AppCtx.Provider");
  }

  return value;
}
