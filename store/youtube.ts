import { atom } from "recoil"

interface YoutubeVideo {
  title: string
}

export const youtubeUrlState = atom<string>({
  key: "youtubeUrlState",
  default: "",
})

export const playYoutubeVideoState = atom<boolean>({
  key: "playYoutubeVideoState",
  default: false,
})

export const youtubeVideoDurationState = atom<number>({
  key: "youtubeVideoDurationState",
  default: 0,
})

export const youtubeVideoMuteSoundState = atom<boolean>({
  key: "youtubeVideoMuteSoundState",
  default: false,
})

export const youtubeVideoMetaDataState = atom<YoutubeVideo>({
  key: "youtubeVideoMetaDataState",
  default: { title: "" },
})

export const youtubeVideoRewindState = atom<boolean>({
  key: "youtubeVideoRewindState",
  default: false,
})

export const youtubeProgressBarWidthState = atom<number>({
  key: "youtubeProgressBarWidthState",
  default: 0,
})
