import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import Slider from "./Slider"

const ChatScreenNotSupported: React.FC = () => {
  const [showCatSlider, setShowCatSlider] = useState(false)

  return (
    <Wrapper>
      {!showCatSlider ? (
        <Container
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 80 }}
        >
          <Title>{"Streaming is not supported :("}</Title>
          <SlideshowButton
            onClick={() => setShowCatSlider(true)}
            whileTap={{ y: 1 }}
            whileHover={{ y: -1 }}
          >
            Show me cats instead :3
          </SlideshowButton>
        </Container>
      ) : (
        <AnimatePresence>
          <Slider setShowCatSlider={setShowCatSlider} />
        </AnimatePresence>
      )}
    </Wrapper>
  )
}

export default ChatScreenNotSupported

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
`

const Title = styled.h4`
  font-size: 4rem;
  color: var(--tertiaryColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
`

const Button = styled(motion.button)`
  padding: 1em 1.5em;
  border: none;
  background: #28d728;
  color: #ffe9ff;
  font-size: 1.7rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`

const SlideshowButton = styled(Button)`
  background: var(--primaryColor);
  color: var(--textColor);
`
