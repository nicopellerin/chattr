import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import lottie from "lottie-web"

import heart from "./heart2.json"

const HeartScreen = () => {
  const lottieRef = useRef() as React.MutableRefObject<HTMLDivElement>

  let anim: any
  useEffect(() => {
    anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: heart,
    })

    return () => anim.destroy()
  }, [])

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
        <div style={{ width: 550 }} ref={lottieRef} />
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
