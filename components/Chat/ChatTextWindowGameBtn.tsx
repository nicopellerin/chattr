import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue } from "recoil"
import { FaGamepad } from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"

import { userSoundOnState } from "../../store/users"

import { chatTextWindowScreens } from "./ChatTextWindow"

const ChatTextWindowGameBtn = () => {
  const state = useStateDesigner(chatTextWindowScreens)

  const soundOn = useRecoilValue(userSoundOnState)

  const playGameSound = new Audio("/sounds/play-game.mp3")
  playGameSound.volume = 0.2

  return (
    <PlayGameButton
      whileHover={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        color: state.isIn("gameScreen")
          ? "var(--primaryColor)"
          : "var(--primaryColorDark)",
        cursor: state.isIn("gameScreen") ? "initial" : "pointer",
      }}
      onClick={() => {
        state.forceTransition("gameScreen")
        if (soundOn && state.isIn("gameScreen")) {
          playGameSound.play()
        }
      }}
    >
      <FaGamepad />
    </PlayGameButton>
  )
}

export default ChatTextWindowGameBtn

// Styles
const PlayGameButton = styled(motion.button)`
  background: transparent;
  border: none;
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  border-radius: 50%;
  position: absolute;
  top: 7.5rem;
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
