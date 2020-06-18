import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import io from "socket.io-client"
import Peer from "simple-peer"
import { useRouter } from "next/router"
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
  cancelCallRequestState,
  pressedCallState,
  muteMicState,
} from "../../store/video"
import {
  selfIdState,
  listUsersState,
  usernameState,
  userLeftChattrState,
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
} from "../../store/chat"

const ChatMain = () => {
  const [stream, setStream] = useRecoilState(streamState)
  const [selfId, setSelfId] = useRecoilState(selfIdState)
  const [caller, setCaller] = useRecoilState(callerState)
  const [callerSignal, setCallerSignal] = useRecoilState(callerSignalState)

  const setListUsers = useSetRecoilState(listUsersState)
  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setCallAccepted = useSetRecoilState(callAcceptedState)
  const setChatWelcomeMessage = useSetRecoilState(chatWelcomeMessageState)
  const setChatUserIsTyping = useSetRecoilState(chatUserIsTypingState)
  const setChatMsgs = useSetRecoilState(chatWindowState)
  const setUserLeftChattr = useSetRecoilState(userLeftChattrState)
  const setPressedCall = useSetRecoilState(pressedCallState)
  const [cancelCallRequest, setCancelCallRequest] = useRecoilState(
    cancelCallRequestState
  )

  const username = useRecoilValue(usernameState)
  const micMuted = useRecoilValue(muteMicState)

  const selfVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const friendVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const socket = useRef() as React.MutableRefObject<SocketIOClient.Socket>

  const { query } = useRouter()

  useEffect(() => {
    socket.current = io.connect(`/?room=${query["room"]}`)
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
      .then((stream) => {
        setStream(stream)
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream
        }
      })

    console.log("STREAM", stream)

    socket.current.emit("username", username)

    socket.current.on("selfId", (id) => {
      setSelfId(id)
    })

    socket.current.on("chatConnection", (msg) => {
      setChatWelcomeMessage(msg)
    })

    socket.current.on("chatMessages", (msg) => {
      setChatMsgs((prevState) => [...prevState, msg])
    })

    socket.current.on("chatMessageIsTyping", ({ username, status, msg }) => {
      setChatUserIsTyping({ username, status })
    })

    socket.current.on("userLeftChattr", (msg) => {
      setUserLeftChattr(msg)
    })

    socket.current.on("userJoinedChattr", () => {
      setUserLeftChattr("")
    })

    socket.current.on("listUsers", (users) => {
      setListUsers(users)
    })

    socket.current.on("call", (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setCallerSignal(data.signal)
    })

    socket.current.on("callCancelled", () => {
      setPressedCall(false)
      setCallAccepted(false)
      setReceivingCall(false)
      setCancelCallRequest(true)
      friendVideoRef.current.srcObject = null
    })
  }, [])

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

    peer.on("close", () => {
      setCallAccepted(true)
      selfVideoRef.current.srcObject = null
    })

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })
  }

  const peer2 = new Peer({
    initiator: false,
    trickle: false,
    stream: stream,
  })

  const acceptCall = () => {
    setCallAccepted(true)

    peer2.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer2.on("stream", (stream) => {
      friendVideoRef.current.srcObject = stream
    })

    peer2.signal(callerSignal)

    peer2.on("close", () => {
      friendVideoRef.current.srcObject = null
    })
  }

  useEffect(() => {
    if (cancelCallRequest) {
      // alert("Yo")
      peer2.removeStream(stream)
      friendVideoRef.current.srcObject = null
      // selfVideoRef.current.srcObject = null
      socket.current.emit("cancelCallRequest")
    }
  }, [cancelCallRequest])

  // useEffect(() => {
  //   if (micMuted) {
  //     stream.getAudioTracks()[0].enabled = false
  //   } else {
  //     stream.getAudioTracks()[0].enabled = true
  //   }
  // }, [micMuted])

  return (
    <OutterWrapper>
      <Wrapper>
        <LeftColumn>
          <ChatVideo
            socket={socket}
            selfVideoRef={selfVideoRef}
            friendVideoRef={friendVideoRef}
            acceptCall={acceptCall}
          />
          <ChatTextBar socket={socket} />
        </LeftColumn>
        <RightColumn>
          <LogoStyled src="/logo.svg" alt="logo" />
          <ChatUsername />
          <ChatCommands callFriend={callFriend} socket={socket} />
          <ChatTextWindow />
        </RightColumn>
      </Wrapper>
    </OutterWrapper>
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

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 3rem;
  width: 85%;
`

const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: 9fr 1fr;
  grid-gap: 2rem;
`

const RightColumn = styled.div`
  display: grid;
  /* grid-template-rows: auto 50px 1fr 3fr; */
  grid-gap: 2rem;
`

const LogoStyled = styled.img`
  width: 200px;
  justify-self: center;
  margin-bottom: 1rem;
`
