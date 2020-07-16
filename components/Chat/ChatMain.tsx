import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import Peer from "simple-peer"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import shortid from "shortid"
import { useStateDesigner } from "@state-designer/react"

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
} from "../../store/video"
import {
  selfIdState,
  usernameState,
  userLeftChattrState,
  avatarState,
} from "../../store/users"
import {
  expandChatWindowState,
  messageDeletedState,
  showPlayBarState,
  togglePhotoExpanderState,
} from "../../store/chat"

import ChatVideo, { chatVideoScreens } from "./ChatVideo"
import ChatTextBar from "./ChatTextBar"
import ChatCommands from "./ChatCommands"
import ChatTextWindow from "./ChatTextWindow"
import ChatUsername from "./ChatUsername"
import NoUsername from "./NoUsernameModal"
import PlayBar from "../Games/PlayBar"

import MessageBar from "../MessageBar"

import useSocket from "../../hooks/useSocket"
import PhotoExpander from "./PhotoExpander"

const ChatMain = () => {
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)

  const [screenSharingStarted, setScreenSharingStarted] = useRecoilState(
    screenSharingStartedState
  )
  const [messageDeleted, setMessageDeleted] = useRecoilState(
    messageDeletedState
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
  const expandChatWindow = useRecoilValue(expandChatWindowState)
  const showPlayBar = useRecoilValue(showPlayBarState)
  const selfId = useRecoilValue(selfIdState)
  const caller = useRecoilValue(callerState)
  const callerSignal = useRecoilValue(callerSignalState)
  const cancelCallRequest = useRecoilValue(cancelCallRequestState)
  const togglePhotoExpander = useRecoilValue(togglePhotoExpanderState)

  const [msg, setMsg] = useState("")
  const [playBarType, setPlayBarType] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [flipWebcam, setFlipWebcam] = useState(false)

  const sendersRef = useRef<Array<MediaStreamTrack>>([])

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
    selfPeerRef.current = new Peer({
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

    streamRef.current
      .getTracks()
      .forEach((track: MediaStreamTrack) => sendersRef.current.push(track))

    chatVideoScreensState.forceTransition("callingScreen.visible")

    selfPeerRef.current.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: selfId,
      })
    })

    socket.current.emit("sendingCall", {
      userToCall: id,
    })

    selfPeerRef.current.on("stream", (stream) => {
      if (friendVideoRef.current) {
        friendVideoRef.current.srcObject = stream
        setStreamOtherPeer(stream)
      }
    })

    selfPeerRef.current.on("close", () => {
      selfPeerRef.current.removeAllListeners()
    })

    selfPeerRef.current.on("error", (err) => {
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
      selfPeerRef.current.signal(signal)
    })
  }

  // Accept incoming call
  const acceptCall = () => {
    setCallAccepted(true)
    setReceivingCall(false)

    chatVideoScreensState.forceTransition("incomingCallScreen.hidden")

    otherPeerRef.current = new Peer({
      initiator: false,
      trickle: false,
      stream: streamRef.current,
    })

    otherPeerRef.current.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    streamRef.current
      .getTracks()
      .forEach((track: MediaStreamTrack) => sendersRef.current.push(track))

    otherPeerRef.current.on("stream", (stream: MediaStream) => {
      friendVideoRef.current.srcObject = stream
      setStreamOtherPeer(stream)
    })

    otherPeerRef.current.signal(callerSignal)

    otherPeerRef.current.on("close", () => {
      otherPeerRef.current.removeAllListeners()
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

    socket.current.emit("fileTransferProgress", "Done!")

    const blobToBase64 = (blob: Blob) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result)
        }
      })
    }

    const b64 = await blobToBase64(file)

    const id = shortid.generate()

    socket.current.emit("chatMessage", {
      username,
      msg: b64,
      filename,
      id,
      avatar,
    })

    socket.current.emit("addImageToPhotoGallery", {
      username,
      msg: b64,
      filename,
      id,
      avatar,
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

  return (
    <>
      {!username && <NoUsername socket={socket} />}
      <OutterWrapper>
        <Wrapper theatreMode={displayTheatreMode}>
          <LeftColumn
            layout
            theatreMode={displayTheatreMode}
            onMouseDown={(e) => {
              e.persist()
            }}
          >
            <motion.div layout>
              <ChatVideo
                streamRef={streamRef}
                socket={socket}
                selfVideoRef={selfVideoRef}
                friendVideoRef={friendVideoRef}
                acceptCall={acceptCall}
                shareScreen={shareScreen}
                flipWebcam={flipWebcam}
              />
            </motion.div>
            <motion.div>
              <ChatTextBar socket={socket} />
            </motion.div>
          </LeftColumn>
          <RightColumn layout theatreMode={displayTheatreMode}>
            <>
              <LogoStyled src="/logo-3d.svg" alt="logo" />
              {!expandChatWindow && (
                <>
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
                </>
              )}
              <motion.div layout>
                <ChatTextWindow socket={socket} />
              </motion.div>
            </>
          </RightColumn>
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
`

const Wrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: ${(props: { theatreMode: boolean }) =>
    props.theatreMode
      ? "1fr"
      : "var(--mainLayoutLeftColumn) var(--mainLayoutRightColumn)"};
  grid-gap: 3rem;
  width: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "100%" : "85%"};

  @media (max-width: 1440px) {
    width: 90vw;
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
  grid-template-rows: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "1fr" : "9fr 1fr"};
  grid-gap: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? 0 : "2rem"};
  z-index: 19;

  @media (max-width: 500px) {
    grid-template-rows: 1fr;
  }
`

const RightColumn = styled(motion.div)`
  grid-gap: 2rem;
  display: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "none" : "grid"};
`

const LogoStyled = styled.img`
  width: 200px;
  justify-self: center;
  margin-bottom: 2rem;

  @media (max-width: 500px) {
    display: none;
  }
`
