import * as React from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useStateDesigner } from "@state-designer/react"

import Slider from "./Slider"

import { catSliderScreen } from "./ChatVideo"

const ChatScreenNotSupported: React.FC = () => {
  const catSliderScreenState = useStateDesigner(catSliderScreen)

  return (
    <Wrapper>
      <Container
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", damping: 80 }}
      >
        <Title>{"Streaming is not supported :("}</Title>
        <Tagline>
          Make sure you allowed video/audio or try using a different browser
        </Tagline>
        <SlideshowButton
          onClick={() => catSliderScreenState.send("SHOW")}
          whileTap={{ y: 1 }}
          whileHover={{ y: -1 }}
        >
          Show me cats instead :3
        </SlideshowButton>
      </Container>

      {catSliderScreenState.whenIn({
        visible: (
          <AnimatePresence>
            <Slider />
          </AnimatePresence>
        ),
      })}
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
  margin-bottom: 3rem;
`

const Tagline = styled.span`
  display: block;
  font-size: 2rem;
  max-width: 80ch;
  margin: 0 auto;
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
