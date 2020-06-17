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
  default: `Nico${Math.floor(Math.random() * 100)}`,
})
