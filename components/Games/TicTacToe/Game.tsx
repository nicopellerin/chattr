import * as React from "react"
import { useEffect } from "react"
import { useState } from "react"
import styled from "styled-components"
import Lottie from "react-lottie"

import Board from "./Board"
import { motion, AnimatePresence } from "framer-motion"

import wonAnim from "./confetti.json"

const animOptions = {
  loop: true,
  autoplay: true,
  animationData: wonAnim,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

interface Props {
  setPlayGame: React.Dispatch<React.SetStateAction<boolean>>
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const Game: React.FC<Props> = ({ setPlayGame, socket }) => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXisNext] = useState(true)
  const [won, setWon] = useState(false)
  const [, setTieGame] = useState(false)
  const [initialScreen, setInitialScreen] = useState(true)

  const calculateWinner = (squares: number[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return true
      }
    }
    return false
  }

  const calculateTie = (squares: number[]) => {
    if (squares.every((square) => square !== null) && !winner) {
      return true
    }
    return false
  }

  const tie = calculateTie(board)
  const winner = calculateWinner(board)

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

  const handleClick = (i: number) => {
    const boardCopy = [...board]
    if (winner || boardCopy[i]) return
    boardCopy[i] = xIsNext ? "X" : "O"
    click.play()
    socket.current.emit("boardUpdated", boardCopy)
    setBoard(boardCopy)
    setXisNext((prevState) => !prevState)
  }

  useEffect(() => {
    socket.current.on("boardUpdatedGlobal", (newBoard: number[]) => {
      setBoard(newBoard)
    })
  }, [socket.current])

  const handleStartGame = () => {
    setInitialScreen(false)
    socket.current.emit("startGame")
  }

  useEffect(() => {
    socket.current.on("sendStartGameRequest", () => {
      alert("Request to play")
    })
  }, [socket.current])

  const handleReplay = () => {
    setBoard(Array(9).fill(null))
    setXisNext(true)
    setWon(false)
  }

  return (
    <Wrapper>
      <AnimatePresence>
        {initialScreen && (
          <ScreenWrapper>
            <Container
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <WinnerText>
                Welcome to{" "}
                <span style={{ color: "var(--secondaryColor)" }}>Tic</span>
                <span style={{ color: "var(--successColor)" }}>Tac</span>
                <span style={{ color: "var(--primaryColor)" }}>Toe</span>
              </WinnerText>
              <RematchButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
              >
                Start game
              </RematchButton>
            </Container>
          </ScreenWrapper>
        )}
        {(won || tie) && (
          <ScreenWrapper>
            <Container
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {won ? (
                <>
                  <Lottie
                    options={animOptions}
                    height={125}
                    width={150}
                    isStopped={!won}
                  />
                  <WinnerText>
                    Player{" "}
                    {xIsNext ? <OWonText>O</OWonText> : <XWonText>X</XWonText>}{" "}
                    won
                  </WinnerText>
                </>
              ) : (
                <WinnerText>It's a draw!</WinnerText>
              )}
              <RematchButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReplay}
              >
                Re-match
              </RematchButton>
              <QuitButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlayGame(false)}
              >
                Quit
              </QuitButton>
            </Container>
          </ScreenWrapper>
        )}
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

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -7rem;
`

const WinnerText = styled.h3`
  color: var(--tertiaryColor);
  font-size: 4rem;
  margin-bottom: 3rem;
  text-align: center;
  line-height: 1.3;
`

const XWonText = styled.span`
  color: var(--primaryColor);
`

const OWonText = styled.span`
  color: var(--secondaryColor);
`

const RematchButton = styled(motion.button)`
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  border: none;
  border-radius: 5px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.7rem;
  color: var(--textColor);
  cursor: pointer;
  outline: transparent;
`

const QuitButton = styled(RematchButton)`
  background: var(--primaryColorDark);
  margin-top: 2rem;
`
