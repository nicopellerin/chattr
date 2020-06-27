import { atom } from "recoil"

export const selfIdState = atom<string>({
  key: "selfIdState",
  default: "",
})

export const listUsersState = atom<Array<any>>({
  key: "listUsersState",
  default: [],
})

export const usernameState = atom<string>({
  key: "usernameState",
  default:
    (typeof window !== "undefined" &&
      JSON.parse(window.sessionStorage.getItem("chattr-username")!)) ||
    "",
})

export const userLeftChattrState = atom<boolean>({
  key: "userLeftChattrState",
  default: false,
})

export const userSoundOnState = atom<boolean>({
  key: "userSoundOnState",
  default:
    (typeof window !== "undefined" &&
      JSON.parse(window.sessionStorage.getItem("chattr-sounds-on")!)) ||
    true,
})

export const otherUsernameState = atom<string>({
  key: "otherUsernameState",
  default: "",
})
