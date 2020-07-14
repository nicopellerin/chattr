import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue, useRecoilState } from "recoil"
import {
  FaExpand,
  FaMicrophoneSlash,
  FaLaptop,
  FaCamera,
  FaRedoAlt,
} from "react-icons/fa"
import dynamic from "next/dynamic"
import { createState } from "@state-designer/core"
import { useStateDesigner } from "@state-designer/react"
import { saveAs } from "file-saver"
import { detect } from "detect-browser"

import ChatScreenWaitingForConnect from "./ChatScreenWaitingForConnect"

const ChatScreenCalling = dynamic(() => import("./ChatScreenCalling"), {
  ssr: false,
})
const ChatScreenNoVideo = dynamic(() => import("./ChatScreenNoVideo"), {
  ssr: false,
})
const ChatScreenIncomingCall = dynamic(
  () => import("./ChatScreenIncomingCall"),
  {
    ssr: false,
  }
)
const ChatScreenNotSupported = dynamic(
  () => import("./ChatScreenNotSupported"),
  {
    ssr: false,
  }
)
const ChatScreenPeerNoVideo = dynamic(() => import("./ChatScreenPeerNoVideo"), {
  ssr: false,
})

import YoutubeVideoScreen from "./YoutubeVideoScreen"

const Slider = dynamic(() => import("./Slider"), { ssr: false })
const ChatScreenHeart = dynamic(() => import("./ChatScreenHeart"), {
  ssr: false,
})

import {
  showSelfWebcamState,
  callAcceptedState,
  getUserMediaNotSupportedState,
  displayTheatreModeState,
  peerAudioMutedQuery,
  streamOtherPeerState,
  screenSharingStartedState,
  shareVideoScreenState,
  flipSelfVideoState,
  flipFriendVideoState,
  sharingScreenState,
} from "../../store/video"
import {
  listUsersState,
  userSoundOnState,
  otherUsernameQuery,
} from "../../store/users"
import { messageContainsHeartEmojiState } from "../../store/chat"

export const chatVideoScreens = createState({
  id: "chatTextWindowScreens",
  initial: "waitingForConnectionScreen",
  states: {
    waitingForConnectionScreen: {},
    callingScreen: {
      initial: "hidden",
      states: {
        hidden: {},
        visible: {},
      },
    },
    noVideoScreen: {},
    peerNoVideoScreen: {},
    incomingCallScreen: {
      initial: "hidden",
      states: {
        hidden: {},
        visible: {},
      },
    },
    youtubeVideoScreen: {
      initial: "hidden",
      states: {
        hidden: {},
        visible: {},
      },
    },
  },
})

export const catSliderScreen = createState({
  id: "catSliderScreen",
  initial: "hidden",
  states: {
    hidden: {
      on: { SHOW: { secretlyTo: "visible" } },
    },
    visible: {
      on: { SHOW: { secretlyTo: "hidden" } },
    },
  },
})

interface Props {
  acceptCall: () => void
  selfVideoRef: React.MutableRefObject<HTMLVideoElement>
  friendVideoRef: React.MutableRefObject<HTMLVideoElement>
  socket: React.MutableRefObject<SocketIOClient.Socket>
  streamRef: React.MutableRefObject<MediaStream>
  shareScreen: () => void
  flipWebcam: boolean
}

