import { atom } from "recoil"

export const streamState = atom<MediaStream | any>({
  key: "streamState",
  default: null,
})

export const receivingCallState = atom<boolean>({
  key: "receivingCallState",
  default: false,
})

export const callerState = atom<any>({
  key: "callerState",
  default: null,
})

export const callerSignalState = atom<any>({
  key: "callerSignalState",
  default: null,
})

export const callAcceptedState = atom<boolean>({
  key: "callAcceptedState",
  default: false,
})

export const showSelfWebcamState = atom<boolean>({
  key: "showSelfWebcamState",
  default: true,
})

export const muteMicState = atom<boolean>({
  key: "muteMicState",
  default: false,
})

export const pressedCallState = atom<boolean>({
  key: "pressedCallState",
  default: false,
})
