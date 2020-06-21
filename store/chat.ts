import { atom } from "recoil"

export const chatWindowState = atom<Array<any>>({
  key: "chatWindowState",
  default: [],
})

export const chatWelcomeMessageState = atom<string>({
  key: "chatWelcomeMessageState",
  default: "",
})

export const chatUserIsTypingState = atom<any>({
  key: "chatUserIsTypingState",
  default: false,
})

export const fileNameState = atom<string>({
  key: "fileNameState",
  default: "false",
})

export const fileTransferProgressState = atom<string>({
  key: "fileTransferProgressState",
  default: "0",
})

export const receivingFileState = atom<boolean>({
  key: "receivingFileState",
  default: false,
})
