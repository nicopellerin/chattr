import { atom, selector } from "recoil"

import { listUsersState } from "./users"

export const streamState = atom<MediaStream | any>({
  key: "streamState",
  default: null,
})

export const streamOtherPeerState = atom<MediaStream | any>({
  key: "streamOtherPeerState",
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

export const cancelCallRequestState = atom<boolean>({
  key: "cancelCallRequest",
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

export const disableCallIconState = selector({
  key: "disableCallIconState",
  get: ({ get }) => {
    const receivingCall = get(receivingCallState)
    const callAccepted = get(callAcceptedState)
    const listUsers = get(listUsersState)

    if (listUsers?.length < 2 || (receivingCall && !callAccepted)) {
      return true
    } else {
      return false
    }
  },
})

export const getUserMediaNotSupportedState = atom<boolean>({
  key: "getUserMediaNotSupportedState",
  default: false,
})

export const displayTheatreModeState = atom<boolean>({
  key: "displayTheatreModeState",
  default: false,
})

export const peerAudioMutedState = atom<boolean>({
  key: "peerAudioMutedState",
  default: false,
})

export const peerAudioMutedQuery = selector({
  key: "peerAudioMuted",
  get: ({ get }) => {
    const callAccepted = get(callAcceptedState)
    const peerAudioMuted = get(peerAudioMutedState)
    const listUsers = get(listUsersState)

    if (callAccepted && peerAudioMuted && listUsers?.length > 1) {
      return true
    }

    return false
  },
})
