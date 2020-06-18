import * as React from "react"
import { useRef, useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue, useRecoilState } from "recoil"

import Slider from "./Slider"
import ChatScreenWaitingForConnect from "./ChatScreenWaitingForConnect"
import ChatScreenCalling from "./ChatScreenCalling"
import ChatScreenNoVideo from "./ChatScreenNoVideo"
import ChatScreenIncomingCall from "./ChatScreenIncomingCall"

import {
  showSelfWebcamState,
  receivingCallState,
  callAcceptedState,
  pressedCallState,
  cancelCallRequestState,
} from "../../store/video"
import { listUsersState } from "../../store/users"

interface Props {
  acceptCall: () => void
  selfVideoRef: React.MutableRefObject<HTMLVideoElement>
  friendVideoRef: React.MutableRefObject<HTMLVideoElement>
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatVideo: React.FC<Props> = ({
  acceptCall,
  selfVideoRef,
  friendVideoRef,
  socket,
}) => {
  const showWebcam = useRecoilValue(showSelfWebcamState)
  const callAccepted = useRecoilValue(callAcceptedState)
  const listUsers = useRecoilValue(listUsersState)
  const pressedCall = useRecoilValue(pressedCallState)
  const cancelCallRequest = useRecoilValue(cancelCallRequestState)

  const [receivingCall, setReceivingCall] = useRecoilState(receivingCallState)

  const [showCatSlider, setShowCatSlider] = useState(false)

  const contraintsRef = useRef() as React.Ref<HTMLDivElement>

  let beep = new Audio("/sounds/call.mp3")

  useEffect(() => {
    if (receivingCall) {
      // beep.loop = true
      beep.play()
    } else {
      beep.pause()
    }
  }, [receivingCall])

  return (
    <Wrapper ref={contraintsRef}>
      <>
        {!showCatSlider || receivingCall ? (
          <>
            {Object.keys(listUsers).length < 2 && (
              <ChatScreenWaitingForConnect />
            )}

            {pressedCall && !receivingCall && !callAccepted && (
              <ChatScreenCalling />
            )}

            {!receivingCall &&
              !callAccepted &&
              !pressedCall &&
              Object.keys(listUsers).length >= 2 && (
                <ChatScreenNoVideo setShowCatSlider={setShowCatSlider} />
              )}

            {receivingCall && (
              <ChatScreenIncomingCall
                setReceivingCall={setReceivingCall}
                acceptCall={acceptCall}
                socket={socket}
              />
            )}
          </>
        ) : (
          <AnimatePresence>
            <Slider setShowCatSlider={setShowCatSlider} />
          </AnimatePresence>
        )}
      </>
      <>
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
        {true && <FriendVideo ref={friendVideoRef} playsInline autoPlay />}
      </>
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
