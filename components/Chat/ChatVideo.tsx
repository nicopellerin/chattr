import * as React from "react"
import { useRef } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaPhoneAlt } from "react-icons/fa"

const ChatVideo = ({ acceptCall, selfVideoRef, friendVideoRef }) => {
  const contraintsRef = useRef()

  return (
    <Wrapper ref={contraintsRef}>
      <IncomingCallWrapper
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", damping: 80 }}
      >
        <IncomingCallContainer>
          <IncomingCallTitle>Incoming call...</IncomingCallTitle>
          <IncomingCallButton whileTap={{ y: 1 }} whileHover={{ y: -1 }}>
            <FaPhoneAlt size={14} style={{ marginRight: 7 }} />
            Answer
          </IncomingCallButton>
        </IncomingCallContainer>
      </IncomingCallWrapper>
      <SelfVideo
        drag
        dragMomentum={false}
        dragConstraints={contraintsRef}
        ref={selfVideoRef}
        playsInline
        autoPlay
      />
      {true && <FriendVideo ref={friendVideoRef} playsInline autoPlay />}
    </Wrapper>
  )
}

export default ChatVideo

// Styles
const Wrapper = styled(motion.div)`
  height: 100%;
  width: 100%;
  position: relative;
  background: #0a0a0a;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  border: 1px solid #222;
`

const FriendVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
  margin: 0;
  padding: 0;
`

const SelfVideo = styled(motion.video)`
  height: 175px;
  position: absolute;
  bottom: 3rem;
  right: 3rem;
  z-index: 2;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  cursor: move;
`

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

const IncomingCallContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  border: 1px solid #222;
  z-index: 10;
`

const IncomingCallTitle = styled.h3`
  font-size: 3.6rem;
  margin-bottom: 3rem;
  color: #f8f8f8;
`

const IncomingCallButton = styled(motion.button)`
  padding: 1em 1.8em;
  border: none;
  background: #28d728;
  color: #f8f8f8;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`
