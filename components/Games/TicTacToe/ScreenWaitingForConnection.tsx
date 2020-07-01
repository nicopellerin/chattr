import * as React from "react"
import { ScreenWrapper, NoMarginContainer, WaitingText } from "./GameStyles"

const ScreenWaitingForConnection = () => {
  return (
    <ScreenWrapper>
      <NoMarginContainer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <WaitingText>Waiting for other player to connect...</WaitingText>
      </NoMarginContainer>
    </ScreenWrapper>
  )
}

export default ScreenWaitingForConnection
