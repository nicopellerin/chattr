import * as React from "react"
import { useRef } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { FaPhoneAlt } from "react-icons/fa"
import { useRecoilValue, useRecoilState } from "recoil"
import { Circle } from "better-react-spinkit"

import {
  showSelfWebcamState,
  receivingCallState,
  callAcceptedState,
} from "../../store/video"
import { listUsersState } from "../../store/users"

interface Props {
  acceptCall: () => void
  selfVideoRef: React.MutableRefObject<HTMLVideoElement>
  friendVideoRef: React.MutableRefObject<HTMLVideoElement>
}

const ChatVideo: React.FC<Props> = ({
  acceptCall,
  selfVideoRef,
  friendVideoRef,
}) => {
  const showWebcam = useRecoilValue(showSelfWebcamState)
  const [receivingCall, setReceivingCall] = useRecoilState(receivingCallState)

  const callAccepted = useRecoilValue(callAcceptedState)
  const listUsers = useRecoilValue(listUsersState)

  const contraintsRef = useRef()

  return (
    <Wrapper ref={contraintsRef}>
      {Object.keys(listUsers).length < 2 && (
        <IncomingCallWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 80 }}
        >
          <IncomingCallContainer>
            <IncomingCallTitle style={{ margin: 0 }}>
              <Circle size={72} style={{ marginBottom: 30 }} color="#D0D9EB" />
              Waiting for friend to connect
            </IncomingCallTitle>
          </IncomingCallContainer>
        </IncomingCallWrapper>
      )}
      {receivingCall && !callAccepted && (
        <IncomingCallWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 80 }}
        >
          <IncomingCallContainer>
            <IncomingCallTitle>Incoming call...</IncomingCallTitle>
            <IncomingCallButton
              onClick={() => {
                setReceivingCall(false)
                acceptCall()
              }}
              whileTap={{ y: 1 }}
              whileHover={{ y: -1 }}
            >
              <FaPhoneAlt size={14} style={{ marginRight: 7 }} />
              Answer
            </IncomingCallButton>
          </IncomingCallContainer>
        </IncomingCallWrapper>
      )}
      <AnimatePresence>
        <SelfVideo
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          drag
          dragMomentum={false}
          dragConstraints={contraintsRef}
          ref={selfVideoRef}
          playsInline
          autoPlay
          style={{ opacity: showWebcam ? 1 : 0 }}
        />
      </AnimatePresence>
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
  background: #000;
  margin: 0;
  padding: 0;
  border-radius: 5px;
  /* border: 1px solid #222; */
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

const IncomingCallContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  /* background: rgba(255, 255, 255, 0.03); */
  border-radius: 5px;
  /* border: 1px solid #222; */
  z-index: 10;
  backdrop-filter: blur(10px);
`

const IncomingCallTitle = styled.h3`
  font-size: 2.4rem;
  margin-bottom: 3rem;
  color: #d0d9eb;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const IncomingCallButton = styled(motion.button)`
  padding: 1em 1.8em;
  border: none;
  background: #28d728;
  color: #e2ebfe;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`
