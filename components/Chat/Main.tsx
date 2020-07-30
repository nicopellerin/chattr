import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled, { css } from "styled-components"
import Peer from "simple-peer"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import shortid from "shortid"
import { useStateDesigner } from "@state-designer/react"
import { FaExchangeAlt } from "react-icons/fa"

import {
  receivingCallState,
  callerState,
  callerSignalState,
  callAcceptedState,
  cancelCallRequestState,
  displayTheatreModeState,
  streamOtherPeerState,
  shareVideoScreenState,
  screenSharingStartedState,
  sharingScreenState,
  chatVideoScreens,
} from "../../store/video"
import {
  selfIdState,
  usernameState,
  userLeftChattrState,
  avatarState,
  userSoundOnState,
  userJoinedChattrState,
} from "../../store/users"
import {
  messageDeletedState,
  showPlayBarState,
  togglePhotoExpanderState,
  flipLayoutState,
} from "../../store/chat"

import ChatVideo from "./LeftColumn/ChatVideo"
import ChatTextBar from "./LeftColumn/TextBar"
import ChatCommands from "./RightColumn/Commands"
import ChatTextWindow from "./RightColumn/TextWindow"
import ChatUsername from "./RightColumn/Username"
import NoUsername from "./Shared/NoUsernameModal"
import PlayBar from "../Games/PlayBar"
import MessageBar from "./Shared/MessageBar"
import PhotoExpander from "./Shared/PhotoExpander"

import useSocket from "../../hooks/useSocket"

interface StyledProps {
  theatreMode?: boolean
  flipLayout?: boolean
}

