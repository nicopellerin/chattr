import { atom, selector } from "recoil"

import { Message } from "../models"
import { userLeftChattrState } from "./users"
import {
  pressedCallState,
  callAcceptedState,
  receivingCallState,
  streamOtherPeerState,
} from "./video"

interface OgData {
  title: string
  desc: string
  image: string
}

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

export const togglePhotoExpanderState = atom<boolean>({
  key: "togglePhotoExpanderState",
  default: false,
})

export const selectedPhotoState = atom<string>({
  key: "selectedPhotoState",
  default: "",
})

export const chatHomeState = atom<boolean>({
  key: "chatHomeState",
  default: true,
})

export const showPlayBarState = atom<boolean>({
  key: "showPlayBarState",
  default: false,
})

export const messageOgDataState = atom<OgData>({
  key: "messageOgDataState",
  default: { title: "", desc: "", image: "" },
})

export const userLeftChattrAction = selector({
  key: "userLeftChattrQuery",
  get: () => {},
  set: ({ set }) => {
    set(userLeftChattrState, true)
    set(pressedCallState, false)
    set(callAcceptedState, false)
    set(receivingCallState, false)
    set(chatWindowState, [])
    set(sendingFileState, false)
    set(fileTransferProgressState, "0")
    set(streamOtherPeerState, null)
  },
})

export const flipLayoutState = atom<boolean>({
  key: "flipLayoutState",
  default: false,
})
