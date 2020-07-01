import * as React from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"

import {
  ScreenWrapper,
  NoMarginContainer,
  WinnerText,
  RematchButton,
} from "./GameStyles"

import { usernameState, otherUsernameQuery } from "../../../store/users"
import { startGameState } from "../../../store/game"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ScreenInitial: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const otherUsername = useRecoilValue(otherUsernameQuery)

  const startGame = useSetRecoilState(startGameState)

  const handleStartGame = () => {
    socket.current.emit("startGame", username)
    socket.current.emit("playGameAssignPlayers", {
      playerX: { username, letter: "X" },
      playerO: { username: otherUsername, letter: "O" },
    })

    startGame()
  }

  return (
    <ScreenWrapper>
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
    </ScreenWrapper>
  )
}

export default ScreenInitial
