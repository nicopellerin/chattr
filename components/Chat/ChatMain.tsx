import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import io from "socket.io-client"
import Peer from "simple-peer"
import Router, { useRouter } from "next/router"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import CryptoJS from "crypto-js"
import shortid from "shortid"
import { useStateDesigner } from "@state-designer/react"

import {
  receivingCallState,
  callerState,
  callerSignalState,
  callAcceptedState,
  cancelCallRequestState,
  pressedCallState,
  getUserMediaNotSupportedState,
  displayTheatreModeState,
  peerAudioMutedState,
  streamOtherPeerState,
  getUserMediaPeerNotSupportedState,
  shareVideoScreenState,
  screenSharingStartedState,
} from "../../store/video"
import {
  selfIdState,
  listUsersState,
  usernameState,
  userLeftChattrState,
} from "../../store/users"
import {
  chatWelcomeMessageState,
  chatWindowState,
  chatUserIsTypingState,
  fileTransferProgressState,
  expandChatWindowState,
  messageDeletedState,
  messageContainsHeartEmojiState,
  photoGalleryState,
  showPlayBarState,
  userLeftChattrAction,
} from "../../store/chat"
import {
  playerXGlobalState,
  playerOGlobalState,
  boardState,
  xIsNextState,
  resetGameState,
} from "../../store/game"
import {
  youtubeUrlState,
  playYoutubeVideoState,
  youtubeVideoMetaDataState,
  youtubeVideoRewindState,
} from "../../store/youtube"

import ChatVideo, { chatVideoScreens } from "./ChatVideo"
import ChatTextBar from "./ChatTextBar"
import ChatCommands from "./ChatCommands"
import ChatTextWindow from "./ChatTextWindow"
import ChatUsername from "./ChatUsername"
import NoUsername from "./NoUsernameModal"
import PlayBar from "../Games/PlayBar"
import { youtubeChatWindowScreens } from "./YoutubeChatWindow"

import { User, Message, Call } from "../../models"

import { gameScreens } from "../Games/TicTacToe/Game"
import MessageBar from "../MessageBar"
import SimplePeer from "simple-peer"

enum SquareValue {
  X = "X",
  O = "O",
}

