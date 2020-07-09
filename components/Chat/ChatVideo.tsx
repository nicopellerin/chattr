import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue, useRecoilState } from "recoil"
import { FaExpand, FaMicrophoneSlash } from "react-icons/fa"
import dynamic from "next/dynamic"
import { createState } from "@state-designer/core"

import ChatScreenWaitingForConnect from "./ChatScreenWaitingForConnect"
import ChatScreenCalling from "./ChatScreenCalling"
import ChatScreenNoVideo from "./ChatScreenNoVideo"
import ChatScreenIncomingCall from "./ChatScreenIncomingCall"
import ChatScreenNotSupported from "./ChatScreenNotSupported"
// import ChatScreenVisualiser from "./ChatScreenVisualiser"

const Slider = dynamic(() => import("./Slider"), { ssr: false })
const ChatScreenHeart = dynamic(() => import("./ChatScreenHeart"), {
  ssr: false,
})
import ChatScreenPeerNoVideo from "./ChatScreenPeerNoVideo"

import {
  showSelfWebcamState,
  callAcceptedState,
  getUserMediaNotSupportedState,
  displayTheatreModeState,
  peerAudioMutedQuery,
} from "../../store/video"
import {
  listUsersState,
  userSoundOnState,
  otherUsernameQuery,
} from "../../store/users"
import { messageContainsHeartEmojiState } from "../../store/chat"
import { useStateDesigner } from "@state-designer/react"
import YoutubeVideoScreen from "./YoutubeVideoScreen"

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
}

const ChatVideo: React.FC<Props> = ({
  acceptCall,
  selfVideoRef,
  friendVideoRef,
  socket,
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

  const [
    messageContainsHeartEmoji,
    setMessageContainsHeartEmoji,
  ] = useRecoilState(messageContainsHeartEmojiState)
  const [displayTheatreMode, setDisplayTheatreMode] = useRecoilState(
    displayTheatreModeState
  )

  const contraintsRef = useRef() as React.Ref<HTMLDivElement>

  let sound = new Audio("/sounds/expand.mp3")

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
        "youtubeVideoScreen.visible": <YoutubeVideoScreen socket={socket} />,
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
          <SelfVideo
            muted
            style={{
              visibility: chatVideoScreensState.isIn(
                "youtubeVideoScreen.visible"
              )
                ? "hidden"
                : "visible",
            }}
            initial={{ scaleX: -1 }}
            exit={{ scaleX: 0 }}
            drag
            dragMomentum={false}
            // @ts-ignore
            dragConstraints={contraintsRef}
            ref={selfVideoRef}
            playsInline
            autoPlay
            theatreMode={displayTheatreMode}
            showWebcam={showWebcam}
          />
          <AnimatePresence>
            {messageContainsHeartEmoji &&
              callAccepted &&
              listUsers?.length >= 2 && <ChatScreenHeart />}
          </AnimatePresence>
          <FriendVideo
            style={{
              visibility: chatVideoScreensState.isIn(
                "youtubeVideoScreen.visible"
              )
                ? "hidden"
                : "visible",
            }}
            theatreMode={displayTheatreMode}
            ref={friendVideoRef}
            playsInline
            autoPlay
          />
          {peerAudioMuted && (
            <FriendAudioMuted animate={{ y: [10, 0], opacity: [0, 1] }}>
              {otherUsername} muted mic{" "}
              <FaMicrophoneSlash style={{ marginLeft: 5 }} />
            </FriendAudioMuted>
          )}
        </>
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

const FriendVideo = styled.video`
  height: 100%;
  max-height: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "85vh" : "670px"};
  width: 100%;
  margin: 0;
  padding: 0;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);

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

const SelfVideo = styled(motion.video)`
  height: 130px;
  width: 200px;
  object-fit: cover;
  position: absolute;
  bottom: 3vh;
  left: 3vh;
  z-index: 2111;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  cursor: move;
  opacity: ${(props: { showWebcam: boolean }) => (props.showWebcam ? 1 : 0)};
  display: ${(props: { theatreMode: boolean; showWebcam: boolean }) =>
    props.theatreMode ? "none" : "block"};

  @media (max-width: 500px) {
    display: none;
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
