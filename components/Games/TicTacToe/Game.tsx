import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import { useSetRecoilState, useRecoilState } from "recoil"

import Board from "./Board"

import { usernameState } from "../../../store/users"
import {
  playGameShowInitialScreenState,
  playGameState,
  playerXGlobalState,
  playerOGlobalState,
  showWaitingScreenState,
  wonGameState,
  tieGameState,
  xIsNextState,
  boardState,
} from "../../../store/game"

import { calculateWinner, calculateTie } from "./utils"

import ScreenInitial from "./ScreenInitial"
import ScreenWaitingForConnection from "./ScreenWaitingForConnection"
import ScreenWinOrTie from "./ScreenWinOrTie"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

enum SquareValue {
  "X",
  "O",
}

const Game: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const playerXGlobal = useRecoilValue(playerXGlobalState)
  const playerOGlobal = useRecoilValue(playerOGlobalState)

  const setPlayGame = useSetRecoilState(playGameState)
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
          setPlayGame(false)
        }
      }
    )
  }, [socket.current])

  const handleClick = (i: number) => {
    const boardCopy = [...board]
    if (winner || boardCopy[i]) return
    boardCopy[i] = xIsNext ? SquareValue.X : SquareValue.O
    click.play()
    socket.current.emit("gameBoardUpdated", boardCopy)
    socket.current.emit("gameNextPlayer", xIsNext)
  }

  return (
    <Wrapper>
      <AnimatePresence>
        {playGameShowInitialScreen && <ScreenInitial socket={socket} />}
        {!playGameShowInitialScreen &&
          !showWaitingScreen &&
          xIsNext &&
          playerXGlobal?.username !== username && (
            <NotYourTurnWrapper>
              <NoMarginContainer
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <WaitingText>
                  {playerXGlobal?.username}'s turn (
                  <span style={{ color: "var(--secondaryColor)" }}>
                    {playerXGlobal?.letter}
                  </span>
                  )
                </WaitingText>
              </NoMarginContainer>
            </NotYourTurnWrapper>
          )}
        {!playGameShowInitialScreen &&
          !showWaitingScreen &&
          !xIsNext &&
          playerOGlobal?.username !== username && (
            <NotYourTurnWrapper>
              <NoMarginContainer
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <WaitingText>
                  {playerOGlobal?.username}'s turn (
                  <span style={{ color: "var(--secondaryColor)" }}>
                    {playerOGlobal?.letter}
                  </span>
                  )
                </WaitingText>
              </NoMarginContainer>
            </NotYourTurnWrapper>
          )}
        {!playGameShowInitialScreen && showWaitingScreen && (
          <ScreenWaitingForConnection />
        )}
        {(won || tie) && <ScreenWinOrTie socket={socket} />}
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

const ScreenWrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.9), #0f0818);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const NotYourTurnWrapper = styled(ScreenWrapper)`
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.2), #0f0818);
`

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -5rem;
`

const NoMarginContainer = styled(Container)`
  margin-top: -3rem;
`

const WaitingText = styled.h5`
  color: var(--tertiaryColor);
  font-size: 3rem;
  text-align: center;
  line-height: 1.3;
  margin: 0 auto;
  max-width: 80%;
`
