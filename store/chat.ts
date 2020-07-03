import { atom } from "recoil"

import { Message } from "../models"

export const chatWindowState = atom<Array<Message>>({
  key: "chatWindowState",
  default: [],
})

export const chatWelcomeMessageState = atom<string>({
  key: "chatWelcomeMessageState",
  default: "",
})

export const chatUserIsTypingState = atom<Partial<Message>>({
  key: "chatUserIsTypingState",
  default: { username: "", status: false },
})

export const fileNameState = atom<string>({
  key: "fileNameState",
  default: "false",
})

export const fileTransferProgressState = atom<string>({
  key: "fileTransferProgressState",
  default: "0",
})

export const sendingFileState = atom<boolean>({
  key: "sendingFileState",
  default: false,
})

export const receivingFileState = atom<boolean>({
  key: "receivingFileState",
  default: false,
})

export const expandChatWindowState = atom<boolean>({
  key: "expandChatWindowState",
  default: false,
})

export const messageDeletedState = atom<boolean>({
  key: "messageDeletedState",
  default: false,
})

export const messageContainsHeartEmojiState = atom<boolean>({
  key: "messageContainsHeartEmojiState",
  default: false,
})

export const photoGalleryState = atom<Array<any>>({
  key: "photoGalleryState",
  default: [],
})

export const showPhotoGalleryState = atom<boolean>({
  key: "showPhotoGalleryState",
  default: false,
})

export const chatHomeState = atom<boolean>({
  key: "chatHomeState",
  default: true,
})
