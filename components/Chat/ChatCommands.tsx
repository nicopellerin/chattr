import * as React from "react"
import styled from "styled-components"
import { FaMicrophoneSlash, FaVideoSlash, FaTimesCircle } from "react-icons/fa"
import { motion } from "framer-motion"

const ChatCommands = () => {
  return (
    <Wrapper>
      <Container>
        <IconWrapper whileTap={{ y: 1 }} whileHover={{ y: -1 }}>
          <FaMicrophoneSlash
            size={30}
            style={{ marginBottom: 7, color: "#f8f8f8" }}
          />
          <span style={{ color: "#f8f8f8" }}>Mic off</span>
        </IconWrapper>
        <IconWrapper whileTap={{ y: 1 }} whileHover={{ y: -1 }}>
          <FaVideoSlash size={30} style={{ marginBottom: 7 }} /> Hide self
        </IconWrapper>
        <IconWrapper whileTap={{ y: 1 }} whileHover={{ y: -1 }}>
          <FaTimesCircle size={30} style={{ marginBottom: 7 }} />
          End call
        </IconWrapper>
      </Container>
    </Wrapper>
  )
}

export default ChatCommands

// Styles
const Wrapper = styled.div`
  background: #111;
  height: 100%;
  padding: 2rem;
  border: 1px solid #222;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 100%;
  background: rgba(255, 255, 255, 0.01);
`

const IconWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
`
