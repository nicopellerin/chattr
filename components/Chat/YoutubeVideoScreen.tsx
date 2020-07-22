import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { FaPlayCircle } from "react-icons/fa"

import YoutubeProgressBar from "./YoutubeProgressBar"

import { showSelfWebcamState, streamOtherPeerState } from "../../store/video"
import {
  youtubeUrlState,
  playYoutubeVideoState,
  youtubeVideoMuteSoundState,
  youtubeVideoRewindState,
  youtubeProgressBarWidthState,
} from "../../store/youtube"
import { usernameState, otherUsernameQuery } from "../../store/users"

import { youtubeReady } from "../../utils/youtubeReady"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
  streamRef: React.MutableRefObject<MediaStream>
}

const YoutubeVideoScreen: React.FC<Props> = ({ socket, streamRef }) => {
  const showWebcam = useRecoilValue(showSelfWebcamState)
  const youtubeUrl = useRecoilValue(youtubeUrlState)
  const streamOtherPeer = useRecoilValue(streamOtherPeerState)
  const username = useRecoilValue(usernameState)
  const otherUsername = useRecoilValue(otherUsernameQuery)
  const youtubeVideoRewind = useRecoilValue(youtubeVideoRewindState)

  const [playYoutubeVideo, setPlayYoutubeVideo] = useRecoilState(
    playYoutubeVideoState
  )
  const [youtubeVideoMuteSound, setYoutubeVideoMuteSound] = useRecoilState(
    youtubeVideoMuteSoundState
  )

  const setYoutubeProgressBarWidth = useSetRecoilState(
    youtubeProgressBarWidthState
  )

  const [videoPaused, setVideoPaused] = useState(false)

  const youtubePlayerRef = useRef() as React.MutableRefObject<any>
  const selfVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const friendVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>
  const youtubeVideoRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const playVideo = () => {
    youtubePlayerRef?.current?.playVideo()
  }

  const pauseVideo = () => {
    youtubePlayerRef?.current?.pauseVideo()
  }

  const stopVideo = () => {
    youtubePlayerRef?.current?.stopVideo()
  }

  const rewindVideo = () => {
    youtubePlayerRef?.current?.seekTo(0)
    stopVideo()
    setYoutubeProgressBarWidth(0)
    setPlayYoutubeVideo(false)
    setYoutubeVideoMuteSound(false)
  }

  const loadVideo = () => {
    youtubePlayerRef?.current?.loadVideoById(youtubeUrl.split("=")[1])
  }

  useEffect(() => {
    if (youtubeVideoMuteSound) {
      youtubePlayerRef?.current?.mute()
    } else {
      youtubePlayerRef?.current?.unMute()
    }
  }, [youtubeVideoMuteSound])

  useEffect(() => {
    youtubeReady.then((YT: any) => {
      const player = new YT.Player("player", {
        height: "390",
        width: "800",
        playerVars: {
          autoplay: 0,
          controls: 0,
          iv_load_policy: 3,
          disablekb: 1,
          modestbranding: 1,
          fs: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })

      youtubePlayerRef.current = player
    })
  }, [])

  useEffect(() => {
    // @ts-ignore
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      let firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    } else {
      loadVideo()
    }
  }, [])

  // Play/pause video
  useEffect(() => {
    if (playYoutubeVideo) {
      playVideo()
    } else {
      pauseVideo()
    }
  }, [playYoutubeVideo])

  // Video has ended
  const onPlayerStateChange = (event: any) => {
    switch (event.data) {
      case 0:
        setPlayYoutubeVideo(false)
        stopVideo()
        break
      case 1:
        setVideoPaused(false)
        socket.current.emit("playYoutubeVideo", "PLAY")
        break
      case 2:
        setVideoPaused(true)
        socket.current.emit("playYoutubeVideo", "PAUSE")
        break
    }
  }

  // Load video
  const onPlayerReady = () => {
    loadVideo()
    rewindVideo()
    stopVideo()
  }

  useEffect(() => {
    if (youtubeVideoRewind) {
      rewindVideo()
    }
  }, [youtubeVideoRewind])

  useEffect(() => {
    if (selfVideoRef.current) {
      selfVideoRef.current.srcObject = streamRef?.current
      friendVideoRef.current.srcObject = streamOtherPeer
    }
  }, [streamRef?.current])

  useEffect(() => {
    if (friendVideoRef.current) {
      friendVideoRef.current.srcObject = streamOtherPeer
    }
  }, [streamOtherPeer])

  return (
    <Wrapper
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Container layout>
        <YoutubeVideoWrapper
          ref={youtubeVideoRef}
          isPlaying={playYoutubeVideo}
          onClick={() => socket.current.emit("playYoutubeVideo")}
        >
          <React.Suspense fallback={null}>
            <YoutubeVideo animate id="player" />
          </React.Suspense>
          <AnimatePresence>
            {!playYoutubeVideo && (
              <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ActionButton
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlayCircle />
                </ActionButton>
                <Title layout>
                  Press play to {videoPaused ? "resume" : "start"} video
                </Title>
              </Overlay>
            )}
          </AnimatePresence>
        </YoutubeVideoWrapper>
        <YoutubeProgressBar
          youtubePlayerRef={youtubePlayerRef}
          socket={socket}
        />
        <React.Suspense fallback={null}>
          <VideoContainer>
            <WebcamVideoWrapper>
              <SelfVideo
                muted
                initial={{ scaleX: -1 }}
                animate={{ scaleX: -1 }}
                exit={{ scaleX: 0 }}
                ref={selfVideoRef}
                playsInline
                autoPlay
                showWebcam={showWebcam}
              />
              <Underlay>
                <WebcamUsername>{username}</WebcamUsername>
              </Underlay>
            </WebcamVideoWrapper>
            <WebcamVideoWrapper>
              <Underlay>
                <WebcamOtherUsername>{otherUsername}</WebcamOtherUsername>
              </Underlay>
              <FriendVideo
                initial={{ scaleX: -1 }}
                animate={{ scaleX: -1 }}
                exit={{ scaleX: 0 }}
                ref={friendVideoRef}
                playsInline
                autoPlay
              />
            </WebcamVideoWrapper>
          </VideoContainer>
        </React.Suspense>
      </Container>
    </Wrapper>
  )
}

