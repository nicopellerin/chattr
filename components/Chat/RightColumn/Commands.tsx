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
  FaCloudUploadAlt,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { Circle } from "better-react-spinkit"

import MessageBar from "../Shared/MessageBar"

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
  streamOtherPeerState,
} from "../../../store/video"
import {
  listUsersState,
  userSoundOnState,
  otherUserIdQuery,
} from "../../../store/users"
import {
  fileTransferProgressState,
  sendingFileState,
} from "../../../store/chat"

interface Props {
  callFriend: (id: string) => void
  sendFile: (id: string, file: any) => void
  socket: React.MutableRefObject<SocketIOClient.Socket>
  streamRef: React.MutableRefObject<MediaStream>
}

interface StyledProps {
  off?: boolean
  disabled?: boolean
}

const ChatCommands: React.FC<Props> = ({
  callFriend,
  socket,
  sendFile,
  streamRef,
}) => {
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
  const streamOtherPeer = useRecoilValue(streamOtherPeerState)

  const [errorMsg, setErrorMsg] = useState("")

  const fileInputRef = useRef() as React.RefObject<HTMLInputElement>

  const beepOn = new Audio("/sounds/click_snip.mp3")
  beepOn.volume = 0.3

  const handleSendFile = (e: any) => {
    if (!e.target.files[0]) return
    const file = e.target.files[0]
    if (file && file.size > 2.2 * 1000000) {
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

  // Mute mic
  useEffect(() => {
    if (!streamRef?.current?.getAudioTracks()) return

    if (muteMic) {
      const audio = streamRef?.current?.getAudioTracks()
      audio[0].enabled = false
      socket.current.emit("peerMutedAudio", true)
    } else {
      const audio = streamRef?.current?.getAudioTracks()
      audio[0].enabled = true
      socket.current.emit("peerMutedAudio", false)
    }
  }, [muteMic, streamRef?.current])

  // Disable video
  useEffect(() => {
    if (!streamRef?.current?.getVideoTracks()) return

    if (!showSelfWebcam) {
      const video = streamRef?.current?.getVideoTracks()
      video[0].enabled = false
      socket.current.emit("peerClosedVideo", true)
    } else {
      const video = streamRef?.current?.getVideoTracks()
      video[0].enabled = true
      socket.current.emit("peerClosedVideo", false)
    }
  }, [showSelfWebcam, streamRef?.current])

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
              <FaCloudUploadAlt size={22} title="Send image" />
            ) : fileTransferProgress !== "Done!" ? (
              <Circle size={22} color="var(--secondaryColor)" />
            ) : (
              <IconContainer>
                <DoneWrapper
                  initial={{ x: "-50%", scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  Done!
                </DoneWrapper>
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
              </IconContainer>
            )}
          </IconWrapper>
          <IconWrapper
            disabled={getUserMediaNotSupported}
            onClick={() => {
              setMuteMic((prevState) => !prevState)
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
            disabled={getUserMediaNotSupported}
            onClick={() => {
              setShowSelfWebcam((prevState) => !prevState)
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
            style={{
              boxShadow: streamOtherPeer
                ? `0 0rem 0.5rem rgba(105, 240, 174, 0.5)`
                : `0 0rem 0.5rem rgba(0, 0, 0, 0.1)`,
            }}
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
  padding: 1.2rem 1.7rem;
  border-radius: 5px;
  box-shadow: 0 0.7rem 5rem rgba(131, 82, 253, 0.1);

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
  padding: 0.8rem;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  grid-gap: 0.5rem;
`

const IconWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  padding: 7px;
  font-weight: 600;
  border-radius: 50%;
  width: 4.5rem;
  height: 4.5rem;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05),
    rgba(156, 116, 254, 0.1)
  );
  color: var(--primaryColorLight);
  cursor: pointer;
  user-select: none;
  box-shadow: 0 0rem 0.5rem rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.4);
  }

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

const IconContainer = styled.div`
  position: relative;
`

const DoneWrapper = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: -50px;
  background: #1a0d2b;
  padding: 0.5rem;
  border-radius: 5px;
  filter: drop-shadow(0 2px 3px rgba(89, 86, 213, 0.2));
  color: var(--successColor);

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -1rem;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #1a0d2b;
    filter: drop-shadow(0 2px 2px rgba(89, 86, 213, 0.2));
  }
`
