import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { useSetRecoilState } from "recoil"
import { useStateDesigner } from "@state-designer/react"

import Board from "./Board"

import {
  playerXGlobalState,
  playerOGlobalState,
  wonGameState,
  tieGameState,
  xIsNextState,
  boardState,
  gameScreens,
} from "../../../store/game"

import { calculateWinner, calculateTie } from "./utils"

import ScreenInitial from "./ScreenInitial"
import ScreenWaitingForConnection from "./ScreenWaitingForConnection"
import ScreenWinOrTie from "./ScreenWinOrTie"
import ScreenYourTurn from "./ScreenYourTurn"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

enum SquareValue {
  X = "X",
  O = "O",
}

const Game: React.FC<Props> = ({ socket }) => {
  const state = useStateDesigner(gameScreens)

  const playerXGlobal = useRecoilValue(playerXGlobalState)
  const playerOGlobal = useRecoilValue(playerOGlobalState)
  const board = useRecoilValue(boardState)
  const xIsNext = useRecoilValue(xIsNextState)

  const setTieGame = useSetRecoilState(tieGameState)
  const setWon = useSetRecoilState(wonGameState)

  const winner = calculateWinner(board)
  const tie = calculateTie(board, winner)

  const click = new Audio("/sounds/tic-click.mp3")
  click.volume = 0.3
  const win = new Audio("/sounds/tic-win.mp3")
  win.volume = 0.3

  useEffect(() => {
    if (winner && !tie) {
      setWon(true)
      state.forceTransition("winOrTieScreen")
      win.play()
    }
  }, [winner])

  useEffect(() => {
    if (tie) {
      setTieGame(true)
      state.forceTransition("winOrTieScreen")
    }
  }, [tie])

  // Game square click
  const handleClick = (i: number) => {
    const boardCopy = [...board]
    if (winner || boardCopy[i]) return
    boardCopy[i] = xIsNext ? SquareValue.X : SquareValue.O
    click.play()
    socket?.current?.emit("gameBoardUpdated", boardCopy)
    socket?.current?.emit("gameNextPlayer", xIsNext)
  }

  return (
    <Wrapper>
      {!state.isIn("initialScreen") && (
        <ScreenYourTurn player={xIsNext ? playerXGlobal : playerOGlobal} />
      )}
      {state.whenIn({
        initialScreen: <ScreenInitial socket={socket} />,
        waitingConnectionScreen: <ScreenWaitingForConnection socket={socket} />,
        winOrTieScreen: <ScreenWinOrTie socket={socket} />,
      })}
      <Board squares={board} onClick={handleClick} />
    </Wrapper>
  )
}

export default Game

// Styles
const Wrapper = styled.div`
  height: 400px;
`
