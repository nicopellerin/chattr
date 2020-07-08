import * as React from "react"
import { useRef, useState } from "react"
import styled, { css } from "styled-components"
import {
  FaMicrophoneSlash,
  FaMicrophone,
  FaVideoSlash,
  FaTimesCircle,
  FaVideo,
  FaPhone,
  FaCloudUploadAlt,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

import MessageBar from "../MessageBar"

import {
  showSelfWebcamState,
  callAcceptedState,
  muteMicState,
  receivingCallState,
  pressedCallState,
  cancelCallRequestState,
  disableCallIconState,
  getUserMediaNotSupportedState,
  getUserMediaPeerNotSupportedState,
} from "../../store/video"
import {
  listUsersState,
  userSoundOnState,
  otherUserIdQuery,
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
  const listUsers = useRecoilValue(listUsersState)
  const disableCallIcon = useRecoilValue(disableCallIconState)
  const soundOn = useRecoilValue(userSoundOnState)
  const fileTransferProgress = useRecoilValue(fileTransferProgressState)
  const otherUserId = useRecoilValue(otherUserIdQuery)
  const getUserMediaNotSupported = useRecoilValue(getUserMediaNotSupportedState)
  const getUserMediaPeerNotSupported = useRecoilValue(
    getUserMediaPeerNotSupportedState
  )

  const [errorMsg, setErrorMsg] = useState("")

  const fileInputRef = useRef() as React.RefObject<HTMLInputElement>

  const beepOn = new Audio("/sounds/click_snip.mp3")
  beepOn.volume = 0.3

  const handleSendFile = (e: any) => {
    if (!e.target.files[0]) return
    const file = e.target.files[0]
    if (file && file.size > 2 * 1000000) {
      setErrorMsg("File too big. Max size is 2 mb")
      e.target.value = ""
      setSendingFile(false)
      return
    }
    sendFile(file, file.name)
  }

  const handleCall = () => {
    callFriend(otherUserId)
    setPressedCall(true)
    if (soundOn) {
      beepOn.play()
    }
  }

  const handleCancelCall = () => {
    setReceivingCall(false)
    setCancelCallRequest(true)
    socket.current.emit("cancelCallRequest")
  }

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
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => handleSendFile(e)}
            />
            {!sendingFile && fileTransferProgress === "0" ? (
              <>
                <FaCloudUploadAlt size={22} />
              </>
            ) : (
              <motion.div
                style={{
                  color:
                    fileTransferProgress === "Done!"
                      ? "var(--successColor)"
                      : "var(--textColor)",
                  scale: fileTransferProgress === "Done!" ? 1.1 : 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "all 300ms ease-in-out",
                }}
              >
                <FaCloudUploadAlt size={22} />
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
              <FaMicrophoneSlash size={22} />
            ) : (
              <FaMicrophone size={22} />
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
              <FaVideo size={22} />
            ) : (
              <FaVideoSlash size={22} />
            )}
          </IconWrapper>
          <IconWrapper
            disabled={
              disableCallIcon ||
              getUserMediaNotSupported ||
              getUserMediaPeerNotSupported
            }
            whileTap={{ scale: 0.98 }}
          >
            {callAccepted || pressedCall ? (
              <FaTimesCircle
                style={{
                  color: "var(--primaryColor)",
                }}
                onClick={handleCancelCall}
                size={22}
              />
            ) : (
              <FaPhone onClick={handleCall} size={22} />
            )}
          </IconWrapper>
        </Container>
      </Wrapper>
      <AnimatePresence>
        {errorMsg && (
          <MessageBar errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
        )}
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
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05),
    rgba(156, 116, 254, 0.1)
  );
  color: var(--primaryColorLight);
  cursor: pointer;
  user-select: none;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);

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
