import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaPhoneAlt, FaTimesCircle } from "react-icons/fa"
import { useSetRecoilState, useRecoilValue } from "recoil"

import {
  cancelCallRequestState,
  receivingCallState,
  callAcceptedState,
} from "../../store/video"
import { userSoundOnState } from "../../store/users"

interface Props {
  acceptCall: () => void
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatScreenNoVideo: React.FC<Props> = ({ acceptCall, socket }) => {
  const setCancelCallRequest = useSetRecoilState(cancelCallRequestState)

  const receivingCall = useRecoilValue(receivingCallState)
  const callAccepted = useRecoilValue(callAcceptedState)
  const soundOn = useRecoilValue(userSoundOnState)

  let beep = new Audio("/sounds/call.mp3")
  beep.volume = 0.3

  useEffect(() => {
    if (receivingCall && !callAccepted && soundOn) {
      beep.play()
    } else {
      beep.pause()
    }
  }, [receivingCall])

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <Title>Incoming call...</Title>
        <ButtonWrapper>
          <AcceptButton
            onClick={() => {
              acceptCall()
            }}
            whileTap={{ y: 1 }}
            whileHover={{ y: -1 }}
          >
            <FaPhoneAlt size={14} style={{ marginRight: 7 }} />
            Answer
          </AcceptButton>
          <RejectButton
            onClick={() => {
              setCancelCallRequest(true)
              socket.current.emit("cancelCallRequest")
            }}
            whileTap={{ y: 1 }}
            whileHover={{ y: -1 }}
          >
            <FaTimesCircle size={14} style={{ marginRight: 7 }} />
            Reject
          </RejectButton>
        </ButtonWrapper>
      </Container>
    </Wrapper>
  )
}

export default ChatScreenNoVideo

// Styles
const Wrapper = styled(motion.div)`
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

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
`

const Title = styled.h4`
  font-size: 4rem;
  /* color: var(--textColor); */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ButtonWrapper = styled.div`
  display: flex;
`

export const AcceptButton = styled(motion.button)`
  padding: 1em 1.5em;
  border: none;
  background: -webkit-linear-gradient(100deg, green, var(--successColor));
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

const RejectButton = styled(AcceptButton)`
  margin-left: 3rem;
  background: -webkit-linear-gradient(100deg, red, crimson);
`
