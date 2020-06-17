import * as React from "react"
import { useRef } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { FaPhoneAlt, FaTimesCircle } from "react-icons/fa"
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
  setCancelCall,
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
              <Circle
                size={90}
                style={{ marginBottom: 40 }}
                color="var(--textColor)"
              />
              Waiting for friend to connect
            </IncomingCallTitle>
          </IncomingCallContainer>
        </IncomingCallWrapper>
      )}
      {!receivingCall && Object.keys(listUsers).length === 2 && (
        <IncomingCallWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 80 }}
        >
          <IncomingCallContainer>
            <CatTitle>{"No video connection"}</CatTitle>
            <CatsTagline>
              Press <span style={{ color: "var(--primaryColor)" }}>Call</span>{" "}
              to start video
            </CatsTagline>
            <CatSlideshowButton whileTap={{ y: 1 }} whileHover={{ y: -1 }}>
              Show me cats instead :3
            </CatSlideshowButton>
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
            <IncomingCallButtonWrapper>
              <IncomingCallAcceptButton
                onClick={() => {
                  setReceivingCall(false)
                  acceptCall()
                }}
                whileTap={{ y: 1 }}
                whileHover={{ y: -1 }}
              >
                <FaPhoneAlt size={14} style={{ marginRight: 7 }} />
                Answer
              </IncomingCallAcceptButton>
              <IncomingCallRejectButton
                onClick={() => {
                  setReceivingCall(false)
                  setCancelCall(true)
                }}
                whileTap={{ y: 1 }}
                whileHover={{ y: -1 }}
              >
                <FaTimesCircle size={14} style={{ marginRight: 7 }} />
                Reject
              </IncomingCallRejectButton>
            </IncomingCallButtonWrapper>
          </IncomingCallContainer>
        </IncomingCallWrapper>
      )}
      <AnimatePresence>
        <SelfVideo
          muted
          initial={{ scaleX: -1 }}
          exit={{ scaleX: 0 }}
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
  filter: drop-shadow(0 0 0.75rem rgba(204, 75, 194, 0.1));
`

const FriendVideo = styled.video`
  height: 100%;
  max-height: 670px;
  width: 100%;
  margin: 0;
  padding: 0;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`

const SelfVideo = styled(motion.video)`
  height: 130px;
  width: 200px;
  object-fit: cover;
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
  border-radius: 5px;
  z-index: 2;
`

const IncomingCallTitle = styled.h4`
  font-size: 3rem;
  margin-bottom: 3rem;
  color: var(--textColor);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const IncomingCallButtonWrapper = styled.div`
  display: flex;
`

const IncomingCallAcceptButton = styled(motion.button)`
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

const IncomingCallRejectButton = styled(IncomingCallAcceptButton)`
  margin-left: 1em;
  background: crimson;
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

const CatSlideshowButton = styled(IncomingCallAcceptButton)`
  background: var(--primaryColor);
  color: var(--textColor);
`
