import * as React from "react"
import { useRef } from "react"
import styled, { css } from "styled-components"
import {
  FaMicrophoneSlash,
  FaMicrophone,
  FaVideoSlash,
  FaTimesCircle,
  FaVideo,
  FaPhone,
  FaRocket,
} from "react-icons/fa"
import { motion } from "framer-motion"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

import {
  showSelfWebcamState,
  callAcceptedState,
  muteMicState,
  receivingCallState,
  pressedCallState,
  cancelCallRequestState,
  disableCallIconState,
} from "../../store/video"
import {
  selfIdState,
  listUsersState,
  userSoundOnState,
} from "../../store/users"
import { fileTransferProgressState, sendingFileState } from "../../store/chat"

interface Props {
  callFriend: (id: string) => void
  sendFile: (id: string, file: any) => void
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

interface StyledProps {
  off?: boolean
  disabled?: boolean
}

const ChatCommands: React.FC<Props> = ({ callFriend, socket, sendFile }) => {
  const [showSelfWebcam, setShowSelfWebcam] = useRecoilState(
    showSelfWebcamState
  )
  const [muteMic, setMuteMic] = useRecoilState(muteMicState)
  const [pressedCall, setPressedCall] = useRecoilState(pressedCallState)

  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setCancelCallRequest = useSetRecoilState(cancelCallRequestState)
  const [sendingFile, setSendingFile] = useRecoilState(sendingFileState)

  const callAccepted = useRecoilValue(callAcceptedState)
  const selfId = useRecoilValue(selfIdState)
  const listUsers = useRecoilValue(listUsersState)
  const disableCallIcon = useRecoilValue(disableCallIconState)
  const soundOn = useRecoilValue(userSoundOnState)
  const fileTransferProgress = useRecoilValue(fileTransferProgressState)

  const fileInputRef = useRef() as React.RefObject<HTMLInputElement>

  const otherUser = listUsers?.filter((user) => user !== selfId).join("")

  const beepOn = new Audio("/sounds/click_snip.mp3")

  const handleSendFile = (e: any) => {
    setSendingFile(true)

    const file = e.target.files[0]

    if (file && file.size > 5 * 1000000) {
      alert("File too big. Max size is 5 mb")
      e.target.value = ""
      return
    }

    sendFile(otherUser, file)
  }

  console.log(sendingFile)

  return (
    <Wrapper>
      <Container>
        <IconWrapper
          onClick={() => {
            fileInputRef.current && fileInputRef.current.click()
            if (soundOn) {
              beepOn.play()
            }
          }}
          off={listUsers?.length < 2}
          whileTap={{ scale: 0.98 }}
        >
          <input
            hidden
            name="file"
            id="file"
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleSendFile(e)}
          />
          {!sendingFile ? (
            <>
              <FaRocket size={22} style={{ marginBottom: 7 }} />
              <span>
                {fileTransferProgress === "0"
                  ? `Send file`
                  : `${fileTransferProgress}%`}
              </span>
            </>
          ) : (
            <>
              <FaRocket size={22} style={{ marginBottom: 7 }} />
              <span>{`${fileTransferProgress}%`}</span>
            </>
          )}
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            setMuteMic(!muteMic)
            if (soundOn) {
              beepOn.play()
            }
          }}
          off={muteMic}
          whileTap={{ scale: 0.98 }}
        >
          {muteMic ? (
            <>
              <FaMicrophoneSlash size={22} style={{ marginBottom: 7 }} />
              <span>Mic</span>
            </>
          ) : (
            <>
              <FaMicrophone size={22} style={{ marginBottom: 7 }} />
              <span>Mic</span>
            </>
          )}
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            setShowSelfWebcam(!showSelfWebcam)
            if (soundOn) {
              beepOn.play()
            }
          }}
          whileTap={{ scale: 0.98 }}
          off={!showSelfWebcam}
        >
          {showSelfWebcam ? (
            <>
              <FaVideo
                size={22}
                style={{
                  marginBottom: 7,
                }}
              />
              <span>Webcam</span>
            </>
          ) : (
            <>
              <FaVideoSlash size={22} style={{ marginBottom: 7 }} />
              <span>Webcam</span>
            </>
          )}
        </IconWrapper>
        <IconWrapper disabled={disableCallIcon} whileTap={{ scale: 0.98 }}>
          {callAccepted || pressedCall ? (
            <>
              <FaTimesCircle
                onClick={() => {
                  setReceivingCall(false)
                  setCancelCallRequest(true)
                  socket.current.emit("cancelCallRequest")
                }}
                size={22}
                style={{ marginBottom: 7 }}
              />
              <span>End call</span>
            </>
          ) : (
            <>
              <FaPhone
                onClick={() => {
                  callFriend(otherUser)
                  setPressedCall(true)
                  if (soundOn) {
                    beepOn.play()
                  }
                }}
                size={22}
                style={{
                  marginBottom: 7,
                }}
              />
              <span>Call</span>
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
  /* filter: drop-shadow(0 0 10rem rgba(131, 82, 253, 0.05)); */

  @media (max-width: 500px) {
    display: none;
  }
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 100%;
  background: rgba(255, 255, 255, 0.01);
  padding: 1rem;
  box-shadow: "4px 0 15px rgba(0, 0, 0, 0.1)";
`

const IconWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--textColor);
  cursor: pointer;
  user-select: none;

  ${(props: StyledProps) =>
    props.off &&
    css`color: #aaa;!important; 
    `}

  ${(props: StyledProps) =>
    props.disabled &&
    css`color: #aaa;!important; pointer-events: none;
    cursor: initial;
    `}
`
