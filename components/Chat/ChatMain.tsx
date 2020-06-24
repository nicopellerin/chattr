import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import io from "socket.io-client"
import Peer from "simple-peer"
import { useRouter } from "next/router"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { saveAs } from "file-saver"

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
import ChatVideo from "./ChatVideo"
import ChatTextBar from "./ChatTextBar"
import ChatCommands from "./ChatCommands"
import ChatTextWindow from "./ChatTextWindow"
import ChatUsername from "./ChatUsername"
import {
  chatWelcomeMessageState,
  chatWindowState,
  chatUserIsTypingState,
  fileNameState,
  fileTransferProgressState,
  receivingFileState,
  sendingFileState,
  expandChatWindowState,
} from "../../store/chat"
import NoUsername from "./NoUsernameModal"
import Router from "next/router"
import { motion } from "framer-motion"

const ChatMain = () => {
  const [stream, setStream] = useRecoilState(streamState)
  const [selfId, setSelfId] = useRecoilState(selfIdState)
  const [caller, setCaller] = useRecoilState(callerState)
  const [callerSignal, setCallerSignal] = useRecoilState(callerSignalState)
  const [filename, setFileName] = useRecoilState(fileNameState)

  const setOtherUsername = useSetRecoilState(otherUsernameState)
  const setFileTransferProgress = useSetRecoilState(fileTransferProgressState)
  const setListUsers = useSetRecoilState(listUsersState)
  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setCallAccepted = useSetRecoilState(callAcceptedState)
  const setChatWelcomeMessage = useSetRecoilState(chatWelcomeMessageState)
  const setChatUserIsTyping = useSetRecoilState(chatUserIsTypingState)
  const setChatMsgs = useSetRecoilState(chatWindowState)
  const setUserLeftChattr = useSetRecoilState(userLeftChattrState)
  const setPressedCall = useSetRecoilState(pressedCallState)
  const setGetUserMediaNotSupported = useSetRecoilState(
    getUserMediaNotSupportedState
  )
  const [sendingFile, setSendingFile] = useRecoilState(sendingFileState)

  const setReceivingFile = useSetRecoilState(receivingFileState)

  // @ts-ignore
  const [cancelCallRequest, setCancelCallRequest] = useRecoilState(
    cancelCallRequestState
  )

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

    socket.current.emit("username", username)

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
      setFileTransferProgress("")
    })

    socket.current.on("userJoinedChattr", () => {
      setUserLeftChattr("")
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

    socket.current.on("sendingFile", (data: any) => {
      setCaller(data.from)
      setCallerSignal(data.signal)
      setFileName(data.fileName)
      setOtherUsername(data.username)
      setReceivingFile(true)
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
  const sendFile = (id: string, file: any) => {
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
        ],
      },
    })

    peer._debug = console.log

    peer.on("signal", (data) => {
      if (!sendingFile) {
        socket.current.emit("sendFile", {
          userToCall: id,
          signalData: data,
          from: selfId,
          fileName: file?.name,
          username,
        })

        console.log("SIGNAL SEND", data)
      }
    })

    peer.on("error", (err) => {
      console.log("SENDFILE ERROR", err)
    })

    peer.on("connect", () => {
      file
        .arrayBuffer()
        .then((buffer: any) => {
          const chunkSize = 16 * 1024

          let at = 0

          while (buffer.byteLength) {
            const chunk = buffer.slice(0, chunkSize)
            buffer = buffer.slice(chunkSize, buffer.byteLength)

            at += buffer.byteLength

            setFileTransferProgress((at / file.size).toFixed(0))

            peer.send(chunk)
          }

          setFileTransferProgress("100")
          setSendingFile(false)

          peer.send("Done!")
          peer.removeAllListeners()
        })
        .catch((err: any) => {
          setSendingFile(false)
          setFileTransferProgress("")
          console.log("ERROR SENDING FILE", err)
        })
    })

    peer.on("end", () => {
      setSendingFile(false)
      setFileTransferProgress("")
    })

    socket.current.on("receivingFile", (signal: any) => {
      peer.signal(signal)
    })

    peer.on("close", () => {
      setSendingFile(false)
      setFileTransferProgress("")
      console.log("PEER1 CLOSEDDDDDD")
      peer.removeAllListeners()
    })
  }

  // Receive file
  const fileChunks: any[] = []

  const acceptFile = () => {
    const peer2 = new Peer({
      initiator: false,
      trickle: false,
    })

    console.log("PEER2", peer2)

    peer2._debug = console.log

    peer2.on("signal", (data) => {
      socket.current.emit("acceptFile", { signal: data, to: caller })
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

    peer2.on("data", async (data) => {
      if (data.toString() === "Done!") {
        const file = new Blob(fileChunks)

        const b64 = await blobToBase64(file)

        if (filename.match(/\.(jpg|gif|png)$/) !== null) {
          socket.current.emit("chatMessage", {
            user: username,
            msg: b64,
            filename,
          })
          setSendingFile(false)
          return
        }

        saveAs(file, filename)
        setSendingFile(false)
      } else {
        fileChunks.push(data)
      }
    })

    peer2.signal(callerSignal)

    peer2.on("close", () => {
      peer2.removeAllListeners()
      console.log("PEER2 CLOSEDDDDDD")
    })
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
      {!username && <NoUsername />}
      <OutterWrapper>
        <Wrapper animate theatreMode={displayTheatreMode}>
          <LeftColumn theatreMode={displayTheatreMode}>
            <ChatVideo
              socket={socket}
              selfVideoRef={selfVideoRef}
              friendVideoRef={friendVideoRef}
              acceptCall={acceptCall}
              acceptFile={acceptFile}
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
    props.theatreMode ? "1fr" : "3fr 1fr"};
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
