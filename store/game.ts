import { atom, selector } from "recoil"

import { otherUsernameQuery } from "./users"

export const playGameState = atom<boolean>({
  key: "playGameState",
  default: false,
})

export const playGameShowInitialScreenState = atom<boolean>({
  key: "playGameShowInitialScreenState",
  default: true,
})

export const playGamePlayerTurn = atom<string>({
  key: "playGamePlayerTurn",
  default: "X",
})

export const playGameStartedUsernameState = atom<string>({
  key: "playGameStartedUsernameState",
  default: "",
})

export const playGamePlayerAssignQuery = selector({
  key: "playGamePlayerAssignQuery",
  get: ({ get }) => {
    const playerX = { username: get(playGameStartedUsernameState), letter: "X" }
    const playerO = { username: get(otherUsernameQuery), letter: "O" }

    console.log("PLAYERX", playerX)
    console.log("PLAYERO", playerO)

    return {
      playerX,
      playerO,
    }
  },
})

export const playerXGlobalState = atom<any>({
  key: "playerXGlobalState",
  default: null,
})

export const playerOGlobalState = atom<any>({
  key: "playerOGlobalState",
  default: null,
})
