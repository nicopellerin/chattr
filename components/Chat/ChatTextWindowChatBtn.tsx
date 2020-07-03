import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue, useRecoilCallback } from "recoil"
import { FaComment } from "react-icons/fa"

import { userSoundOnState, usernameState } from "../../store/users"
import {
  chatHomeState,
  showPhotoGalleryState,
  chatWindowState,
} from "../../store/chat"
import { playGameState } from "../../store/game"

const ChatTextWindowChatBtn = () => {
  const soundOn = useRecoilValue(userSoundOnState)
  const msgs = useRecoilValue(chatWindowState)
  const chatHome = useRecoilValue(chatHomeState)
  const username = useRecoilValue(usernameState)

  const showChatHome = useRecoilCallback(({ set }) => {
    return () => {
      set(playGameState, false)
      set(showPhotoGalleryState, false)
      set(chatHomeState, true)
    }
  })

  const [newMsgsAlert, setNewMsgsAlert] = useState(false)

  const expand = new Audio("/sounds/expand.mp3")
  expand.volume = 0.3

  const msgsRef = useRef(msgs)

  useEffect(() => {
    msgsRef.current = msgs
  }, [])

  const prevLength = msgsRef.current.length

  useEffect(() => {
    if (
      msgs.length > prevLength &&
      msgs[msgs.length - 1].username !== username &&
      !chatHome
    ) {
      setNewMsgsAlert(true)
      msgsRef.current = msgs
    }
  }, [msgs])

  return (
    <ExpandButton
      whileHover={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        color: chatHome ? "var(--primaryColor)" : "var(--primaryColorDark)",
        cursor: chatHome ? "initial" : "pointer",
      }}
      onClick={() => {
        showChatHome()
        setNewMsgsAlert(false)
        if (soundOn && !chatHome) {
          expand.play()
        }
      }}
    >
      <FaComment />
      {newMsgsAlert && <DotAlert />}
    </ExpandButton>
  )
}

export default ChatTextWindowChatBtn

// Styles
const ExpandButton = styled(motion.button)`
  background: transparent;
  border: none;
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  border-radius: 50%;
  position: absolute;
  top: 6.5rem;
  z-index: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -3rem;
  width: 3rem;
  height: 3rem;
  font-size: 3rem;
  outline: none;

  &::after {
    content: "";
    display: block;
    background: #1a0d2b;
    width: 3.4rem;
    height: 4rem;
    position: absolute;
    z-index: -1;
    border-radius: 5px;
  }
`

const DotAlert = styled.div`
  position: absolute;
  top: 0rem;
  right: 0rem;
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
`
