import { atom } from "recoil"

export const supportsPWAState = atom<boolean>({
  key: "supportsPWAState",
  default: false,
})

export const joinRoomState = atom<boolean>({
  key: "joinRoomState",
  default: false,
})
