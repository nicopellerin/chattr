import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from "recoil"
import { FaGamepad } from "react-icons/fa"

import { userSoundOnState } from "../../store/users"
import {
  playGameState,
  playGameShowInitialScreenState,
  resetGameState,
} from "../../store/game"
import { chatHomeState, showPhotoGalleryState } from "../../store/chat"

const ChatTextWindowGameBtn = () => {
  const soundOn = useRecoilValue(userSoundOnState)
  const playGame = useRecoilValue(playGameState)

  const showGameWindow = useRecoilCallback(({ set }) => {
    return () => {
      set(playGameState, true)
      set(chatHomeState, false)
      set(showPhotoGalleryState, false)
    }
  })

  const setPlayGameShowInitialScreen = useSetRecoilState(
    playGameShowInitialScreenState
  )
  const setResetGame = useSetRecoilState(resetGameState)

  const playGameSound = new Audio("/sounds/play-game.mp3")
  playGameSound.volume = 0.2

  return (
    <PlayGameButton
      whileHover={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        color: playGame ? "var(--primaryColor)" : "var(--primaryColorDark)",
        cursor: playGame ? "initial" : "pointer",
      }}
      onClick={() => {
        showGameWindow()
        setResetGame()
        setPlayGameShowInitialScreen(true)
        if (soundOn && !playGame) {
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
  top: 11.5rem;
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
