import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaGamepad, FaYoutube } from "react-icons/fa"
import { useSetRecoilState } from "recoil"
import { useStateDesigner } from "@state-designer/react"

import Portal from "../Chat/Shared/Portal"

import { showPlayBarState } from "../../store/chat"

import { gameScreens } from "./TicTacToe/Game"
import { chatTextWindowScreens } from "../Chat/RightColumn/TextWindow"
import { shareVideoScreenState } from "../../store/video"

interface Props {
  msg: string
  setMsg: React.Dispatch<React.SetStateAction<string>>
  socket: React.MutableRefObject<SocketIOClient.Socket>
  type: string
  setFlipWebcam?: React.Dispatch<React.SetStateAction<boolean>>
}

const PlayBar: React.FC<Props> = ({
  msg = "An error has occured",
  setMsg,
  socket,
  type,
  setFlipWebcam,
}) => {
  const gameScreensState = useStateDesigner(gameScreens)
  const chatTextWindowScreensState = useStateDesigner(chatTextWindowScreens)

  const setShowPlayBar = useSetRecoilState(showPlayBarState)
  const setSharedVideoScreen = useSetRecoilState(shareVideoScreenState)

  const gameSound = new Audio("/play-game.mp3")
  gameSound.volume = 0.5

  return (
    <Wrapper
      initial={{ x: "-50%", y: -50 }}
      animate={{ y: 0 }}
      exit={
        type === "game"
          ? {
              scale: 0,
              opacity: 0,
            }
          : { opacity: 0 }
      }
      transition={{ type: "spring", damping: 12 }}
    >
      <Container>
        <Text>
          {type === "game" ? (
            <FaGamepad size={24} style={{ marginRight: 10 }} />
          ) : (
            <FaYoutube size={24} style={{ marginRight: 10 }} />
          )}{" "}
          {msg}
          <ButtonGroup>
            <ButtonAccept
              onClick={() => {
                switch (type) {
                  case "game":
                    setMsg("")
                    setShowPlayBar(false)
                    chatTextWindowScreensState.forceTransition("gameScreen")
                    gameScreensState.forceTransition("yourTurnScreen")
                    socket.current.emit("playGameOtherPlayerAccepted", true)
                    break
                  case "youtube":
                    setMsg("")
                    setShowPlayBar(false)
                    chatTextWindowScreensState.forceTransition(
                      "youtubeVideoStartScreen"
                    )
                    socket.current.emit("sendingYoutubeVideoAccepted", true)
                    break
                  case "screenShare":
                    setMsg("")
                    setShowPlayBar(false)
                    setSharedVideoScreen(true)
                    socket.current.emit("sharedScreenRequestAccepted", true)
                    if (setFlipWebcam) {
                      setFlipWebcam(true)
                    }
                }
              }}
            >
              Yup
            </ButtonAccept>
            <ButtonReject
              onClick={() => {
                switch (type) {
                  case "game":
                    setMsg("")
                    setShowPlayBar(false)
                    socket.current.emit("playGameOtherPlayerAccepted", false)
                    break
                  case "youtube":
                    setMsg("")
                    setShowPlayBar(false)
                    chatTextWindowScreensState.reset()
                    socket.current.emit("sendingYoutubeVideoAccepted", false)
                    break
                  case "screenShare":
                    setMsg("")
                    setShowPlayBar(false)
                    socket.current.emit("sharedScreenRequestAccepted", false)
                }
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

export default PlayBar

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
  white-space: nowrap;
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