const ChatVideo: React.FC<Props> = ({
  acceptCall,
  selfVideoRef,
  friendVideoRef,
  socket,
  streamRef,
  shareScreen,
  flipWebcam,
}) => {
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)
  const catSliderScreenState = useStateDesigner(catSliderScreen)

  const showWebcam = useRecoilValue(showSelfWebcamState)
  const callAccepted = useRecoilValue(callAcceptedState)
  const listUsers = useRecoilValue(listUsersState)
  const getUserMediaNotSupported = useRecoilValue(getUserMediaNotSupportedState)
  const soundOn = useRecoilValue(userSoundOnState)
  const peerAudioMuted = useRecoilValue(peerAudioMutedQuery)
  const otherUsername = useRecoilValue(otherUsernameQuery)
  const streamOtherPeer = useRecoilValue(streamOtherPeerState)
  const screenSharingStarted = useRecoilValue(screenSharingStartedState)
  const shareVideoScreen = useRecoilValue(shareVideoScreenState)
  const flipFriendVideo = useRecoilValue(flipFriendVideoState)
  const sharingScreen = useRecoilValue(sharingScreenState)

  const [
    messageContainsHeartEmoji,
    setMessageContainsHeartEmoji,
  ] = useRecoilState(messageContainsHeartEmojiState)
  const [displayTheatreMode, setDisplayTheatreMode] = useRecoilState(
    displayTheatreModeState
  )
  const [flipSelfVideo, setFlipSelfVideo] = useRecoilState(flipSelfVideoState)

  const contraintsRef = useRef() as React.Ref<HTMLDivElement>
  const friendVideoCanvasRef = useRef() as React.MutableRefObject<
    HTMLCanvasElement
  >

  let sound = new Audio("/sounds/expand.mp3")
  sound.volume = 0.4

  useEffect(() => {
    if (listUsers?.length > 1) {
      chatVideoScreensState.forceTransition("noVideoScreen")
    } else {
      chatVideoScreensState.forceTransition("waitingForConnectionScreen")
    }
  }, [listUsers])

  // Removes heart animation from screen
  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (messageContainsHeartEmoji) {
      idx = setTimeout(() => setMessageContainsHeartEmoji(false), 3000)
    }
    return () => clearTimeout(idx)
  }, [messageContainsHeartEmoji])

  const browser = detect()

  const supported = browser?.name !== "firefox"

  // Capture screenshot when in screen-sharing mode
  const captureScreenshot = () => {
    const mediaStreamTrack = streamOtherPeer?.getVideoTracks()[0]
    // @ts-ignore
    const imageCapture = new ImageCapture(mediaStreamTrack)

    imageCapture
      .grabFrame()
      .then((bitmap: any) => {
        let canvas = friendVideoCanvasRef.current
        let context = canvas.getContext("2d")
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        context!.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height)
        const data = canvas.toDataURL("image/png")
        const src = encodeURI(data)
        const filename = `Chattr-Screenshot-${new Date().getTime()}`
        saveAs(src, filename)
      })
      .catch((error: Error) => console.error("takePhoto() error:", error))
  }

  useEffect(() => {
    socket?.current?.emit("flipSelfVideo", flipSelfVideo)
  }, [flipSelfVideo])

  const flipSelfVideoAction = () => {
    setFlipSelfVideo((prevState) => !prevState)
  }

  // If streaming is not supported
  if (getUserMediaNotSupported) {
    socket.current.emit("otherUserMediaNotSupported", true)
    return (
      <Wrapper
        isYoutubeVideo={chatVideoScreensState.isIn(
          "youtubeVideoScreen.visible"
        )}
        ref={contraintsRef}
      >
        <ChatScreenNotSupported />
      </Wrapper>
    )
  }

  return (
    <Wrapper
      animate
      ref={contraintsRef}
      isYoutubeVideo={chatVideoScreensState.isIn("youtubeVideoScreen.visible")}
    >
      {chatVideoScreensState.whenIn({
        waitingForConnectionScreen: <ChatScreenWaitingForConnect />,
        "callingScreen.visible": <ChatScreenCalling />,
        noVideoScreen: <ChatScreenNoVideo />,
        peerNoVideoScreen: <ChatScreenPeerNoVideo />,
        "incomingCallScreen.visible": (
          <ChatScreenIncomingCall acceptCall={acceptCall} socket={socket} />
        ),
        "youtubeVideoScreen.visible": (
          <YoutubeVideoScreen socket={socket} streamRef={streamRef} />
        ),
      })}
      {catSliderScreenState.whenIn({
        visible: (
          <AnimatePresence>
            <Slider />
          </AnimatePresence>
        ),
      })}
      <>
        <>
          <SelfVideoWrapper
            animate
            drag
            dragMomentum={false}
            // @ts-ignore
            dragConstraints={contraintsRef}
            theatreMode={displayTheatreMode}
            showWebcam={showWebcam}
          >
            <SelfVideo
              muted
              style={{
                visibility: chatVideoScreensState.isIn(
                  "youtubeVideoScreen.visible"
                )
                  ? "hidden"
                  : "visible",
              }}
              animate={{ scaleX: flipSelfVideo ? 1 : -1 }}
              ref={selfVideoRef}
              playsInline
              autoPlay
            />
            {!sharingScreen && <RotateIcon onClick={flipSelfVideoAction} />}
          </SelfVideoWrapper>
          <AnimatePresence>
            {messageContainsHeartEmoji &&
              callAccepted &&
              listUsers?.length >= 2 && <ChatScreenHeart />}
          </AnimatePresence>
          <AnimatePresence>
            {screenSharingStarted && (
              <ScreenSharingStartedText
                initial={{ opacity: 0, x: "-50%", y: "-50%" }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Screen sharing started
              </ScreenSharingStartedText>
            )}
          </AnimatePresence>
          <FriendVideo
            style={{
              visibility: chatVideoScreensState.isIn(
                "youtubeVideoScreen.visible"
              )
                ? "hidden"
                : "visible",
              // transform: flipWebcam ? `scaleX(1)` : `scaleX(-1)`,
            }}
            animate={{ scaleX: flipFriendVideo || flipWebcam ? 1 : -1 }}
            theatreMode={displayTheatreMode}
            ref={friendVideoRef}
            playsInline
            autoPlay
          />
          <canvas hidden ref={friendVideoCanvasRef} />
          {peerAudioMuted && (
            <FriendAudioMuted animate={{ y: [10, 0], opacity: [0, 1] }}>
              {otherUsername} muted mic{" "}
              <FaMicrophoneSlash style={{ marginLeft: 5 }} />
            </FriendAudioMuted>
          )}
        </>
        {streamOtherPeer &&
          !chatVideoScreensState.isIn("youtubeVideoScreen.visible") && (
            <ShareScreenButton
              title="Share screen"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1, scale: 1.02 }}
              disabled={
                !streamOtherPeer ||
                chatVideoScreensState.isIn("youtubeVideoScreen.visible")
              }
              onClick={() => {
                shareScreen()
              }}
            >
              <FaLaptop />
            </ShareScreenButton>
          )}
        {shareVideoScreen && supported && (
          <ScreenshotButton
            title="Take screenshot"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1, scale: 1.02 }}
            onClick={captureScreenshot}
          >
            <FaCamera />
          </ScreenshotButton>
        )}
        <ExpandButton
          title="Theatre mode"
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.02 }}
          onClick={() => {
            if (soundOn) {
              sound.play()
              sound.volume = 0.3
            }
            setDisplayTheatreMode((prevState) => !prevState)
          }}
        >
          <FaExpand />
        </ExpandButton>
      </>
    </Wrapper>
  )
}

