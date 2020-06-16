import { atom } from "recoil"

export const selfIDState = atom({
  key: "selfIDState",
  default: "",
})

export const listUsersState = atom({
  key: "listUsersState",
  default: {},
})
