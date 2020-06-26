import { atom } from "recoil"

export const supportsPWAState = atom<boolean>({
  key: "supportsPWAState",
  default: false,
})
