import * as React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { AnimatePresence, motion } from "framer-motion"

import TicTacToe from "../Games/TicTacToe"
import ChatTextWindowGalleryBtn from "./ChatTextWindowGalleryBtn"
import ChatTextWindowGameBtn from "./ChatTextWindowGameBtn"
import ChatTextWindowExpandBtn from "./ChatTextWindowExpandBtn"
import ChatTextWindowGallery from "./ChatTextWindowGallery"
import ChatTextWindowMain from "./ChatTextWindowMain"
import ChatTextWindowChatBtn from "./ChatTextWindowChatBtn"

import { showPhotoGalleryState, chatHomeState } from "../../store/chat"
import {
  listUsersState,
  otherUsernameQuery,
  userSoundOnState,
} from "../../store/users"
import { playGameState } from "../../store/game"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextWindow: React.FC<Props> = ({ socket }) => {
  const listUsers = useRecoilValue(listUsersState)
  const showPhotoGallery = useRecoilValue(showPhotoGalleryState)
  const playGame = useRecoilValue(playGameState)
  const otherUsername = useRecoilValue(otherUsernameQuery)
  const soundOn = useRecoilValue(userSoundOnState)
  const chatHome = useRecoilValue(chatHomeState)

  const hasConnection = listUsers?.length > 1

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
      {hasConnection && <ChatTextWindowChatBtn />}
      {hasConnection && <ChatTextWindowGameBtn />}
      {hasConnection && <ChatTextWindowGalleryBtn />}
      <AnimatePresence initial={false}>
        {chatHome && (
          <motion.div initial={{ x: 30 }} animate={{ x: 0 }} exit={{ x: -300 }}>
            <ChatTextWindowMain showJoinMsg={showJoinMsg} socket={socket} />
          </motion.div>
        )}
        {playGame && (
          <motion.div initial={{ x: 30 }} animate={{ x: 0 }} exit={{ x: -30 }}>
            <TicTacToe socket={socket} />
          </motion.div>
        )}
        {showPhotoGallery && (
          <motion.div initial={{ x: 30 }} animate={{ x: 0 }} exit={{ x: -30 }}>
            <ChatTextWindowGallery />
          </motion.div>
        )}
      </AnimatePresence>
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
