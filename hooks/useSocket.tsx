import * as React from "react"
import { useEffect, useRef } from "react"
import Router, { useRouter } from "next/router"
import { useStateDesigner } from "@state-designer/react"
import { useSetRecoilState, useRecoilValue } from "recoil"
import CryptoJS from "crypto-js"
import io from "socket.io-client"
import SimplePeer from "simple-peer"
import "webrtc-adapter"

import {
  photoGalleryState,
  fileTransferProgressState,
  chatWelcomeMessageState,
  chatUserIsTypingState,
  chatWindowState,
  messageContainsHeartEmojiState,
  showPlayBarState,
  userLeftChattrAction,
  messageDeletedState,
} from "../store/chat"
import {
  getUserMediaNotSupportedState,
  getUserMediaPeerNotSupportedState,
  peerAudioMutedState,
  flipFriendVideoState,
  receivingCallState,
  shareVideoScreenState,
  sharingScreenState,
  callerState,
  callerSignalState,
  screenSharingStartedState,
  cancelCallAction,
  chatVideoScreens,
  peerClosedVideoState,
  // micVolumeState,
} from "../store/video"
import {
  playerXGlobalState,
  playerOGlobalState,
  boardState,
  xIsNextState,
  resetGameState,
  gameScreens,
} from "../store/game"
import {
  youtubeUrlState,
  playYoutubeVideoState,
  youtubeVideoRewindState,
  youtubeVideoMetaDataState,
  youtubeChatWindowScreens,
} from "../store/youtube"
import {
  usernameState,
  userLeftChattrState,
  listUsersState,
  selfIdState,
  avatarState,
} from "../store/users"

import { Message, Call, User } from "../models"

enum SquareValue {
  X = "X",
  O = "O",
}

interface Props {
  setMsg: React.Dispatch<React.SetStateAction<string>>
  setPlayBarType: React.Dispatch<React.SetStateAction<string>>
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>
  setFlipWebcam: React.Dispatch<React.SetStateAction<boolean>>
}

const useSocket = ({
  setMsg,
  setPlayBarType,
  setErrorMsg,
  setFlipWebcam,
}: Props) => {
  const youtubeChatWindowScreensState = useStateDesigner(
    youtubeChatWindowScreens
  )
  const state = useStateDesigner(gameScreens)
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)

  const setPhotoGallery = useSetRecoilState(photoGalleryState)
  const setListUsers = useSetRecoilState(listUsersState)
  const setFileTransferProgress = useSetRecoilState(fileTransferProgressState)
  const setChatWelcomeMessage = useSetRecoilState(chatWelcomeMessageState)
  const setChatUserIsTyping = useSetRecoilState(chatUserIsTypingState)
  const setChatMsgs = useSetRecoilState(chatWindowState)
  const setGetUserMediaNotSupported = useSetRecoilState(
    getUserMediaNotSupportedState
  )
  const setGetUserMediaPeerNotSupported = useSetRecoilState(
    getUserMediaPeerNotSupportedState
  )
  const setPeerAudioMuted = useSetRecoilState(peerAudioMutedState)
  const setPeerClosedVideo = useSetRecoilState(peerClosedVideoState)
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
  const setUserLeftChattrAction = useSetRecoilState(userLeftChattrAction)
  const setFlipFriendVideo = useSetRecoilState(flipFriendVideoState)
  const setUserLeftChattr = useSetRecoilState(userLeftChattrState)
  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setSharedVideoScreen = useSetRecoilState(shareVideoScreenState)
  const setSharingScreen = useSetRecoilState(sharingScreenState)
  const setSelfId = useSetRecoilState(selfIdState)
  const setCaller = useSetRecoilState(callerState)
  const setCallerSignal = useSetRecoilState(callerSignalState)
  const setScreenSharingStarted = useSetRecoilState(screenSharingStartedState)
  const setMessageDeleted = useSetRecoilState(messageDeletedState)
  const setCancelCallAction = useSetRecoilState(cancelCallAction)

  const username = useRecoilValue(usernameState)
  const avatar = useRecoilValue(avatarState)

  const socket = useRef() as React.MutableRefObject<SocketIOClient.Socket>
  const selfVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const friendVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>

  const selfPeerRef = useRef() as React.MutableRefObject<SimplePeer.Instance>
  const otherPeerRef = useRef() as React.MutableRefObject<SimplePeer.Instance>

  const oldStreamRef = useRef() as React.MutableRefObject<MediaStreamTrack>
  const newStreamRef = useRef() as React.MutableRefObject<MediaStreamTrack>

  const streamRef = useRef() as React.MutableRefObject<MediaStream>

  const { query } = useRouter()

  const room = query["room"]

  useEffect(() => {
    const tempUsername = "Anonymous"

    socket.current = io.connect(`/`, {
      query: {
        room,
        username: username || tempUsername,
        avatar: avatar,
      },
    })

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          },
          audio: true,
        })
        .then((stream: MediaStream) => {
          streamRef.current = stream
          if (selfVideoRef.current) {
            selfVideoRef.current.srcObject = stream
          }
        })
        .catch(() => {
          socket.current.emit("otherUserMediaNotSupported", true)
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
      console.log("PEER NOPT SUPORT")
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
      setCancelCallAction()
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

    socket.current.on("peerClosedVideo", (status: boolean) => {
      if (status) {
        setPeerClosedVideo(true)
      } else {
        setPeerClosedVideo(false)
      }
    })

    // Tictactoe game events
    // ------------------------------------------------------
    //
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
    // ------------------------------------------------------
    //

    // Photo gallery events
    // ------------------------------------------------------
    //
    socket.current.on("addImageToPhotoGalleryGlobal", (data: any) => {
      setPhotoGallery((prevState) => [data, ...prevState])
    })
    // ------------------------------------------------------
    //

    // Youtube events
    // ------------------------------------------------------
    //
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
          setShowPlayBar(false)
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
    //
    // ------------------------------------------------------
    //

    // Sharing screen events
    // ------------------------------------------------------
    //
    socket.current.on(
      "sharedScreenRequestGlobal",
      (data: { status: boolean; username: string }) => {
        if (data.status === true) {
          setMsg(`${data.username} wants to share its screen with you`)
          setPlayBarType("screenShare")
          setShowPlayBar(true)
        } else {
          setSharedVideoScreen(false)
          setFlipWebcam(false)
        }
      }
    )

    socket.current.on(
      "sharedScreenRequestAcceptedGlobal",
      (status: boolean) => {
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
          setSharingScreen(true)
        } else {
          newStreamRef.current.stop()
          setSharingScreen(false)
        }
      }
    )
    // ------------------------------------------------------
    //

    socket.current.on("flipFriendVideo", (status: boolean) => {
      setFlipFriendVideo(status)
    })
  }, [username])

  return {
    socket,
    selfVideoRef,
    friendVideoRef,
    oldStreamRef,
    newStreamRef,
    selfPeerRef,
    otherPeerRef,
    streamRef,
  }
}

export default useSocket
