import * as React from "react"
import styled from "styled-components"
import Portal from "../Chat/Portal"
import { motion } from "framer-motion"
import { FaGamepad } from "react-icons/fa"
import { useSetRecoilState } from "recoil"
import { useStateDesigner } from "@state-designer/react"

import { showGamePlayBarState } from "../../store/game"

import { gameScreens } from "./TicTacToe/Game"
import { chatTextWindowScreens } from "../Chat/ChatTextWindow"

interface Props {
  msg: string
  setMsg: React.Dispatch<React.SetStateAction<string>>
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const GamePlayBar: React.FC<Props> = ({
  msg = "An error has occured",
  setMsg,
  socket,
}) => {
  const gameScreensState = useStateDesigner(gameScreens)
  const chatTextWindowScreensState = useStateDesigner(chatTextWindowScreens)

  const setShowGamePlayBar = useSetRecoilState(showGamePlayBarState)

  const gameSound = new Audio("/play-game.mp3")
  gameSound.volume = 0.5

  return (
    <Wrapper
      initial={{ x: "-50%", y: -50 }}
      animate={{ y: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 12 }}
    >
      <Container>
        <Text>
          <FaGamepad style={{ marginRight: 7 }} /> {msg}
          <ButtonGroup>
            <ButtonAccept
              onClick={() => {
                setMsg("")
                setShowGamePlayBar(false)
                chatTextWindowScreensState.forceTransition("gameScreen")
                gameScreensState.forceTransition("yourTurnScreen")
                socket.current.emit("playGameOtherPlayerAccepted", true)
              }}
            >
              Play
            </ButtonAccept>
            <ButtonReject
              onClick={() => {
                setMsg("")
                setShowGamePlayBar(false)
                socket.current.emit("playGameOtherPlayerAccepted", false)
              }}
            >
              Nope
            </ButtonReject>
          </ButtonGroup>
        </Text>
      </Container>
      <Portal />
    </Wrapper>
  )
}

export default GamePlayBar

// Styles
const Wrapper = styled(motion.div)`
  position: fixed;
  top: 4rem;
  left: 50%;
  z-index: 2000;
`

const Container = styled(motion.div)`
  background: var(--primaryColorDark);
  padding: 1.2rem 1.5rem;
  border-radius: 5px;
  color: var(--textColor);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`

const Text = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
`

const ButtonAccept = styled(motion.button)`
  margin-right: 1.2rem;
  margin-left: 2rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background: linear-gradient(45deg, crimson, #d852fd);
  padding: 0.5rem 1rem;
  font-size: 1.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  outline: transparent;
`

const ButtonReject = styled(motion.button)`
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  padding: 0.5rem 1rem;
  font-size: 1.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  outline: transparent;
`
