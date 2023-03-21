import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export type TokenSessionStorage = {
  token: string | null | undefined;
};

export const userState = atom<any>({
  key: "userState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const tokenSessionState = atom<TokenSessionStorage>({
  key: "tokenSessionState",
  default: {
    token: undefined,
  },
  effects_UNSTABLE: [persistAtom],
});

export const isAuthenticatingState = atom({
  key: "isAuthenticating",
  default: false,
});

export const isAuthenticatedState = atom({
  key: "isAuthenticated",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
