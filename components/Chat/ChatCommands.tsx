import * as React from "react"
import styled from "styled-components"
import {
  FaMicrophoneSlash,
  FaMicrophone,
  FaVideoSlash,
  FaTimesCircle,
  FaVideo,
  FaPhone,
} from "react-icons/fa"
import { motion } from "framer-motion"
import { useRecoilState, useRecoilValue } from "recoil"

import {
  showSelfWebcamState,
  callAcceptedState,
  muteMicState,
  receivingCallState,
  pressedCallState,
} from "../../store/video"
import { selfIdState, listUsersState } from "../../store/users"

interface Props {
  callFriend: (key: string) => void
}

const ChatCommands: React.FC<Props> = ({ callFriend, setCancelCall }) => {
  const [showSelfWebcam, setShowSelfWebcam] = useRecoilState(
    showSelfWebcamState
  )
  const selfId = useRecoilValue(selfIdState)
  const listUsers = useRecoilValue(listUsersState)
  const receivingCall = useRecoilValue(receivingCallState)

  const [callAccepted, setCallAccepted] = useRecoilState(callAcceptedState)
  const [muteMic, setMuteMic] = useRecoilState(muteMicState)
  const [pressedCall, setPressedCall] = useRecoilState(pressedCallState)

  const otherUser = Object.keys(listUsers).filter((user) => user !== selfId)[0]

  const beepOn = new Audio("/sounds/click_snip.mp3")

  return (
    <Wrapper>
      <Container>
        <IconWrapper
          onClick={() => {
            setMuteMic(!muteMic)
            beepOn.play()
          }}
          whileTap={{ scale: 0.98 }}
        >
          {muteMic ? (
            <>
              <FaMicrophoneSlash size={22} style={{ marginBottom: 7 }} />
              <span>Mic</span>
            </>
          ) : (
            <>
              <FaMicrophone
                size={22}
                style={{ marginBottom: 7, color: "#FFE9FF" }}
              />
              <span style={{ color: "#FFE9FF" }}>Mic</span>
            </>
          )}
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            setShowSelfWebcam(!showSelfWebcam)
            beepOn.play()
          }}
          whileTap={{ scale: 0.98 }}
        >
          {showSelfWebcam ? (
            <>
              <FaVideo
                size={22}
                style={{ marginBottom: 7, color: "#FFE9FF" }}
              />
              <span style={{ color: "#FFE9FF" }}>Webcam</span>
            </>
          ) : (
            <>
              <FaVideoSlash size={22} style={{ marginBottom: 7 }} />
              <span>Webcam</span>
            </>
          )}
        </IconWrapper>
        <IconWrapper
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            callFriend(otherUser)
            setPressedCall(true)
            beepOn.play()
          }}
        >
          {callAccepted ? (
            <>
              <FaTimesCircle
                onClick={() => {
                  setCancelCall(true)
                  setCallAccepted(false)
                }}
                size={22}
                style={{ marginBottom: 7, color: "#FFE9FF" }}
              />
              <span style={{ color: "#FFE9FF" }}>End call</span>
            </>
          ) : (
            <>
              <FaPhone
                size={22}
                style={{
                  marginBottom: 7,
                  color: receivingCall ? "#aaa" : "#FFE9FF",
                }}
              />
              <span style={{ color: "#FFE9FF" }}>Call</span>
            </>
          )}
        </IconWrapper>
      </Container>
    </Wrapper>
  )
}

export default ChatCommands

// Styles
const Wrapper = styled.div`
  background: #1a0d2b;
  height: 100%;
  padding: 1.7rem;
  border-radius: 5px;
  filter: drop-shadow(0 0 0.75rem rgba(204, 75, 194, 0.1));
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 100%;
  background: rgba(255, 255, 255, 0.01);
  padding: 1rem;
  boxshadow: "4px 0 15px rgba(0, 0, 0, 0.1)";
`

const IconWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
`
