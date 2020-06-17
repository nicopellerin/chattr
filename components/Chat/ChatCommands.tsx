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
} from "../../store/video"
import { selfIdState, listUsersState } from "../../store/users"

interface Props {
  callFriend: (key: string) => void
}

const ChatCommands: React.FC<Props> = ({ callFriend, setCancelCall }) => {
  const [showSelfWebcam, setShowSelfWebcam] = useRecoilState(
    showSelfWebcamState
  )
  const [muteMic, setMuteMic] = useRecoilState(muteMicState)
  const selfId = useRecoilValue(selfIdState)
  const listUsers = useRecoilValue(listUsersState)
  const [callAccepted, setCallAccepted] = useRecoilState(callAcceptedState)
  const receivingCall = useRecoilValue(receivingCallState)

  const otherUser = Object.keys(listUsers).filter((user) => user !== selfId)[0]

  // console.log(selfId)

  return (
    <Wrapper>
      <Container>
        <IconWrapper
          onClick={() => setMuteMic(!muteMic)}
          whileTap={{ scale: 0.98 }}
        >
          {muteMic ? (
            <>
              <FaMicrophoneSlash size={30} style={{ marginBottom: 7 }} />
              <span>Mic</span>
            </>
          ) : (
            <>
              <FaMicrophone
                size={30}
                style={{ marginBottom: 7, color: "#E2EBFE" }}
              />
              <span style={{ color: "#E2EBFE" }}>Mic</span>
            </>
          )}
        </IconWrapper>
        <IconWrapper
          onClick={() => setShowSelfWebcam(!showSelfWebcam)}
          whileTap={{ scale: 0.98 }}
        >
          {showSelfWebcam ? (
            <>
              <FaVideo
                size={30}
                style={{ marginBottom: 7, color: "#E2EBFE" }}
              />
              <span style={{ color: "#E2EBFE" }}>Webcam</span>
            </>
          ) : (
            <>
              <FaVideoSlash size={30} style={{ marginBottom: 7 }} />
              <span>Webcam</span>
            </>
          )}
        </IconWrapper>
        <IconWrapper
          whileTap={{ scale: 0.98 }}
          onClick={() => callFriend(otherUser)}
        >
          {callAccepted ? (
            <>
              <FaTimesCircle
                onClick={() => {
                  setCancelCall(true)
                  setCallAccepted(false)
                }}
                size={30}
                style={{ marginBottom: 7, color: "#E2EBFE" }}
              />
              <span style={{ color: "#E2EBFE" }}>End call</span>
            </>
          ) : (
            <>
              <FaPhone
                size={26}
                style={{
                  marginBottom: 7,
                  color: receivingCall ? "#aaa" : "#E2EBFE",
                }}
              />
              <span style={{ color: "#E2EBFE" }}>Call</span>
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
  background: #1e1e1e;
  height: 100%;
  padding: 2rem;
  border-radius: 5px;
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
