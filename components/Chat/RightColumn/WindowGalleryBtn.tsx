import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue } from "recoil"
import { FaPhotoVideo } from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"

import { userSoundOnState } from "../../../store/users"
import { flipLayoutState, chatTextWindowScreens } from "../../../store/chat"

const ChatTextWindowGalleryBtn = () => {
  const state = useStateDesigner(chatTextWindowScreens)

  const soundOn = useRecoilValue(userSoundOnState)
  const flipLayout = useRecoilValue(flipLayoutState)

  const photoGallerySound = new Audio("/sounds/click_marker_cap.mp3")
  photoGallerySound.volume = 0.3

  return (
    <PhotoGalleryButton
      flipLayout={flipLayout}
      whileHover={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        color: state.isIn("photoGalleryScreen")
          ? "var(--primaryColor)"
          : "var(--primaryColorDark)",
        cursor: state.isIn("photoGalleryScreen") ? "initial" : "pointer",
      }}
      onClick={() => {
        state.forceTransition("photoGalleryScreen")
        if (soundOn && state.isIn("photoGalleryScreen")) {
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
  top: 7.5rem;
  z-index: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -3rem;
  ${(props: { flipLayout: boolean }) => props.flipLayout && `left: -3rem`};
  width: 30px;
  height: 30px;
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