const ChatMain = () => {
  const state = useStateDesigner(gameScreens)
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)
  // const chatTextWindowScreensState = useStateDesigner(chatTextWindowScreens)
  const youtubeChatWindowScreensState = useStateDesigner(
    youtubeChatWindowScreens
  )

  const [selfId, setSelfId] = useRecoilState(selfIdState)
  const [caller, setCaller] = useRecoilState(callerState)
  const [callerSignal, setCallerSignal] = useRecoilState(callerSignalState)
  const [cancelCallRequest, setCancelCallRequest] = useRecoilState(
    cancelCallRequestState
  )
  const [messageDeleted, setMessageDeleted] = useRecoilState(
    messageDeletedState
  )
  const [screenSharingStarted, setScreenSharingStarted] = useRecoilState(
    screenSharingStartedState
  )

  const setStreamOtherPeer = useSetRecoilState(streamOtherPeerState)
  const setCallAccepted = useSetRecoilState(callAcceptedState)
  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setPhotoGallery = useSetRecoilState(photoGalleryState)
  const setListUsers = useSetRecoilState(listUsersState)
  const setFileTransferProgress = useSetRecoilState(fileTransferProgressState)
  const setChatWelcomeMessage = useSetRecoilState(chatWelcomeMessageState)
  const setChatUserIsTyping = useSetRecoilState(chatUserIsTypingState)
  const setChatMsgs = useSetRecoilState(chatWindowState)
  const setUserLeftChattr = useSetRecoilState(userLeftChattrState)
  const setPressedCall = useSetRecoilState(pressedCallState)
  const setGetUserMediaNotSupported = useSetRecoilState(
    getUserMediaNotSupportedState
  )
  const setGetUserMediaPeerNotSupported = useSetRecoilState(
    getUserMediaPeerNotSupportedState
  )
  const setPeerAudioMuted = useSetRecoilState(peerAudioMutedState)
  const setPlayerXGlobal = useSetRecoilState(playerXGlobalState)
  const setPlayerOGlobal = useSetRecoilState(playerOGlobalState)
  const setMessageContainsHeartEmoji = useSetRecoilState(
    messageContainsHeartEmojiState
  )
  const setShowPlayBar = useSetRecoilState(showPlayBarState)
  const setBoard = useSetRecoilState(boardState)
  const setXisNext = useSetRecoilState(xIsNextState)
  const setResetGame = useSetRecoilState(resetGameState)
  const setYoutubeUrl = useSetRecoilState(youtubeUrlState)
  const setPlayYoutubeVideo = useSetRecoilState(playYoutubeVideoState)
  const setYoutubeVideoRewind = useSetRecoilState(youtubeVideoRewindState)
  const setYoutubeMetaData = useSetRecoilState(youtubeVideoMetaDataState)
  const setUsername = useSetRecoilState(usernameState)
  const setSharedVideoScreen = useSetRecoilState(shareVideoScreenState)
  const setUserLeftChattrAction = useSetRecoilState(userLeftChattrAction)

  const displayTheatreMode = useRecoilValue(displayTheatreModeState)
  const username = useRecoilValue(usernameState)
  const expandChatWindow = useRecoilValue(expandChatWindowState)
  const showPlayBar = useRecoilValue(showPlayBarState)

  const [msg, setMsg] = useState("")
  const [playBarType, setPlayBarType] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [flipWebcam, setFlipWebcam] = useState(false)

  const selfVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const friendVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const socket = useRef() as React.MutableRefObject<SocketIOClient.Socket>
  const sendersRef = useRef<Array<MediaStreamTrack>>([])

  const selfPeerRef = useRef() as React.MutableRefObject<SimplePeer.Instance>
  const otherPeerRef = useRef() as React.MutableRefObject<SimplePeer.Instance>

  const oldStreamRef = useRef() as React.MutableRefObject<MediaStreamTrack>
  const newStreamRef = useRef() as React.MutableRefObject<MediaStreamTrack>

  const streamRef = useRef() as React.MutableRefObject<MediaStream>

  const { query } = useRouter()

  const room = query["room"]

  useEffect(() => {
    const tempUsername = "Anonymous"

    socket.current = io.connect(`/?room=${room}`, {
      transportOptions: {
        polling: {
          extraHeaders: {
            "x-username": JSON.stringify(username || tempUsername),
          },
        },
      },
    })

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: { ideal: 4096 }, height: { ideal: 2160 } },
          audio: true,
        })
        .then((stream: MediaStream) => {
          // setStream(stream)
          streamRef.current = stream
          if (selfVideoRef.current) {
            selfVideoRef.current.srcObject = stream
          }
        })
        .catch(() => {
          setGetUserMediaNotSupported(true)
        })
    }

    socket.current.on("usernameAlreadyTaken", () => {
      setUsername("")
      setErrorMsg(
        `Username ${username} is already taken! Please choose another one`
      )
    })

    socket.current.on("notAllowed", () => {
      Router.push("/")
    })

    socket.current.on("selfId", (id: string) => {
      setSelfId(id)
    })

    socket.current.on("chatConnection", (msg: string) => {
      setChatWelcomeMessage(msg)
    })

    socket.current.on("chatMessages", (msg: Message) => {
      setChatMsgs((prevState) => [...prevState, msg])
    })

    socket.current.on("otherUserMediaNotSupportedPeer", (status: boolean) => {
      setGetUserMediaPeerNotSupported(status)
      chatVideoScreensState.forceTransition("peerNoVideoScreen")
    })

    socket.current.on(
      "removeChatTextMessageAndUpdateMessages",
      (messages: string) => {
        setMessageDeleted(true)
        const bytes = CryptoJS.AES.decrypt(
          messages,
          String(process.env.NEXT_PUBLIC_KEY)
        )
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        setChatMsgs(decryptedData)
      }
    )

    socket.current.on("messageContainsHeartEmoijiGlobal", () => {
      setMessageContainsHeartEmoji(true)
    })

    // Other user is typing
    socket.current.on(
      "chatMessageIsTyping",
      ({ username, status }: Partial<Message>) => {
        setChatUserIsTyping({ username, status })
      }
    )

    // Other user has left the chat
    socket.current.on("userLeftChattr", () => {
      setUserLeftChattrAction()
      chatVideoScreensState.reset()
      youtubeChatWindowScreensState.reset()
      setTimeout(() => setUserLeftChattr(false), 3000)
      if (friendVideoRef.current) {
        friendVideoRef.current.srcObject = null
      }
    })

    socket.current.on("usernameJoined", () => {
      setUserLeftChattr(false)
    })

    socket.current.on("listUsers", (users: User[]) => {
      setListUsers(users)
    })

    socket.current.on("call", (data: Call) => {
      setCaller(data.from)
      setCallerSignal(data.signal)
    })

    socket.current.on("receivingCall", () => {
      setReceivingCall(true)
      chatVideoScreensState.forceTransition("incomingCallScreen.visible")
    })

    socket.current.on("callCancelled", () => {
      setPressedCall(false)
      setCallAccepted(false)
      setReceivingCall(false)
      setCancelCallRequest(true)
      chatVideoScreensState.forceTransition("noVideoScreen")
      youtubeChatWindowScreensState.reset()

      if (friendVideoRef.current) {
        friendVideoRef.current.srcObject = null
      }
    })

    socket.current.on("fileTransferProgressGlobal", (progress: string) => {
      setFileTransferProgress(progress)
    })

    socket.current.on("peerMutedAudio", (status: boolean) => {
      if (status) {
        setPeerAudioMuted(true)
      } else {
        setPeerAudioMuted(false)
      }
    })

    socket.current.on("sendStartGameRequest", (username: string) => {
      setMsg(`${username} wants to play tictactoe`)
      setPlayBarType("game")
      setShowPlayBar(true)
    })

    socket.current.on(
      "playGameAssignPlayersGlobal",
      ({ playerX, playerO }: any) => {
        setPlayerXGlobal(playerX)
        setPlayerOGlobal(playerO)
      }
    )

    socket.current.on("addImageToPhotoGalleryGlobal", (data: any) => {
      setPhotoGallery((prevState) => [data, ...prevState])
    })

    socket.current.on(
      "playGameOtherPlayerAcceptedGlobal",
      (accepted: boolean) => {
        if (accepted) {
          state.forceTransition("yourTurnScreen")
        } else {
          state.reset()
          setResetGame()
        }
      }
    )

    socket.current.on(
      "gameBoardUpdatedGlobal",
      (newBoard: Array<SquareValue | null>) => {
        setBoard(newBoard)
      }
    )
    socket.current.on("gameNextPlayerGlobal", () => {
      setXisNext((prevState) => !prevState)
    })

    socket.current.on("sendingYoutubeUrl", (data: any) => {
      setYoutubeUrl(data.url)
      setYoutubeMetaData(data.meta)
      setPlayBarType("youtube")
      setShowPlayBar(true)
      setMsg(`${data.username} wants to watch ${data.meta.title} with you`)
    })

    socket.current.on(
      "sendingYoutubeVideoAcceptedGlobal",
      (status: boolean) => {
        if (status) {
          chatVideoScreensState.forceTransition("youtubeVideoScreen.visible")
          youtubeChatWindowScreensState.forceTransition("commandScreen")
        } else {
          youtubeChatWindowScreensState.reset()
          chatVideoScreensState.forceTransition("youtubeVideoScreen.hidden")
          setYoutubeUrl("")
        }
      }
    )

    socket.current.on("playYoutubeVideoGlobal", (status?: string) => {
      if (status === "PLAY") {
        setPlayYoutubeVideo(true)
      } else if (status === "PAUSE") {
        setPlayYoutubeVideo(false)
      } else {
        setPlayYoutubeVideo((prevState) => !prevState)
      }
    })

    socket.current.on("rewindYoutubeVideoGlobal", () => {
      setYoutubeVideoRewind(true)
    })

    socket.current.on(
      "sharedScreenRequestGlobal",
      (data: { status: boolean; username: string }) => {
        if (data.status === true) {
          setMsg(`${data.username} wants to share its screen with you`)
          setPlayBarType("screenShare")
          setShowPlayBar(true)
          setSharedVideoScreen(true)
        } else {
          setSharedVideoScreen(false)
          setFlipWebcam(false)
        }
      }
    )

    socket.current.on(
      "sharedScreenRequestAcceptedGlobal",
      (status: boolean) => {
        setSharedVideoScreen(true)
        if (status === true) {
          if (selfPeerRef.current) {
            selfPeerRef.current.replaceTrack(
              oldStreamRef.current,
              newStreamRef.current,
              streamRef.current
            )
          } else if (otherPeerRef.current) {
            otherPeerRef.current.replaceTrack(
              oldStreamRef.current,
              newStreamRef.current,
              streamRef.current
            )
          }
          setScreenSharingStarted(true)
        }
      }
    )
  }, [username])

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
        // video: true,
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
    })

    socket.current.emit("addImageToPhotoGallery", {
      username,
      msg: b64,
      filename,
      id,
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
        <Wrapper animate theatreMode={displayTheatreMode}>
          <LeftColumn
            animate
            theatreMode={displayTheatreMode}
            onMouseDown={(e) => {
              e.persist()
            }}
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
                      streamRef={streamRef}
                    />
                  </motion.div>
                </>
              )}
              <motion.div animate>
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
            delay={5000}
          />
        )}
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
