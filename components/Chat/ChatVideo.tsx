import * as React from "react"
import { useRef, useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue, useRecoilState } from "recoil"

import Slider from "./Slider"
import ChatScreenWaitingForConnect from "./ChatScreenWaitingForConnect"
import ChatScreenCalling from "./ChatScreenCalling"
import ChatScreenNoVideo from "./ChatScreenNoVideo"
import ChatScreenIncomingCall from "./ChatScreenIncomingCall"
import ChatScreenNotSupported from "./ChatScreenNotSupported"
import ChatScreenReceivingFile from "./ChatScreenReceivingFile"

import {
  showSelfWebcamState,
  receivingCallState,
  callAcceptedState,
  pressedCallState,
  getUserMediaNotSupportedState,
  displayTheatreModeState,
} from "../../store/video"
import { listUsersState, userSoundOnState } from "../../store/users"
import { receivingFileState } from "../../store/chat"
import { FaExpand } from "react-icons/fa"

interface Props {
  acceptCall: () => void
  selfVideoRef: React.MutableRefObject<HTMLVideoElement>
  friendVideoRef: React.MutableRefObject<HTMLVideoElement>
  acceptFile: () => void
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatVideo: React.FC<Props> = ({
  acceptCall,
  acceptFile,
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
  const receivingFile = useRecoilValue(receivingFileState)
  const soundOn = useRecoilValue(userSoundOnState)

  const [displayTheatreMode, setDisplayTheatreMode] = useRecoilState(
    displayTheatreModeState
  )

  const [showCatSlider, setShowCatSlider] = useState(false)

  const contraintsRef = useRef() as React.Ref<HTMLDivElement>

  let sound = new Audio("/sounds/expand.mp3")

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
        {!showCatSlider ? (
          <>
            {listUsers?.length < 2 && <ChatScreenWaitingForConnect />}

            {pressedCall && !callAccepted && <ChatScreenCalling />}

            {receivingFile && (
              <ChatScreenReceivingFile
                acceptFile={acceptFile}
                socket={socket}
              />
            )}

            {!receivingCall &&
              !receivingFile &&
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
          theatreMode={displayTheatreMode}
          showWebcam={showWebcam}
        />
        <FriendVideo
          theatreMode={displayTheatreMode}
          ref={friendVideoRef}
          playsInline
          autoPlay
        />
        <ExpandButton
          title="Theatre mode"
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.02 }}
          onClick={() => {
            if (soundOn) {
              sound.play()
              sound.volume = 0.3
            }
            setDisplayTheatreMode((prevState) => !prevState)
          }}
        >
          <FaExpand />
        </ExpandButton>
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
  z-index: 100;
`

const FriendVideo = styled.video`
  height: 100%;
  max-height: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "85vh" : "670px"};
  width: 100%;
  margin: 0;
  padding: 0;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);

  @media (max-width: 500px) {
    height: 300px;
  }
`

const SelfVideo = styled(motion.video)`
  height: 130px;
  width: 200px;
  object-fit: cover;
  position: absolute;
  bottom: 3vh;
  left: 3vh;
  z-index: 2;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  cursor: move;
  opacity: ${(props: { showWebcam: boolean }) => (props.showWebcam ? 1 : 0)};
  display: ${(props: { theatreMode: boolean; showWebcam: boolean }) =>
    props.theatreMode ? "none" : "block"};

  @media (max-width: 500px) {
    display: none;
  }
`

const ExpandButton = styled(motion.button)`
  background: transparent;
  outline: transparent;
  border: none;
  color: #ffe9ff;
  font-size: 2.4rem;
  cursor: pointer;
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
`
