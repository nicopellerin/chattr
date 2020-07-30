import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue } from "recoil"
import { FaYoutubeSquare } from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"

import { userSoundOnState } from "../../../store/users"
import { flipLayoutState, chatTextWindowScreens } from "../../../store/chat"

const YoutubeChatWindowBtn = () => {
  const state = useStateDesigner(chatTextWindowScreens)

  const soundOn = useRecoilValue(userSoundOnState)
  const flipLayout = useRecoilValue(flipLayoutState)

  const click = new Audio("/sounds/click_topple.mp3")
  click.volume = 0.3

  return (
    <PhotoGalleryButton
      flipLayout={flipLayout}
      whileHover={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", damping: 15 }}
      style={{
        color: state.isIn("youtubeVideoStartScreen")
          ? "var(--primaryColor)"
          : "var(--primaryColorDark)",
        cursor: state.isIn("youtubeVideoStartScreen") ? "initial" : "pointer",
      }}
      onClick={() => {
        state.forceTransition("youtubeVideoStartScreen")
        if (soundOn && state.isIn("youtubeVideoStartScreen")) {
          click.play()
        }
      }}
    >
      <FaYoutubeSquare />
    </PhotoGalleryButton>
  )
}

export default YoutubeChatWindowBtn

// Styles
const PhotoGalleryButton = styled(motion.button)`
  background: transparent;
  border: none;
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  border-radius: 50%;
  position: absolute;
  top: 12.5rem;
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
