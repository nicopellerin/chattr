import * as React from "react"
import styled, { keyframes } from "styled-components"
import { motion } from "framer-motion"
import { useSetRecoilState } from "recoil"
import { useStateDesigner } from "@state-designer/react"

import { ScreenWrapper, NoMarginContainer } from "./GameStyles"
import { showPlayBarState } from "../../../store/chat"
import { gameScreens } from "./Game"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ScreenWaitingForConnection: React.FC<Props> = ({ socket }) => {
  const state = useStateDesigner(gameScreens)

  const setShowPlayBar = useSetRecoilState(showPlayBarState)

  return (
    <ScreenWrapper>
      <NoMarginContainer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <WaitingText>Waiting for other player to connect...</WaitingText>
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            state.forceTransition("initialScreen")
            setShowPlayBar(false)
            socket.current.emit("playGameOtherPlayerAccepted", false)
          }}
        >
          Cancel
        </Button>
      </NoMarginContainer>
    </ScreenWrapper>
  )
}

export default ScreenWaitingForConnection

// Styles
const WaitingText = styled.h5`
  color: var(--tertiaryColor);
  font-size: 3rem;
  text-align: center;
  line-height: 1.3;
  margin: 0 auto;
  max-width: 80%;
  margin-bottom: 3rem;
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
  height: 48px;

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
`
