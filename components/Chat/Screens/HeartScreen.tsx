import * as React from "react"
import styled from "styled-components"
import Lottie from "react-lottie"
import { motion } from "framer-motion"

import heart1 from "./heart1.json"

const animOptions = {
  loop: true,
  autoplay: true,
  animationData: heart1,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

const HeartScreen = () => {
  return (
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <Lottie options={animOptions} height={550} width={550} />
      </motion.div>
    </Wrapper>
  )
}

export default HeartScreen

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(
    circle at center,
    rgba(235, 87, 87, 0.7) 0,
    rgba(235, 87, 87, 0.5) 50%,
    rgba(235, 87, 87, 0.05) 100%
  );
`
