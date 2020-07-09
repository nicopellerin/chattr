import * as React from "react"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { motion } from "framer-motion"
import { useStateDesigner } from "@state-designer/react"

import { NoMarginContainer, WinnerText, RematchButton } from "./GameStyles"
import { gameScreens } from "./Game"

import {
  usernameState,
  otherUsernameQuery,
  listUsersState,
} from "../../../store/users"
import { startGameState, resetGameState } from "../../../store/game"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ScreenInitial: React.FC<Props> = ({ socket }) => {
  const state = useStateDesigner(gameScreens)

  const username = useRecoilValue(usernameState)
  const otherUsername = useRecoilValue(otherUsernameQuery)
  const listUsers = useRecoilValue(listUsersState)

  const startGame = useSetRecoilState(startGameState)
  const setResetGame = useSetRecoilState(resetGameState)

  const noConnection = listUsers?.length < 2

  const handleStartGame = () => {
    if (noConnection) return
    setResetGame()
    state.forceTransition("waitingConnectionScreen")
    socket.current.emit("startGame", username)
    socket.current.emit("playGameAssignPlayers", {
      playerX: { username, letter: "X" },
      playerO: { username: otherUsername, letter: "O" },
    })
    startGame()
  }

  return (
    <Wrapper
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <NoMarginContainer animate>
        <WinnerText>
          Welcome to <span style={{ color: "var(--secondaryColor)" }}>Tic</span>
          <span style={{ color: "var(--successColor)" }}>Tac</span>
          <span style={{ color: "var(--primaryColor)" }}>Toe</span>
        </WinnerText>
        <RematchButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartGame}
          style={{
            cursor: noConnection ? "initial" : "pointer",
            pointerEvents: noConnection ? "none" : "all",
          }}
        >
          {noConnection ? `Waiting for friend to connect` : `Start game`}
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
