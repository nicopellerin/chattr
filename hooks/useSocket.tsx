import * as React from "react"
import { useEffect, useRef } from "react"
import Router, { useRouter } from "next/router"
import { useStateDesigner } from "@state-designer/react"
import { useSetRecoilState, useRecoilValue } from "recoil"
import CryptoJS from "crypto-js"
import io from "socket.io-client"
import SimplePeer from "simple-peer"
import getUserMedia from "get-user-media-promise"

import { youtubeChatWindowScreens } from "../components/Chat/YoutubeChatWindow"
import { gameScreens } from "../components/Games/TicTacToe/Game"
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
  pressedCallState,
  getUserMediaNotSupportedState,
  getUserMediaPeerNotSupportedState,
  peerAudioMutedState,
  flipFriendVideoState,
  streamOtherPeerState,
  callAcceptedState,
  receivingCallState,
  shareVideoScreenState,
  sharingScreenState,
  callerState,
  cancelCallRequestState,
  callerSignalState,
  screenSharingStartedState,
  // micVolumeState,
} from "../store/video"
import {
  playerXGlobalState,
  playerOGlobalState,
  boardState,
  xIsNextState,
  resetGameState,
} from "../store/game"
import {
  youtubeUrlState,
  playYoutubeVideoState,
  youtubeVideoRewindState,
  youtubeVideoMetaDataState,
} from "../store/youtube"
import {
  usernameState,
  userLeftChattrState,
  listUsersState,
  selfIdState,
  avatarState,
} from "../store/users"
import { chatVideoScreens } from "../components/Chat/ChatVideo"
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
  const setUserLeftChattrAction = useSetRecoilState(userLeftChattrAction)
  const setFlipFriendVideo = useSetRecoilState(flipFriendVideoState)
  const setStreamOtherPeer = useSetRecoilState(streamOtherPeerState)
  const setCallAccepted = useSetRecoilState(callAcceptedState)
  const setUserLeftChattr = useSetRecoilState(userLeftChattrState)
  const setReceivingCall = useSetRecoilState(receivingCallState)
  const setSharedVideoScreen = useSetRecoilState(shareVideoScreenState)
  const setSharingScreen = useSetRecoilState(sharingScreenState)
  const setSelfId = useSetRecoilState(selfIdState)
  const setCaller = useSetRecoilState(callerState)
  const setCallerSignal = useSetRecoilState(callerSignalState)
  const setCancelCallRequest = useSetRecoilState(cancelCallRequestState)
  const setScreenSharingStarted = useSetRecoilState(screenSharingStartedState)
  const setMessageDeleted = useSetRecoilState(messageDeletedState)

  const username = useRecoilValue(usernameState)
  const avatar = useRecoilValue(avatarState)
  // const micVolume = useRecoilValue(micVolumeState)

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

    socket.current = io.connect(`/?room=${room}`, {
      transportOptions: {
        polling: {
          extraHeaders: {
            "x-username": JSON.stringify(username || tempUsername),
            "x-avatar": JSON.stringify(avatar),
          },
        },
      },
    })

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      getUserMedia({
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        },
        audio: {
          optional: [
            { echoCancellation: true },
            { noiseSuppression: true },
            // { autoGainControl: true },
            { googEchoCancellation: true },
            { googEchoCancellation2: true },
            { googNoiseSuppression: true },
            { googNoiseSuppression2: true },
            // { googAutoGainControl: true },
            // { googAutoGainControl2: true },
            { googHighpassFilter: true },
            { googAudioMirroring: false },
            { sourceId: "default" },
          ],
        },
      })
        .then((stream: MediaStream) => {
          streamRef.current = stream
          if (selfVideoRef.current) {
            selfVideoRef.current.srcObject = stream
          }
          // console.log(gainNodeRef.current)
          // const audioTrack = streamRef?.current?.getAudioTracks()[0]
          // const ctx = new AudioContext()
          // const src = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
          // const dst = ctx.createMediaStreamDestination()
          // const gainNode = ctx.createGain()
          // gainNode.gain.setValueAtTime(gainNodeRef.current, ctx.currentTime)
          // ;[src, gainNode, dst].reduce((a, b) => a && a.connect(b))
          // streamRef?.current?.removeTrack(audioTrack)
          // streamRef?.current?.addTrack(dst.stream.getAudioTracks()[0])
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
      setStreamOtherPeer(null)
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
          // newStreamRef.current.dispatchEvent(new Event("ended"))
        }
      }
    )

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
