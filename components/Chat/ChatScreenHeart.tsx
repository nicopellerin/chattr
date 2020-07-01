import * as React from "react"
import styled from "styled-components"
import Lottie from "react-lottie"
import { motion } from "framer-motion"

import heartAnim from "./heart.json"

const animOptions = {
  loop: true,
  autoplay: true,
  animationData: heartAnim,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

const ChatScreenHeart = () => {
  return (
    <Wrapper initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
      <Lottie options={animOptions} height={550} width={550} />
    </Wrapper>
  )
}

export default ChatScreenHeart

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    45deg,
    rgba(235, 87, 87, 0.2),
    rgba(235, 87, 87, 0.4)
  );
`
