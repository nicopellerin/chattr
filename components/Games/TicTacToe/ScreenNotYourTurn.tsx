import * as React from "react"
import {
  NotYourTurnWrapper,
  NoMarginContainer,
  WaitingText,
} from "./GameStyles"

interface Props {
  player: any
}

const ScreenNotYourTurn: React.FC<Props> = ({ player }) => {
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

export default ScreenNotYourTurn
