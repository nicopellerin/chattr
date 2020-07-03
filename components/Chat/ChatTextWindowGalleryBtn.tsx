import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue, useRecoilCallback } from "recoil"
import { FaPhotoVideo } from "react-icons/fa"

import { userSoundOnState } from "../../store/users"
import { showPhotoGalleryState, chatHomeState } from "../../store/chat"
import { playGameState } from "../../store/game"

const ChatTextWindowGalleryBtn = () => {
  const soundOn = useRecoilValue(userSoundOnState)
  const showPhotoGallery = useRecoilValue(showPhotoGalleryState)

  const showPhotoGalleryWindow = useRecoilCallback(({ set }) => {
    return () => {
      set(playGameState, false)
      set(chatHomeState, false)
      set(showPhotoGalleryState, true)
    }
  })

  const photoGallerySound = new Audio("/sounds/click_marker_cap.mp3")
  photoGallerySound.volume = 0.5

  return (
    <PhotoGalleryButton
      whileHover={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        color: showPhotoGallery
          ? "var(--primaryColor)"
          : "var(--primaryColorDark)",
        cursor: showPhotoGallery ? "initial" : "pointer",
      }}
      onClick={() => {
        showPhotoGalleryWindow()
        if (soundOn && !showPhotoGallery) {
          photoGallerySound.play()
        }
      }}
    >
      <FaPhotoVideo />
    </PhotoGalleryButton>
  )
}

export default ChatTextWindowGalleryBtn

// Styles
const PhotoGalleryButton = styled(motion.button)`
  background: transparent;
  border: none;
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  border-radius: 50%;
  position: absolute;
  top: 16.5rem;
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
