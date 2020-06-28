import { atom, selector } from "recoil"

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

export const otherUsernameQuery = selector({
  key: "otherUsernameQuery",
  get: ({ get }) => {
    const me = get(usernameState)
    const list = get(listUsersState)
    const newList = list.filter((user) => user.username !== me)

    return newList[0]?.username
  },
})

export const otherUserIdQuery = selector({
  key: "otherUserIdQuery",
  get: ({ get }) => {
    const me = get(usernameState)
    const list = get(listUsersState)
    const newList = list.filter((user) => user.username !== me)

    return newList[0]?.id
  },
})
