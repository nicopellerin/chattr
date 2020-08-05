import { atom, selector } from "recoil"

import { listUsersState } from "./users"
import { createState } from "@state-designer/react"

import { FilterClasses } from "../models"

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

export const cancelCallAction = selector({
  key: "cancelCallAction",
  get: () => {},
  set: ({ set }) => {
    set(pressedCallState, false)
    set(callAcceptedState, false)
    set(receivingCallState, false)
    set(cancelCallRequestState, true)
    set(streamOtherPeerState, null)
  },
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

export const getUserMediaPeerNotSupportedState = atom<boolean>({
  key: "getUserMediaPeerNotSupportedState",
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

export const peerClosedVideoState = atom<boolean>({
  key: "peerClosedVideoState",
  default: false,
})

export const peerClosedVideoQuery = selector({
  key: "peerClosedVideo",
  get: ({ get }) => {
    const callAccepted = get(callAcceptedState)
    const peerAudioMuted = get(peerClosedVideoState)
    const listUsers = get(listUsersState)

    if (callAccepted && peerAudioMuted && listUsers?.length > 1) {
      return true
    }

    return false
  },
})

export const shareVideoScreenState = atom<boolean>({
  key: "shareVideoScreenState",
  default: false,
})

export const screenSharingStartedState = atom<boolean>({
  key: "screenSharingStartedState",
  default: false,
})

export const sharingScreenState = atom<boolean>({
  key: "sharingScreenState",
  default: false,
})

export const flipSelfVideoState = atom<boolean>({
  key: "flipSelfVideoState",
  default: false,
})

export const flipFriendVideoState = atom<boolean>({
  key: "flipFriendVideoState",
  default: false,
})

export const micVolumeState = atom<number>({
  key: "micVolumeState",
  default: 1,
})

export const videoFilterClassState = atom<FilterClasses | null>({
  key: "videoFilterClassState",
  default: null,
})

export const chatVideoScreens = createState({
  id: "chatTextWindowScreens",
  initial: "waitingForConnectionScreen",
  states: {
    waitingForConnectionScreen: {},
    callingScreen: {
      initial: "hidden",
      states: {
        hidden: {},
        visible: {},
      },
    },
    noVideoScreen: {},
    peerNoVideoScreen: {},
    incomingCallScreen: {
      initial: "hidden",
      states: {
        hidden: {},
        visible: {},
      },
    },
    youtubeVideoScreen: {
      initial: "hidden",
      states: {
        hidden: {},
        visible: {},
      },
    },
  },
})

export const catSliderScreen = createState({
  id: "catSliderScreen",
  initial: "hidden",
  states: {
    hidden: {
      on: { SHOW: { secretlyTo: "visible" } },
    },
    visible: {
      on: { SHOW: { secretlyTo: "hidden" } },
    },
  },
})
