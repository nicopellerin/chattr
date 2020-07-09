import * as React from "react"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { FaPlayCircle } from "react-icons/fa"
// import html2canvas from "html2canvas"

import YoutubeProgressBar from "./YoutubeProgressBar"

import {
  showSelfWebcamState,
  streamState,
  streamOtherPeerState,
} from "../../store/video"
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
}

const YoutubeVideoScreen: React.FC<Props> = ({ socket }) => {
  const showWebcam = useRecoilValue(showSelfWebcamState)
  const youtubeUrl = useRecoilValue(youtubeUrlState)
  const stream = useRecoilValue(streamState)
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
  const selfVideo2Ref = useRef() as React.MutableRefObject<HTMLVideoElement>
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

  // const downloadOgImage = async () => {
  //   html2canvas(youtubeVideoRef.current, {
  //     scale: 2,
  //     scrollX: -7.5,
  //     scrollY: -window.scrollY,
  //     useCORS: true,
  //   }).then((canvas: HTMLCanvasElement) => {
  //     const data = canvas.toDataURL("image/png")
  //     const src = encodeURI(data)
  //     console.log(src)
  //     const filename = `og-image-${new Date().getTime()}`
  //     // saveAs(src, filename)
  //   })
  // }

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
    if (selfVideo2Ref.current) {
      selfVideo2Ref.current.srcObject = stream
      friendVideoRef.current.srcObject = streamOtherPeer
    }
  }, [stream])

  useEffect(() => {
    if (friendVideoRef.current) {
      friendVideoRef.current.srcObject = streamOtherPeer
    }
  }, [streamOtherPeer])

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container animate>
        <YoutubeVideoWrapper
          ref={youtubeVideoRef}
          isPlaying={playYoutubeVideo}
          onClick={() => socket.current.emit("playYoutubeVideo")}
        >
          <YoutubeVideo animate id="player" />
          <AnimatePresence>
            {!playYoutubeVideo && (
              <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ActionButton
                  animate
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlayCircle />
                </ActionButton>
                <Title animate>
                  Press play to {videoPaused ? "resume" : "start"} video
                </Title>
              </Overlay>
            )}
          </AnimatePresence>
          <YoutubeProgressBar youtubePlayerRef={youtubePlayerRef} />
        </YoutubeVideoWrapper>
        <VideoContainer>
          <WebcamVideoWrapper>
            <SelfVideo
              muted
              initial={{ scaleX: -1 }}
              animate={{ scaleX: -1 }}
              exit={{ scaleX: 0 }}
              ref={selfVideo2Ref}
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
  z-index: 10000;
  background: none;
`

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
  height: 100%;
  width: 100%;
`

const VideoContainer = styled.div`
  display: grid;
  width: auto;
  grid-template-columns: auto auto;
  justify-content: center;
  justify-items: center;
  padding: 2rem;
  border-radius: 5px;
  /* filter: drop-shadow(0 0.75rem 10rem rgba(131, 82, 253, 0.15)); */
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.01),
    rgba(156, 116, 254, 0.05)
  );
`

const YoutubeVideoWrapper = styled.div`
  height: 390px;
  width: 800px;
  position: relative;
  margin-bottom: 3rem;
  /* pointer-events: none; */
  ${(props: { isPlaying: boolean }) =>
    props.isPlaying &&
    `filter: drop-shadow(0 0.75rem 10rem rgba(131, 82, 253, 0.35))`}
`

const YoutubeVideo = styled(motion.div)`
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.01),
    rgba(156, 116, 254, 0.05)
  );
  padding: 2rem;
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
