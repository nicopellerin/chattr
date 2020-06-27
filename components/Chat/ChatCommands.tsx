import * as React from "react"
import { useRef, useState, useEffect } from "react"
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
import { motion, AnimatePresence } from "framer-motion"
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
import MessageBar from "../MessageBar"

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

  const [errorMsg, setErrorMsg] = useState("")

  const fileInputRef = useRef() as React.RefObject<HTMLInputElement>

  const otherUser = listUsers?.filter((user) => user !== selfId).join("")

  const beepOn = new Audio("/sounds/click_snip.mp3")
  beepOn.volume = 0.3
  const errorSound = new Audio("/sounds/digi_error_short.mp3")
  errorSound.volume = 0.5

  const handleSendFile = (e: any) => {
    if (!e.target.files[0]) return

    setSendingFile(true)

    const file = e.target.files[0]

    if (file && file.size > 5 * 1000000) {
      setErrorMsg("File too big. Max size is 5 mb")
      e.target.value = ""
      setSendingFile(false)
      return
    }

    sendFile(otherUser, file)
  }

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>

    if (errorMsg) {
      errorSound.play()
      idx = setTimeout(() => setErrorMsg(""), 3000)
    }

    return () => clearTimeout(idx)
  }, [errorMsg])

  return (
    <>
      <Wrapper>
        <Container>
          <IconWrapper
            onClick={() => {
              fileInputRef.current && fileInputRef.current.click()
              if (soundOn) {
                beepOn.play()
              }
            }}
            disabled={listUsers?.length < 2}
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
            {!sendingFile && fileTransferProgress === "0" ? (
              <>
                <FaRocket size={20} style={{ marginBottom: 7 }} />
                <span style={{ whiteSpace: "nowrap" }}>Send file</span>
              </>
            ) : (
              <motion.div
                style={{
                  color:
                    fileTransferProgress === "100"
                      ? "var(--successColor)"
                      : "var(--textColor)",
                  scale: fileTransferProgress === "100" ? 1.1 : 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "all 300ms ease-in-out",
                }}
              >
                <FaRocket size={20} style={{ marginBottom: 7 }} />
                <span>
                  {fileTransferProgress === "0"
                    ? "Waiting..."
                    : `${fileTransferProgress}%`}
                </span>
              </motion.div>
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
                <FaMicrophoneSlash size={20} style={{ marginBottom: 7 }} />
                <span>Mic</span>
              </>
            ) : (
              <>
                <FaMicrophone size={20} style={{ marginBottom: 7 }} />
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
                  size={20}
                  style={{
                    marginBottom: 7,
                  }}
                />
                <span>Webcam</span>
              </>
            ) : (
              <>
                <FaVideoSlash size={20} style={{ marginBottom: 7 }} />
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
                  size={20}
                  style={{ marginBottom: 7 }}
                />
                <span>End</span>
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
                  size={20}
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
      <AnimatePresence>
        {errorMsg && <MessageBar msg={errorMsg} />}
      </AnimatePresence>
    </>
  )
}

export default ChatCommands

// Styles
const Wrapper = styled(motion.div)`
  background: #1a0d2b;
  height: 100%;
  padding: 1.7rem;
  border-radius: 5px;

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
  grid-gap: 0.5rem;
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