export default YoutubeVideoScreen

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 9000;
  background: none;
`

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  border-radius: 5px;
  z-index: 2;
  height: 100%;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1440px) {
    max-width: 1000px;
  }
`

const VideoContainer = styled.div`
  display: grid;
  width: auto;
  grid-template-columns: auto auto;
  justify-content: center;
  justify-items: center;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 0.7rem 5rem rgba(131, 82, 253, 0.1);
  margin-top: 4rem;
  /* background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.01),
    rgba(156, 116, 254, 0.05)
  ); */
`

const YoutubeVideoWrapper = styled.div`
  height: 390px;
  width: 800px;
  position: relative;
  /* pointer-events: none; */
  ${(props: { isPlaying: boolean }) =>
    props.isPlaying && `box-shadow: 0 0.7rem 5rem rgba(131, 82, 253, 0.1);`}
  margin-bottom: 5px;
`

const YoutubeVideo = styled(motion.div)`
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.01),
    rgba(156, 116, 254, 0.05)
  );
  /* padding: 2rem; */
  border-radius: 5px;
  height: 390px;
  width: 800px;
`

const WebcamVideoWrapper = styled.div`
  position: relative;
  height: 125px;
  width: 275px;
`

const WebcamUsername = styled.h5`
  color: var(--secondaryColor);
  font-size: 2.4rem;
  margin: 0;
`

const WebcamOtherUsername = styled.h5`
  color: var(--tertiaryColor);
  font-size: 2.4rem;
  margin: 0;
`

const FriendVideo = styled(motion.video)`
  height: 125px;
  width: 275px;
  margin: 0;
  padding: 0;
  border-radius: 5px;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  position: relative;
`

const SelfVideo = styled(motion.video)`
  height: 125px;
  width: 275px;
  z-index: 2;
  margin: 0;
  padding: 0;
  border-radius: 5px;
  opacity: ${(props: { showWebcam: boolean }) => (props.showWebcam ? 1 : 0)};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
`

const ActionButton = styled(motion.button)`
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), #9c74fe);
  padding: 1rem;
  border: none;
  border-radius: 50%;
  height: 10rem;
  width: 10rem;
  font-weight: 600;
  font-size: 9rem;
  color: var(--textColor);
  outline: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  cursor: pointer;
`

const Overlay = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 100;
  cursor: pointer;
`

const Title = styled(motion.h3)`
  color: var(--tertiaryColor);
  font-size: 3rem;
  text-align: center;
  width: 100%;
  margin: 0;
`

const Underlay = styled.div`
  position: absolute;
  color: red;
  top: 0;
  left: 0;
  height: 125px;
  width: 275px;
  display: flex;
  justify-content: center;
  align-items: center;
`
