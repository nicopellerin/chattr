import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { useStateDesigner } from "@state-designer/react"
import { AnimatePresence, motion } from "framer-motion"

import TicTacToe from "../../Games/TicTacToe"
import ChatTextWindowGalleryBtn from "./WindowGalleryBtn"
import ChatTextWindowGameBtn from "./WindowGameBtn"
import ChatTextWindowGallery from "./WindowGallery"
import ChatTextWindowMain from "./TextWindowMain"
import ChatTextWindowChatBtn from "./TextWindowChatBtn"
import YoutubeChatWindow from "./YoutubeChatWindow"
import YoutubeChatWindowBtn from "./YoutubeChatWindowBtn"

import { userSoundOnState, userJoinedChattrState } from "../../../store/users"
import { chatTextWindowScreens } from "../../../store/chat"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextWindow: React.FC<Props> = ({ socket }) => {
  const chatTextWindowScreensState = useStateDesigner(chatTextWindowScreens)

  const soundOn = useRecoilValue(userSoundOnState)
  const userJoinedChattr = useRecoilValue(userJoinedChattrState)

  const joined = new Audio("/sounds/joined.mp3")
  joined.volume = 0.3

  // Plays sound when other user connects
  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (userJoinedChattr) {
      if (soundOn) {
        joined.play()
      }
    }

    return () => clearTimeout(idx)
  }, [userJoinedChattr])

  useEffect(() => {
    socket?.current?.on("userLeftChattr", () => {
      chatTextWindowScreensState.reset()
    })
  }, [socket?.current])

  return (
    <Wrapper layout="position">
      <ChatTextWindowChatBtn />
      <ChatTextWindowGameBtn />
      <ChatTextWindowGalleryBtn />
      <YoutubeChatWindowBtn />
      <AnimatePresence>
        {chatTextWindowScreensState.whenIn({
          chatScreen: (
            <ChatTextWindowMain
              showJoinMsg={userJoinedChattr}
              socket={socket}
            />
          ),
          gameScreen: <TicTacToe socket={socket} />,
          photoGalleryScreen: <ChatTextWindowGallery />,
          youtubeVideoStartScreen: <YoutubeChatWindow socket={socket} />,
        })}
      </AnimatePresence>
    </Wrapper>
  )
}

export default ChatTextWindow

// Styles
const Wrapper = styled(motion.div)`
  background: #1a0d2b;
  height: 100%;
  padding: 1.7rem;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 0.7rem 5rem rgba(131, 82, 253, 0.1);
`
