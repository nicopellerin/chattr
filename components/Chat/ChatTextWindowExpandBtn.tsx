import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue, useRecoilState } from "recoil"
import { FaChevronCircleUp } from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"

import { userSoundOnState } from "../../store/users"
import { expandChatWindowState } from "../../store/chat"
import { chatTextWindowScreens } from "./ChatTextWindow"

const ChatTextWindowExpandBtn = () => {
  const chatTextWindowScreensState = useStateDesigner(chatTextWindowScreens)

  const soundOn = useRecoilValue(userSoundOnState)

  const [expandChatWindow, setExpandChatWindow] = useRecoilState(
    expandChatWindowState
  )

  const expand = new Audio("/sounds/expand.mp3")
  expand.volume = 0.3

  return (
    <ExpandButton
      whileHover={{
        opacity:
          !chatTextWindowScreensState.isIn("chatScreen") &&
          !chatTextWindowScreensState.isIn("photoGalleryScreen")
            ? 0.6
            : 1,
        scale: 1,
      }}
      whileTap={{ scale: 0.95 }}
      animate={expandChatWindow ? { rotate: 180 } : { rotate: 0 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        cursor:
          !chatTextWindowScreensState.isIn("chatScreen") &&
          !chatTextWindowScreensState.isIn("photoGalleryScreen")
            ? "initial"
            : "pointer",
      }}
      onClick={() => {
        if (
          !chatTextWindowScreensState.isIn("chatScreen") &&
          !chatTextWindowScreensState.isIn("photoGalleryScreen")
        )
          return
        setExpandChatWindow((prevState) => !prevState)
        if (soundOn) {
          expand.play()
        }
      }}
    >
      <FaChevronCircleUp />
    </ExpandButton>
  )
}

export default ChatTextWindowExpandBtn

// Styles
const ExpandButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: var(--primaryColorDark);
  background: linear-gradient(45deg, #d852fd, #d852fd);
  border-radius: 50%;
  position: absolute;
  top: 0rem;
  z-index: 0;
  opacity: 0.6;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0rem;
  width: 3rem;
  height: 3rem;
  font-size: 3rem;
  outline: none;
  z-index: 2000;

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
