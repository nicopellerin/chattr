import { atom, selector } from "recoil"

import { otherUsernameQuery } from "./users"

interface Player {
  username: string
  letter: string
}

enum SquareValue {
  X = "X",
  O = "O",
}

export const playGameState = atom<boolean>({
  key: "playGameState",
  default: false,
})

export const boardState = atom<Array<SquareValue | null>>({
  key: "boardState",
  default: Array(9).fill(null),
})

export const playGameShowInitialScreenState = atom<boolean>({
  key: "playGameShowInitialScreenState",
  default: true,
})

export const playGamePlayerTurn = atom<SquareValue>({
  key: "playGamePlayerTurn",
  default: SquareValue.X,
})

export const playGameStartedUsernameState = atom<string>({
  key: "playGameStartedUsernameState",
  default: "",
})

export const showWaitingScreenState = atom<boolean>({
  key: "showWaitingScreenState",
  default: false,
})

export const playGamePlayerAssignQuery = selector({
  key: "playGamePlayerAssignQuery",
  get: ({ get }) => {
    const playerX = { username: get(playGameStartedUsernameState), letter: "X" }
    const playerO = { username: get(otherUsernameQuery), letter: "O" }

    return {
      playerX,
      playerO,
    }
  },
})

export const playerXGlobalState = atom<Player>({
  key: "playerXGlobalState",
  default: { username: "", letter: "" },
})

export const playerOGlobalState = atom<Player>({
  key: "playerOGlobalState",
  default: { username: "", letter: "" },
})

export const wonGameState = atom<boolean>({
  key: "wonGameState",
  default: false,
})

export const tieGameState = atom<boolean>({
  key: "tieGameState",
  default: false,
})

export const xIsNextState = atom<boolean>({
  key: "xIsNextState",
  default: true,
})

export const startGameState = selector({
  key: "startGameState",
  get: () => {},
  set: ({ set }) => {
    set(playGameShowInitialScreenState, false)
    set(showWaitingScreenState, true)
    set(wonGameState, false)
    set(xIsNextState, true)
  },
})

export const resetGameState = selector({
  key: "resetGameState",
  get: () => {},
  set: ({ set }) => {
    set(playGameShowInitialScreenState, false)
    set(boardState, Array(9).fill(null))
    set(xIsNextState, true)
    set(wonGameState, false)
    set(playGameState, true)
  },
})
