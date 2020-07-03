import * as React from "react"
import styled from "styled-components"
import Portal from "./Chat/Portal"
import { motion } from "framer-motion"
import { FaGamepad } from "react-icons/fa"
import { useRecoilCallback, useSetRecoilState } from "recoil"

import {
  playGameState,
  playGameShowInitialScreenState,
  showGamePlayBarState,
} from "../store/game"
import { chatHomeState, showPhotoGalleryState } from "../store/chat"

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
  const setShowGamePlayBar = useSetRecoilState(showGamePlayBarState)

  const showGameWindow = useRecoilCallback(({ set }) => {
    return () => {
      set(playGameState, true)
      set(chatHomeState, false)
      set(showPhotoGalleryState, false)
      set(playGameShowInitialScreenState, false)
    }
  })

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
                showGameWindow()
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
