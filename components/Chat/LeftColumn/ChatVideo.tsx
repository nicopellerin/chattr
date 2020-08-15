import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue, useRecoilState } from "recoil"
import { FaExpand, FaMicrophoneSlash, FaLaptop, FaCamera } from "react-icons/fa"
import dynamic from "next/dynamic"
import { useStateDesigner } from "@state-designer/react"
import { saveAs } from "file-saver"
import { detect } from "detect-browser"

import ChatScreenWaitingForConnect from "../Screens/WaitingForConnectScreen"

const ChatScreenCalling = dynamic(() => import("../Screens/CallingScreen"), {
  ssr: false,
})
const ChatScreenNoVideo = dynamic(() => import("../Screens/NoVideoScreen"), {
  ssr: false,
})
const ChatScreenIncomingCall = dynamic(
  () => import("../Screens/IncomingCallScreen"),
  {
    ssr: false,
  }
)
const ChatScreenNotSupported = dynamic(
  () => import("../Screens/NotSupportedScreen"),
  {
    ssr: false,
  }
)
const ChatScreenPeerNoVideo = dynamic(
  () => import("../Screens/NoVideoScreen"),
  {
    ssr: false,
  }
)

import SelfVideoResizable from "./SelfVideoResizable"
import UsersBar from "../Shared/UsersBar"
const Slider = dynamic(() => import("../Shared/Slider"), { ssr: false })

import YoutubeVideoScreen from "../Screens/YoutubeVideoScreen"
const ChatScreenHeart = dynamic(() => import("../Screens/HeartScreen"), {
  ssr: false,
})

import {
  callAcceptedState,
  getUserMediaNotSupportedState,
  displayTheatreModeState,
  peerAudioMutedQuery,
  streamOtherPeerState,
  screenSharingStartedState,
  shareVideoScreenState,
  flipSelfVideoState,
  flipFriendVideoState,
  chatVideoScreens,
  catSliderScreen,
  peerClosedVideoQuery,
} from "../../../store/video"
import {
  listUsersState,
  userSoundOnState,
  otherUsernameQuery,
  toggleOtherUsernameState,
} from "../../../store/users"
import { messageContainsHeartEmojiState } from "../../../store/chat"
import { FilterClasses } from "../../../models"

interface Props {
  acceptCall: () => void
  selfVideoRef: React.MutableRefObject<HTMLVideoElement>
  friendVideoRef: React.MutableRefObject<HTMLVideoElement>
  socket: React.MutableRefObject<SocketIOClient.Socket>
  streamRef: React.MutableRefObject<MediaStream>
  shareScreen: () => void
  flipWebcam: boolean
}

interface StyledProps {
  supported?: boolean
  isYoutubeVideo?: boolean
  theatreMode?: boolean
  showWebcam?: boolean
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
  const flipSelfVideo = useRecoilValue(flipSelfVideoState)
  const toggleOtherUsername = useRecoilValue(toggleOtherUsernameState)
  const peerClosedVideo = useRecoilValue(peerClosedVideoQuery)

  const [
    messageContainsHeartEmoji,
    setMessageContainsHeartEmoji,
  ] = useRecoilState(messageContainsHeartEmojiState)
  const [displayTheatreMode, setDisplayTheatreMode] = useRecoilState(
    displayTheatreModeState
  )

  const [
    videoFilterClassesPeer,
    setVideoFilterClassesPeer,
  ] = useState<FilterClasses | null>()

  const contraintsRef = useRef() as React.Ref<HTMLDivElement>
  const friendVideoCanvasRef = useRef() as React.MutableRefObject<
    HTMLCanvasElement
  >

  let sound = new Audio("/sounds/expand.mp3")
  sound.volume = 0.4

  // If 2 users connected, go to `noVideoScreen`, else `waitingForConnectionScreen`
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

  useEffect(() => {
    socket?.current?.on("videoFilterClassPeer", (type: FilterClasses) => {
      setVideoFilterClassesPeer(type)
    })
  }, [socket?.current])

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
      supported={supported}
      layout
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
          <SelfVideoResizable
            selfVideoRef={selfVideoRef}
            contraintsRef={contraintsRef}
            socket={socket}
          />
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
          <FriendVideoWrapper
            theatreMode={displayTheatreMode}
            layout
            className={videoFilterClassesPeer as string | undefined}
          >
            <FriendVideo
              style={{
                visibility: chatVideoScreensState.isIn(
                  "youtubeVideoScreen.visible"
                )
                  ? "hidden"
                  : "visible",
              }}
              animate={{ scaleX: flipFriendVideo || flipWebcam ? 1 : -1 }}
              ref={friendVideoRef}
              playsInline
              autoPlay
            />
            <canvas hidden ref={friendVideoCanvasRef} />
          </FriendVideoWrapper>
          {peerAudioMuted && (
            <FriendAudioMuted animate={{ y: [10, 0], opacity: [0, 1] }}>
              {otherUsername} muted mic{" "}
              <FaMicrophoneSlash style={{ marginLeft: 5 }} />
            </FriendAudioMuted>
          )}
          {peerClosedVideo && (
            <FriendVideoClosed
              initial={{ x: "-50%", y: "-40%", opacity: 0 }}
              animate={{ y: "-50%", opacity: 1 }}
            >
              {otherUsername} turned off webcam
            </FriendVideoClosed>
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
              onClick={shareScreen}
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
        <AnimatePresence>
          {toggleOtherUsername &&
            listUsers.length > 1 &&
            !chatVideoScreensState.isIn("youtubeVideoScreen.visible") && (
              <UsersBar />
            )}
        </AnimatePresence>
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
  background: ${(props: StyledProps) =>
    props.isYoutubeVideo ? "none" : "#050306"};
  margin: 0;
  padding: 0;
  border-radius: 5px;
  z-index: 100;
  box-shadow: ${(props: StyledProps) =>
    props.isYoutubeVideo ? "none" : "0 0.7rem 5rem rgba(131, 82, 253, 0.1)"};
`

const FriendVideoWrapper = styled(motion.div)`
  height: 100%;
  max-height: ${(props: StyledProps) => (props.theatreMode ? "85vh" : "670px")};
  width: 100%;
  margin: 0;
  padding: 0;
`

const FriendVideo = styled(motion.video)`
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
`

const FriendAudioMuted = styled(motion.span)`
  position: absolute;
  right: 6rem;
  bottom: 2rem;
  font-size: 1.7rem;
  font-weight: 700;
  color: rgba(240, 32, 216, 0.7);
  z-index: 20;
  display: flex;
  align-items: center;
  margin: 0;
`

const FriendVideoClosed = styled(motion.h2)`
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 3rem;
  background: -webkit-linear-gradient(
    140deg,
    rgb(235, 36, 218) -300%,
    var(--textColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ExpandButton = styled(motion.button)`
  background: rgba(72, 35, 201, 0.6);
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: transparent;
  border: none;
  color: #ffe9ff;
  font-size: 2.4rem;
  cursor: pointer;
  position: absolute;
  bottom: 1.5rem;
  right: 1rem;
  z-index: 210000;
`

const ShareScreenButton = styled(ExpandButton)`
  bottom: 5.5rem;

  &:disabled {
    pointer-events: none;
    cursor: initial;
  }
`

const ScreenshotButton = styled(ExpandButton)`
  bottom: 9.5rem;

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
