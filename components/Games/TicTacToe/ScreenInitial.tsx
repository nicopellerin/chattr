import * as React from "react"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { motion } from "framer-motion"
import { useStateDesigner } from "@state-designer/react"

import { NoMarginContainer, WinnerText, RematchButton } from "./GameStyles"
import { gameScreens } from "./Game"

import { usernameState, otherUsernameQuery } from "../../../store/users"
import { startGameState } from "../../../store/game"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ScreenInitial: React.FC<Props> = ({ socket }) => {
  const state = useStateDesigner(gameScreens)

  const username = useRecoilValue(usernameState)
  const otherUsername = useRecoilValue(otherUsernameQuery)

  const startGame = useSetRecoilState(startGameState)

  const handleStartGame = () => {
    state.forceTransition("waitingConnectionScreen")

    socket.current.emit("startGame", username)
    socket.current.emit("playGameAssignPlayers", {
      playerX: { username, letter: "X" },
      playerO: { username: otherUsername, letter: "O" },
    })

    startGame()
  }

  return (
    <Wrapper>
      <NoMarginContainer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <WinnerText>
          Welcome to <span style={{ color: "var(--secondaryColor)" }}>Tic</span>
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
      </NoMarginContainer>
    </Wrapper>
  )
}

export default ScreenInitial

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`
