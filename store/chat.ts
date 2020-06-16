import { atom } from "recoil"

export const chatWindowState = atom<Array<any>>({
  key: "chatWindowState",
  default: [],
})

export const chatWelcomeMessageState = atom<string>({
  key: "chatWelcomeMessageState",
  default: "",
})
