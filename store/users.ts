import { atom } from "recoil"

export const selfIdState = atom({
  key: "selfIdState",
  default: "",
})

export const listUsersState = atom<any>({
  key: "listUsersState",
  default: {},
})

export const usernameState = atom({
  key: "usernameState",
  default:
    (typeof window !== "undefined" &&
      JSON.parse(window.localStorage.getItem("chattr-username")!)) ||
    "",
})

export const userLeftChattrState = atom({
  key: "userLeftChattrState",
  default: "",
})