const ChatMain = () => {
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)

  const [screenSharingStarted, setScreenSharingStarted] = useRecoilState(
    screenSharingStartedState
  )
  const [messageDeleted, setMessageDeleted] = useRecoilState(
    messageDeletedState
  )
  const [flipLayout, setFlipLayout] = useRecoilState(flipLayoutState)
  const [userJoinedChattr, setUserJoinedChattr] = useRecoilState(
    userJoinedChattrState
  )

  const setStreamOtherPeer = useSetRecoilState(streamOtherPeerState)
  const setCallAccepted = useSetRecoilState(callAcceptedState)
  const setUserLeftChattr = useSetRecoilState(userLeftChattrState)
  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setSharedVideoScreen = useSetRecoilState(shareVideoScreenState)
  const setSharingScreen = useSetRecoilState(sharingScreenState)

  const displayTheatreMode = useRecoilValue(displayTheatreModeState)
  const username = useRecoilValue(usernameState)
  const avatar = useRecoilValue(avatarState)
  const showPlayBar = useRecoilValue(showPlayBarState)
  const selfId = useRecoilValue(selfIdState)
  const caller = useRecoilValue(callerState)
  const callerSignal = useRecoilValue(callerSignalState)
  const cancelCallRequest = useRecoilValue(cancelCallRequestState)
  const togglePhotoExpander = useRecoilValue(togglePhotoExpanderState)
  const soundOn = useRecoilValue(userSoundOnState)

  const [msg, setMsg] = useState("")
  const [playBarType, setPlayBarType] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [flipWebcam, setFlipWebcam] = useState(false)

  const sendersRef = useRef<Array<MediaStreamTrack>>([])

  const expand = new Audio("/sounds/expand.mp3")
  expand.volume = 0.3

  const {
    socket,
    selfPeerRef,
    otherPeerRef,
    selfVideoRef,
    friendVideoRef,
    newStreamRef,
    oldStreamRef,
    streamRef,
  } = useSocket({ setMsg, setPlayBarType, setErrorMsg, setFlipWebcam })

  // Remove "Screen sharing started text" after 3000ms
  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (screenSharingStarted) {
      setTimeout(() => setScreenSharingStarted(false), 3000)
    }

    return () => clearTimeout(idx)
  }, [screenSharingStarted])

  // Call other connection
  const callFriend = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      stream: streamRef.current,
    })

    selfPeerRef.current = peer

    streamRef.current
      .getTracks()
      .forEach((track: MediaStreamTrack) => sendersRef.current.push(track))

    chatVideoScreensState.forceTransition("callingScreen.visible")

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: selfId,
      })
    })

    socket.current.emit("sendingCall", {
      userToCall: id,
    })

    peer.on("stream", (stream) => {
      if (friendVideoRef.current) {
        friendVideoRef.current.srcObject = stream
        setStreamOtherPeer(stream)
      }
    })

    peer.on("close", () => {
      peer.removeListener("signal", callerSignal)
    })

    peer.on("error", (err) => {
      console.log("WEBRTC ERROR", err)
    })

    socket.current.on("userLeftChattr", () => {
      setUserLeftChattr(true)
      selfPeerRef.current.removeAllListeners()
    })

    socket.current.on("callAccepted", (signal: any) => {
      setReceivingCall(false)
      setCallAccepted(true)
      chatVideoScreensState.forceTransition("callingScreen.hidden")
      peer.signal(signal)
    })
  }

  // Accept incoming call
  const acceptCall = () => {
    setCallAccepted(true)
    setReceivingCall(false)

    chatVideoScreensState.forceTransition("incomingCallScreen.hidden")

    const peer2 = new Peer({
      initiator: false,
      trickle: false,
      stream: streamRef.current,
    })

    otherPeerRef.current = peer2

    peer2.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    streamRef.current
      .getTracks()
      .forEach((track: MediaStreamTrack) => sendersRef.current.push(track))

    peer2.on("stream", (stream: MediaStream) => {
      friendVideoRef.current.srcObject = stream
      setStreamOtherPeer(stream)
    })

    peer2.signal(callerSignal)

    peer2.on("close", () => {
      peer2.removeListener("signal", callerSignal)
    })
  }

  const shareScreen = () => {
    navigator.mediaDevices
      // @ts-ignore
      .getDisplayMedia({
        cursor: true,
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        },
      })
      .then((shareStream: MediaStream) => {
        if (selfPeerRef.current) {
          const newStream = shareStream.getTracks()[0]
          const oldStream = sendersRef.current.find(
            (sender) => sender.kind === "video"
          )!

          oldStreamRef.current = oldStream
          newStreamRef.current = newStream

          socket.current.emit("sharedScreenRequest", {
            username,
            status: true,
          })

          newStream.onended = function () {
            selfPeerRef.current.replaceTrack(
              oldStream,
              streamRef.current.getTracks()[1],
              streamRef.current
            )
            setSharedVideoScreen(false)
            setFlipWebcam(false)
            setSharingScreen(false)

            socket.current.emit("sharedScreenRequest", {
              username: "user",
              status: false,
            })
          }
        } else if (otherPeerRef.current) {
          const newStream = shareStream.getTracks()[0]
          const oldStream = sendersRef.current.find(
            (sender) => sender.kind === "video"
          )!

          oldStreamRef.current = oldStream
          newStreamRef.current = newStream

          socket.current.emit("sharedScreenRequest", {
            username,
            status: true,
          })

          newStream.onended = function () {
            otherPeerRef.current.replaceTrack(
              oldStream,
              streamRef.current.getTracks()[1],
              streamRef.current
            )
            setSharedVideoScreen(false)
            setFlipWebcam(false)
            setSharingScreen(false)

            socket.current.emit("sharedScreenRequest", {
              username: "user",
              status: false,
            })
          }
        }
      })
  }

  // Send file
  const sendFile = async (file: any, filename: string) => {
    socket.current.emit("sendFile", {
      fileName: filename,
      username,
    })

    const blobToBase64 = (blob: Blob) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result)
        }
      })
    }

    const b64 = (await blobToBase64(file)) as string
    const id = shortid.generate()

    socket.current.emit("chatMessage", {
      username,
      msg: b64,
      filename,
      id,
      avatar,
      type: "image",
    })

    socket.current.emit("addImageToPhotoGallery", {
      username,
      msg: b64,
      filename,
      id,
      avatar,
      type: "image",
    })

    socket.current.emit("fileTransferProgress", "Done!")
  }

  // End call
  useEffect(() => {
    if (cancelCallRequest) {
      socket.current.emit("cancelCallRequest")
    }
  }, [cancelCallRequest])

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (messageDeleted) {
      setTimeout(() => setMessageDeleted(false), 1500)
    }
    return () => clearTimeout(idx)
  }, [messageDeleted])

  useEffect(() => {
    socket.current.emit("userJoined")
    socket.current.on("userJoinedGlobal", () => {
      setUserJoinedChattr(true)
    })
  }, [])

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (userJoinedChattr) {
      idx = setTimeout(() => setUserJoinedChattr(false), 3000)
    }

    return () => clearTimeout(idx)
  }, [userJoinedChattr])

  return (
    <>
      {!username && <NoUsername socket={socket} />}
      <OutterWrapper flipLayout={flipLayout}>
        <Wrapper theatreMode={displayTheatreMode}>
          <LeftColumn
            key="left"
            flipLayout={flipLayout}
            layout="position"
            theatreMode={displayTheatreMode}
          >
            <ChatVideo
              streamRef={streamRef}
              socket={socket}
              selfVideoRef={selfVideoRef}
              friendVideoRef={friendVideoRef}
              acceptCall={acceptCall}
              shareScreen={shareScreen}
              flipWebcam={flipWebcam}
            />
            {!displayTheatreMode && <ChatTextBar socket={socket} />}
          </LeftColumn>
          {!displayTheatreMode && (
            <RightColumn key="right" layout="position">
              <LogoContainer>
                <LogoStyled src="/logo-3d.svg" alt="logo" />
                <ExchangeIconButton
                  layout
                  initial={{ y: "-50%" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFlipLayout((prevState) => !prevState)
                    if (soundOn) {
                      expand.play()
                    }
                  }}
                >
                  <ExchangeIcon />
                </ExchangeIconButton>
              </LogoContainer>
              <motion.div layout>
                <ChatUsername />
              </motion.div>
              <motion.div layout>
                <ChatCommands
                  callFriend={callFriend}
                  sendFile={sendFile}
                  socket={socket}
                  streamRef={streamRef}
                />
              </motion.div>
              <ChatTextWindow socket={socket} />
            </RightColumn>
          )}
        </Wrapper>
      </OutterWrapper>
      <AnimatePresence>
        {showPlayBar && (
          <PlayBar
            msg={msg}
            setMsg={setMsg}
            socket={socket}
            type={playBarType}
            setFlipWebcam={setFlipWebcam}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {errorMsg && (
          <MessageBar
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            delay={3000}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {togglePhotoExpander && <PhotoExpander />}
      </AnimatePresence>
    </>
  )
}

export default ChatMain

// Styles
const OutterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  ${(props: StyledProps) =>
    props.flipLayout &&
    css`
      --mainLayoutLeftColumn: 1.1fr;
      --mainLayoutRightColumn: 3fr;
    `}
`

const Wrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: ${(props: StyledProps) =>
    props.theatreMode
      ? "1fr"
      : "var(--mainLayoutLeftColumn) var(--mainLayoutRightColumn)"};
  grid-gap: 3rem;
  width: ${(props: StyledProps) => (props.theatreMode ? "100%" : "85%")};

  @media (max-width: 1440px) {
    width: ${(props: StyledProps) => (props.theatreMode ? "100vw" : "90vw")};
  }

  @media (max-width: 1024px) {
    width: 90vw;
    height: 90vh;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    width: 90vw;
  }
`

const LeftColumn = styled(motion.div)`
  position: relative;
  display: grid;
  grid-template-rows: ${(props: StyledProps) =>
    props.theatreMode ? "1fr" : "9fr 1fr"};
  grid-gap: ${(props: StyledProps) => (props.theatreMode ? 0 : "2rem")};
  z-index: 19;
  order: ${(props: StyledProps) => (props.flipLayout ? 1 : 0)};

  @media (max-width: 500px) {
    grid-template-rows: 1fr;
  }
`

const RightColumn = styled(motion.div)`
  grid-gap: 2rem;
  display: grid;
`

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const LogoStyled = styled.img`
  width: 200px;
  justify-self: center;
  margin-bottom: 2rem;

  @media (max-width: 500px) {
    display: none;
  }
`

const ExchangeIconButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  right: 2rem;
  opacity: 0;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  transition: opacity 150ms ease-in-out;

  ${LogoContainer}:hover & {
    opacity: 1;
  }
`

const ExchangeIcon = styled(FaExchangeAlt)`
  font-size: 2rem;
  color: var(--secondaryColor);
`
