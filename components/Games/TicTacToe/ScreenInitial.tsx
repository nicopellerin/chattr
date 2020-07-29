import * as React from "react"
import styled, { keyframes, css } from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { motion } from "framer-motion"
import { useStateDesigner } from "@state-designer/react"

import { NoMarginContainer, WinnerText } from "./GameStyles"
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
      <NoMarginContainer layout>
        <WinnerText>
          Welcome to <span style={{ color: "var(--secondaryColor)" }}>Tic</span>
          <span style={{ color: "var(--successColor)" }}>Tac</span>
          <span style={{ color: "var(--primaryColor)" }}>Toe</span>
        </WinnerText>
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartGame}
          noConnection={noConnection}
          style={{
            cursor: noConnection ? "initial" : "pointer",
            pointerEvents: noConnection ? "none" : "all",
            opacity: noConnection ? 0.5 : 1,
          }}
        >
          {noConnection ? `Waiting for friend to connect` : `Start game`}
        </Button>
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

const shimmer = keyframes`
    100% {
      transform: translateX(100%);
    }
`

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  border: none;
  border-radius: 5px;
  padding: 0.8em 1em;
  font-weight: 600;
  font-size: 1.7rem;
  color: var(--textColor);
  cursor: pointer;
  outline: transparent;
  overflow: hidden;
  position: relative;
  height: 48px;

  ${(props: { noConnection: boolean }) =>
    props.noConnection &&
    css`
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(-100%);
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.05) 20%,
          rgba(255, 255, 255, 0.2) 60%,
          rgba(255, 255, 255, 0)
        );
        animation: ${shimmer} 1.5s infinite;
        content: "";
      }
    `}
`
