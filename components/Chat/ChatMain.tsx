import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import io from "socket.io-client"
import Peer from "simple-peer"
import { useRecoilState, RecoilRoot } from "recoil"

import {
  streamState,
  receivingCallState,
  callerState,
  callerSignalState,
  callAcceptedState,
} from "../../store/video"
import { selfIDState, listUsersState } from "../../store/users"
import ChatVideo from "./ChatVideo"
import ChatTextBar from "./ChatTextBar"
import ChatCommands from "./ChatCommands"
import ChatTextWindow from "./ChatTextWindow"

const ChatMain = () => {
  const [stream, setStream] = useRecoilState(streamState)
  const [selfID, setSelfID] = useRecoilState(selfIDState)
  const [listUsers, setListUsers] = useRecoilState(listUsersState)
  const [receivingCall, setReceivingCall] = useRecoilState(receivingCallState)
  const [caller, setCaller] = useRecoilState(callerState)
  const [callerSignal, setCallerSignal] = useRecoilState(callerSignalState)
  const [callAccepted, setCallAccepted] = useRecoilState(callAcceptedState)

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

    socket.current.on("selfID", (id) => {
      setSelfID(id)
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
        from: selfID,
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
    <>
      <LogoStyled src="/logo.png" alt="logo" />
      <Wrapper>
        <LeftColumn>
          <ChatVideo
            stream={stream}
            selfVideoRef={selfVideoRef}
            friendVideoRef={friendVideoRef}
            acceptCall={acceptCall}
          />
          <ChatTextBar />
        </LeftColumn>
        <RightColumn>
          <ChatCommands />
          <ChatTextWindow />
        </RightColumn>
      </Wrapper>
    </>
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
  grid-gap: 3rem;
  height: 70%;
  width: 85%;
`

const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: 9fr 1fr;
  grid-gap: 2rem;
`

const RightColumn = styled.div`
  display: grid;
  grid-template-rows: 1fr 3fr;
  grid-gap: 2rem;
`

const LogoStyled = styled.img`
  position: absolute;
  top: 1rem;
`
