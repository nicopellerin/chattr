import * as React from "react"
import { useRef, useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue } from "recoil"

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
  getUserMediaNotSupportedState,
} from "../../store/video"
import { listUsersState } from "../../store/users"
import ChatScreenNotSupported from "./ChatScreenNotSupported"

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
  const receivingCall = useRecoilValue(receivingCallState)
  const getUserMediaNotSupported = useRecoilValue(getUserMediaNotSupportedState)

  const [showCatSlider, setShowCatSlider] = useState(false)

  const contraintsRef = useRef() as React.Ref<HTMLDivElement>

  if (getUserMediaNotSupported) {
    return (
      <Wrapper ref={contraintsRef}>
        <ChatScreenNotSupported />
      </Wrapper>
    )
  }

  return (
    <Wrapper ref={contraintsRef}>
      <>
        {!showCatSlider || receivingCall ? (
          <>
            {listUsers?.length < 2 && <ChatScreenWaitingForConnect />}

            {pressedCall && !callAccepted && <ChatScreenCalling />}

            {!receivingCall &&
              !callAccepted &&
              !pressedCall &&
              listUsers?.length >= 2 && (
                <ChatScreenNoVideo setShowCatSlider={setShowCatSlider} />
              )}

            {receivingCall && !callAccepted && (
              <ChatScreenIncomingCall acceptCall={acceptCall} socket={socket} />
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
          // @ts-ignore
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
  /* filter: drop-shadow(0 0 10rem rgba(131, 82, 253, 0.05)); */
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
