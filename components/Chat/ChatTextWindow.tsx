import * as React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
// import { AnimatePresence } from "framer-motion"
import { createState } from "@state-designer/core"
import { useStateDesigner } from "@state-designer/react"

import TicTacToe from "../Games/TicTacToe"
import ChatTextWindowGalleryBtn from "./ChatTextWindowGalleryBtn"
import ChatTextWindowGameBtn from "./ChatTextWindowGameBtn"
import ChatTextWindowExpandBtn from "./ChatTextWindowExpandBtn"
import ChatTextWindowGallery from "./ChatTextWindowGallery"
import ChatTextWindowMain from "./ChatTextWindowMain"
import ChatTextWindowChatBtn from "./ChatTextWindowChatBtn"

import { otherUsernameQuery, userSoundOnState } from "../../store/users"
import YoutubeChatWindow from "./YoutubeChatWindow"
import YoutubeChatWindowBtn from "./YoutubeChatWindowBtn"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

export const chatTextWindowScreens = createState({
  id: "chatTextWindowScreens",
  initial: "chatScreen",
  states: {
    chatScreen: {},
    gameScreen: {},
    photoGalleryScreen: {},
    youtubeVideoStartScreen: {},
  },
})

const ChatTextWindow: React.FC<Props> = ({ socket }) => {
  const state = useStateDesigner(chatTextWindowScreens)

  const otherUsername = useRecoilValue(otherUsernameQuery)
  const soundOn = useRecoilValue(userSoundOnState)

  const [showJoinMsg, setShowJoinMsg] = useState(false)

  const joined = new Audio("/sounds/joined.mp3")
  joined.volume = 0.3

  // Plays sound when other user connects
  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (otherUsername) {
      setShowJoinMsg(true)
      if (soundOn) {
        joined.play()
      }
      idx = setTimeout(() => {
        setShowJoinMsg(false)
      }, 4000)
    }

    return () => clearTimeout(idx)
  }, [otherUsername])

  return (
    <Wrapper>
      <ChatTextWindowExpandBtn />
      <ChatTextWindowChatBtn />
      <ChatTextWindowGameBtn />
      <ChatTextWindowGalleryBtn />
      <YoutubeChatWindowBtn />
      {/* <AnimatePresence initial={false}> */}
      {state.whenIn({
        chatScreen: (
          <ChatTextWindowMain showJoinMsg={showJoinMsg} socket={socket} />
        ),
        gameScreen: <TicTacToe socket={socket} />,
        photoGalleryScreen: <ChatTextWindowGallery />,
        youtubeVideoStartScreen: <YoutubeChatWindow socket={socket} />,
      })}
      {/* </AnimatePresence> */}
    </Wrapper>
  )
}

export default ChatTextWindow

// Styles
const Wrapper = styled.div`
  background: #1a0d2b;
  height: 100%;
  padding: 1.7rem;
  border-radius: 5px;
  position: relative;
`
