import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

interface Props {
  setShowCatSlider: () => void
}

const ChatScreenNoVideo: React.FC<Props> = ({ setShowCatSlider }) => {
  return (
    <IncomingCallWrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <IncomingCallContainer>
        <CatTitle>{"No video connection"}</CatTitle>
        <CatsTagline>
          Press <span style={{ color: "var(--primaryColor)" }}>Call</span> to
          start video/audio call
        </CatsTagline>
        <CatSlideshowButton
          onClick={() => setShowCatSlider(true)}
          whileTap={{ y: 1 }}
          whileHover={{ y: -1 }}
        >
          Show me cats instead :3
        </CatSlideshowButton>
      </IncomingCallContainer>
    </IncomingCallWrapper>
  )
}

export default ChatScreenNoVideo

// Styles
const IncomingCallWrapper = styled(motion.div)`
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

const IncomingCallContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
`

const CatTitle = styled.h2`
  font-size: 5rem;
  margin-bottom: 4rem;
  color: var(--tertiaryColor);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CatsTagline = styled.h4`
  font-size: 2rem;
  color: var(--textColor);
  margin-bottom: 5rem;
`

export const IncomingCallAcceptButton = styled(motion.button)`
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

const CatSlideshowButton = styled(IncomingCallAcceptButton)`
  background: var(--primaryColor);
  color: var(--textColor);
`
