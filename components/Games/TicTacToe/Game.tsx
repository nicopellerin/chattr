import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { AnimatePresence } from "framer-motion"
import { useSetRecoilState, useRecoilState } from "recoil"

import Board from "./Board"

import { usernameState } from "../../../store/users"
import {
  playGameShowInitialScreenState,
  playerXGlobalState,
  playerOGlobalState,
  showWaitingScreenState,
  wonGameState,
  tieGameState,
  xIsNextState,
  boardState,
  resetGameState,
} from "../../../store/game"

import { calculateWinner, calculateTie } from "./utils"

import ScreenInitial from "./ScreenInitial"
import ScreenWaitingForConnection from "./ScreenWaitingForConnection"
import ScreenWinOrTie from "./ScreenWinOrTie"
import ScreenNotYourTurn from "./ScreenNotYourTurn"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

enum SquareValue {
  X = "X",
  O = "O",
}

const Game: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const playerXGlobal = useRecoilValue(playerXGlobalState)
  const playerOGlobal = useRecoilValue(playerOGlobalState)

  const setResetGame = useSetRecoilState(resetGameState)
  const setTieGame = useSetRecoilState(tieGameState)

  const [board, setBoard] = useRecoilState(boardState)
  const [xIsNext, setXisNext] = useRecoilState(xIsNextState)
  const [won, setWon] = useRecoilState(wonGameState)
  const [showWaitingScreen, setShowWaitingScreen] = useRecoilState(
    showWaitingScreenState
  )
  const [
    playGameShowInitialScreen,
    setPlayGameShowInitialScreen,
  ] = useRecoilState(playGameShowInitialScreenState)

  const winner = calculateWinner(board)
  const tie = calculateTie(board, winner)

  const click = new Audio("/sounds/tic-click.mp3")
  click.volume = 0.3
  const win = new Audio("/sounds/tic-win.mp3")
  win.volume = 0.3

  useEffect(() => {
    if (winner && !tie) {
      setWon(true)
      win.play()
    }
  }, [winner])

  useEffect(() => {
    if (tie) {
      setTieGame(true)
    }
  }, [tie])

  useEffect(() => {
    socket.current.on(
      "gameBoardUpdatedGlobal",
      (newBoard: Array<SquareValue | null>) => {
        setBoard(newBoard)
      }
    )
    socket.current.on("gameNextPlayerGlobal", () => {
      setXisNext((prevState) => !prevState)
    })
  }, [socket.current])

  useEffect(() => {
    socket.current.on(
      "playGameOtherPlayerAcceptedGlobal",
      (accepted: boolean) => {
        if (accepted) {
          setShowWaitingScreen(false)
        } else {
          setShowWaitingScreen(false)
          setPlayGameShowInitialScreen(true)
          setResetGame()
        }
      }
    )
  }, [socket.current])

  // Game square click
  const handleClick = (i: number) => {
    const boardCopy = [...board]
    if (winner || boardCopy[i]) return
    boardCopy[i] = xIsNext ? SquareValue.X : SquareValue.O
    click.play()
    socket.current.emit("gameBoardUpdated", boardCopy)
    socket.current.emit("gameNextPlayer", xIsNext)
  }

  // Screen show state
  const showInitialScreen = playGameShowInitialScreen
  const showNotYourTurnPlayerOScreen =
    !playGameShowInitialScreen &&
    !showWaitingScreen &&
    xIsNext &&
    playerXGlobal?.username !== username
  const showNotYourTurnPlayerXScreen =
    !playGameShowInitialScreen &&
    !showWaitingScreen &&
    !xIsNext &&
    playerOGlobal?.username !== username
  const showWinOrTieScreen = won || tie
  const showWaitingForConnectionScreen =
    !playGameShowInitialScreen && showWaitingScreen

  return (
    <Wrapper>
      <AnimatePresence>
        {showInitialScreen && <ScreenInitial socket={socket} />}
        {showNotYourTurnPlayerOScreen && (
          <ScreenNotYourTurn player={playerXGlobal} />
        )}
        {showNotYourTurnPlayerXScreen && (
          <ScreenNotYourTurn player={playerOGlobal} />
        )}
        {showWaitingForConnectionScreen && <ScreenWaitingForConnection />}
        {showWinOrTieScreen && <ScreenWinOrTie socket={socket} />}
      </AnimatePresence>
      <Board squares={board} onClick={handleClick} />
    </Wrapper>
  )
}

export default Game

// Styles
const Wrapper = styled.div`
  height: 400px;
`