export default ChatVideo

// Styles
const Wrapper = styled(motion.div)`
  height: 100%;
  width: 100%;
  position: relative;
  background: ${(props: { isYoutubeVideo: boolean }) =>
    props.isYoutubeVideo ? "none" : "#050306"};
  margin: 0;
  padding: 0;
  border-radius: 5px;
  z-index: 100;
`

const FriendVideo = styled(motion.video)`
  height: 100%;
  max-height: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "85vh" : "670px"};
  width: 100%;
  margin: 0;
  padding: 0;
  /* -webkit-transform: scaleX(-1);
  transform: scaleX(-1); */

  @media (max-width: 500px) {
    height: 300px;
  }
`

const FriendAudioMuted = styled(motion.span)`
  position: absolute;
  right: 6rem;
  bottom: 1.45rem;
  font-size: 1.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  z-index: 20;
  display: flex;
  align-items: center;
  margin: 0;
`

const SelfVideoWrapper = styled(motion.div)`
  height: 130px;
  width: 200px;
  opacity: ${(props: { showWebcam: boolean }) => (props.showWebcam ? 1 : 0)};
  display: ${(props: { theatreMode: boolean; showWebcam: boolean }) =>
    props.theatreMode ? "none" : "block"};
  position: absolute;
  bottom: 3vh;
  left: 3vh;
  z-index: 19;
`

const SelfVideo = styled(motion.video)`
  height: 130px;
  width: 200px;
  object-fit: cover;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  cursor: move;

  @media (max-width: 500px) {
    display: none;
  }
`

const RotateIcon = styled(FaRedoAlt)`
  position: absolute;
  right: 1rem;
  bottom: 0.8rem;
  font-size: 1.7rem;
  color: var(--secondaryColor);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms ease-in-out;

  ${SelfVideoWrapper}:hover & {
    opacity: 1;
  }
`

const ExpandButton = styled(motion.button)`
  background: transparent;
  outline: transparent;
  border: none;
  color: #ffe9ff;
  font-size: 2.4rem;
  cursor: pointer;
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  z-index: 210000;
`

const ShareScreenButton = styled(ExpandButton)`
  bottom: 4.5rem;

  &:disabled {
    pointer-events: none;
    cursor: initial;
  }
`

const ScreenshotButton = styled(ExpandButton)`
  bottom: 8.5rem;

  &:disabled {
    pointer-events: none;
    cursor: initial;
  }
`

const ScreenSharingStartedText = styled(motion.h2)`
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 4rem;
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 4000;
`
