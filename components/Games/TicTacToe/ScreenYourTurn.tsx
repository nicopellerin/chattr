import * as React from "react"
import { useRecoilValue } from "recoil"

import {
  NotYourTurnWrapper,
  NoMarginContainer,
  WaitingText,
} from "./GameStyles"

import { usernameState } from "../../../store/users"

interface Props {
  player: any
}

const ScreenYourTurn: React.FC<Props> = ({ player }) => {
  const username = useRecoilValue(usernameState)

  if (username === player.username) {
    return null
  }

  return (
    <NotYourTurnWrapper>
      <NoMarginContainer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <WaitingText>
          {player?.username}'s turn (
          <span style={{ color: "var(--secondaryColor)" }}>
            {player?.letter}
          </span>
          )
        </WaitingText>
      </NoMarginContainer>
    </NotYourTurnWrapper>
  )
}

export default ScreenYourTurn
