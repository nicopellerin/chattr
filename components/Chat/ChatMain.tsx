import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import io from "socket.io-client"
import Peer from "simple-peer"
import {
  useRecoilState,
  RecoilRoot,
  useRecoilValue,
  useSetRecoilState,
} from "recoil"

import {
  streamState,
  receivingCallState,
  callerState,
  callerSignalState,
  callAcceptedState,
} from "../../store/video"
import { selfIdState, listUsersState, usernameState } from "../../store/users"
import ChatVideo from "./ChatVideo"
import ChatTextBar from "./ChatTextBar"
import ChatCommands from "./ChatCommands"
import ChatTextWindow from "./ChatTextWindow"
import ChatUsername from "./ChatUsername"
import { chatWelcomeMessageState, chatWindowState } from "../../store/chat"

const ChatMain = () => {
  const [stream, setStream] = useRecoilState(streamState)
  const [selfId, setSelfId] = useRecoilState(selfIdState)
  const [listUsers, setListUsers] = useRecoilState(listUsersState)
  const [receivingCall, setReceivingCall] = useRecoilState(receivingCallState)
  const [caller, setCaller] = useRecoilState(callerState)
  const [callerSignal, setCallerSignal] = useRecoilState(callerSignalState)
  const [callAccepted, setCallAccepted] = useRecoilState(callAcceptedState)
  const [chatWelcomeMessage, setChatWelcomeMessage] = useRecoilState(
    chatWelcomeMessageState
  )

  const [chatMsgs, setChatMsgs] = useRecoilState(chatWindowState)

  const username = useRecoilValue(usernameState)

  const selfVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const friendVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const socket = useRef() as any

  useEffect(() => {
    socket.current = io.connect("/")
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream)
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream
        }
      })

    socket.current.emit("username", username)

    socket.current.on("selfId", (id) => {
      setSelfId(id)
    })

    socket.current.on("chatConnection", (msg) => {
      setChatWelcomeMessage(msg)
    })

    socket.current.on("chatMessages", (msgs) => {
      console.log(msgs)
      setChatMsgs(msgs)
    })

    socket.current.on("listUsers", (users) => {
      setListUsers(users)
    })

    socket.current.on("call", (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setCallerSignal(data.signal)
    })
  }, [])

  const callFriend = (id) => {
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
            urls: "turn:numb.viagenie.ca",
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

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })
  }

  const acceptCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    })

    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", (stream) => {
      friendVideoRef.current.srcObject = stream
    })

    peer.signal(callerSignal)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Wrapper>
        <LeftColumn>
          <ChatVideo
            selfVideoRef={selfVideoRef}
            friendVideoRef={friendVideoRef}
            acceptCall={acceptCall}
          />
          <ChatTextBar socket={socket} />
        </LeftColumn>
        <RightColumn>
          <LogoStyled src="/logo.png" alt="logo" />
          <ChatUsername />
          <ChatCommands callFriend={callFriend} />
          <ChatTextWindow chatMsgs={chatMsgs} />
        </RightColumn>
      </Wrapper>
    </div>
  )
}

const Root = () => (
  <RecoilRoot>
    <ChatMain />
  </RecoilRoot>
)

export default Root

// Styles
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 2rem;
  width: 85%;
`

const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: 9fr 1fr;
  grid-gap: 2rem;
`

const RightColumn = styled.div`
  display: grid;
  grid-template-rows: auto 50px 1fr 3fr;
  grid-gap: 2rem;
`

const LogoStyled = styled.img`
  /* position: absolute; */
  width: 190px;
  justify-self: center;
  margin-bottom: 2rem;
`
