import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import io from "socket.io-client"
import Peer from "simple-peer"
import Router, { useRouter } from "next/router"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { motion } from "framer-motion"

import {
  streamState,
  receivingCallState,
  callerState,
  callerSignalState,
  callAcceptedState,
  cancelCallRequestState,
  pressedCallState,
  muteMicState,
  showSelfWebcamState,
  getUserMediaNotSupportedState,
  displayTheatreModeState,
} from "../../store/video"
import {
  selfIdState,
  listUsersState,
  usernameState,
  userLeftChattrState,
  otherUsernameState,
} from "../../store/users"
import {
  chatWelcomeMessageState,
  chatWindowState,
  chatUserIsTypingState,
  fileTransferProgressState,
  sendingFileState,
  expandChatWindowState,
} from "../../store/chat"

import ChatVideo from "./ChatVideo"
import ChatTextBar from "./ChatTextBar"
import ChatCommands from "./ChatCommands"
import ChatTextWindow from "./ChatTextWindow"
import ChatUsername from "./ChatUsername"
import NoUsername from "./NoUsernameModal"

const ChatMain = () => {
  const [stream, setStream] = useRecoilState(streamState)
  const [selfId, setSelfId] = useRecoilState(selfIdState)
  const [caller, setCaller] = useRecoilState(callerState)
  const [callerSignal, setCallerSignal] = useRecoilState(callerSignalState)
  const [cancelCallRequest, setCancelCallRequest] = useRecoilState(
    cancelCallRequestState
  )

  const setSendingFile = useSetRecoilState(sendingFileState)
  const setFileTransferProgress = useSetRecoilState(fileTransferProgressState)
  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setListUsers = useSetRecoilState(listUsersState)
  const setCallAccepted = useSetRecoilState(callAcceptedState)
  const setChatWelcomeMessage = useSetRecoilState(chatWelcomeMessageState)
  const setChatUserIsTyping = useSetRecoilState(chatUserIsTypingState)
  const setChatMsgs = useSetRecoilState(chatWindowState)
  const setUserLeftChattr = useSetRecoilState(userLeftChattrState)
  const setPressedCall = useSetRecoilState(pressedCallState)
  const setGetUserMediaNotSupported = useSetRecoilState(
    getUserMediaNotSupportedState
  )
  const setOtherUsername = useSetRecoilState(otherUsernameState)

  const displayTheatreMode = useRecoilValue(displayTheatreModeState)
  const username = useRecoilValue(usernameState)
  const micMuted = useRecoilValue(muteMicState)
  const showSelfWebcam = useRecoilValue(showSelfWebcamState)
  const expandChatWindow = useRecoilValue(expandChatWindowState)

  const selfVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const friendVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const socket = useRef() as React.MutableRefObject<SocketIOClient.Socket>

  const { query } = useRouter()

  const room = query["room"]

  useEffect(() => {
    socket.current = io.connect(`/?room=${room}`)

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: { ideal: 4096 }, height: { ideal: 2160 } },
          audio: true,
        })
        .then((stream: MediaStream) => {
          setStream(stream)
          if (selfVideoRef.current) {
            selfVideoRef.current.srcObject = stream
          }
        })
        .catch(() => {
          setGetUserMediaNotSupported(true)
        })
    }

    socket.current.on("notAllowed", () => {
      Router.push("/")
    })

    socket.current.on("selfId", (id: string) => {
      setSelfId(id)
    })

    socket.current.on("chatConnection", (msg: string) => {
      setChatWelcomeMessage(msg)
    })

    socket.current.on("chatMessages", (msg: string) => {
      setChatMsgs((prevState) => [...prevState, msg])
    })

    socket.current.on(
      "chatMessageIsTyping",
      ({ username, status }: { username: string; status: boolean }) => {
        setChatUserIsTyping({ username, status })
      }
    )

    socket.current.on("userLeftChattr", (msg: string) => {
      setUserLeftChattr(msg)
      setPressedCall(false)
      setCallAccepted(false)
      setReceivingCall(false)
      setCancelCallRequest(true)
      setTimeout(() => setUserLeftChattr(""), 3000)
      setChatMsgs([])
      setSendingFile(false)
      setFileTransferProgress("0")
    })

    socket.current.on("userJoinedChattr", (username: string) => {
      setUserLeftChattr("")
      setOtherUsername(username)
    })

    socket.current.on("usernameJoined", (username: string) => {
      setOtherUsername(username)
    })

    socket.current.on("listUsers", (users: string[]) => {
      setListUsers(users)
    })

    socket.current.on("call", (data: any) => {
      setCaller(data.from)
      setCallerSignal(data.signal)
      setReceivingCall(true)
    })

    socket.current.on("callCancelled", () => {
      setPressedCall(false)
      setCallAccepted(false)
      setReceivingCall(false)
      setCancelCallRequest(true)
      friendVideoRef.current.srcObject = null
    })

    socket.current.on("fileTransferProgressGlobal", (progress: string) => {
      setFileTransferProgress(progress)
    })
  }, [])

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
      stream: stream,
    })

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: selfId,
      })
    })

    peer.on("stream", (stream) => {
      if (friendVideoRef.current) {
        friendVideoRef.current.srcObject = stream
      }
    })

    peer.on("close", () => {
      console.log("Closing WEBRTC")
      peer.removeAllListeners()
    })

    peer.on("error", (err) => {
      console.log("WEBRTC ERROR", err)
    })

    socket.current.on("userLeftChattr", (msg: string) => {
      setUserLeftChattr(msg)
      peer.removeAllListeners()
    })

    socket.current.on("callAccepted", (signal: any) => {
      setReceivingCall(false)
      setCallAccepted(true)
      peer.signal(signal)
    })
  }

  // Accept incoming call
  const acceptCall = () => {
    setCallAccepted(true)
    setReceivingCall(false)

    const peer2 = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    })

    peer2.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer2.on("stream", (stream) => {
      friendVideoRef.current.srcObject = stream
    })

    peer2.signal(callerSignal)

    peer2.on("close", () => {
      peer2.removeAllListeners()
    })
  }

  // Send file
  const sendFile = async (file: any, filename: string) => {
    socket.current.emit("sendFile", {
      fileName: filename,
      username,
    })

    socket.current.emit("fileTransferProgress", "Sent!")

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

    socket.current.emit("chatMessage", {
      user: username,
      msg: b64,
      filename,
    })

    socket.current.emit("fileTransferProgress", "Sent!")
  }

  // End call
  useEffect(() => {
    if (cancelCallRequest) {
      socket.current.emit("cancelCallRequest")
    }
  }, [cancelCallRequest])

  // Mute mic
  useEffect(() => {
    if (!stream?.getAudioTracks()) return

    if (micMuted) {
      const audio = stream.getAudioTracks()
      audio[0].enabled = false
    } else {
      const audio = stream.getAudioTracks()
      audio[0].enabled = true
    }
  }, [micMuted, stream])

  // Disable video
  useEffect(() => {
    if (!stream?.getVideoTracks()) return

    if (!showSelfWebcam) {
      const video = stream.getVideoTracks()
      video[0].enabled = false
    } else {
      const video = stream.getVideoTracks()
      video[0].enabled = true
    }
  }, [showSelfWebcam, stream])

  return (
    <>
      {!username && <NoUsername socket={socket} />}
      <OutterWrapper>
        <Wrapper animate theatreMode={displayTheatreMode}>
          <LeftColumn theatreMode={displayTheatreMode}>
            <ChatVideo
              socket={socket}
              selfVideoRef={selfVideoRef}
              friendVideoRef={friendVideoRef}
              acceptCall={acceptCall}
            />
            <motion.div animate>
              <ChatTextBar socket={socket} />
            </motion.div>
          </LeftColumn>
          <RightColumn animate theatreMode={displayTheatreMode}>
            <>
              <LogoStyled src="/logo-3d.svg" alt="logo" />
              {!expandChatWindow && (
                <>
                  <motion.div animate>
                    <ChatUsername />
                  </motion.div>
                  <motion.div animate>
                    <ChatCommands
                      callFriend={callFriend}
                      sendFile={sendFile}
                      socket={socket}
                    />
                  </motion.div>
                </>
              )}
              <motion.div animate>
                <ChatTextWindow />
              </motion.div>
            </>
          </RightColumn>
        </Wrapper>
      </OutterWrapper>
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
    props.theatreMode ? "1fr" : "3fr 1.1fr"};
  grid-gap: 3rem;
  width: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "100%" : "85%"};

  @media (max-width: 1024px) {
    width: 95vw;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    width: 90vw;
  }
`

const LeftColumn = styled(motion.div)`
  display: grid;
  grid-template-rows: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "1fr" : "9fr 1fr"};
  grid-gap: 2rem;

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
