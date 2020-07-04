import { atom } from "recoil"

export const youtubeUrlState = atom<string>({
  key: "youtubeUrlState",
  default: "",
})

export const playYoutubeVideoState = atom<boolean>({
  key: "playYoutubeVideoState",
  default: false,
})
