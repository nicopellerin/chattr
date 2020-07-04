import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue } from "recoil"

import { showSelfWebcamState } from "../../store/video"
import { youtubeUrlState, playYoutubeVideoState } from "../../store/youtube"

interface Props {
  selfVideoRef: React.MutableRefObject<HTMLVideoElement>
  friendVideoRef: React.MutableRefObject<HTMLVideoElement>
}

const YoutubeVideoScreen: React.FC<Props> = ({
  selfVideoRef,
  friendVideoRef,
}) => {
  const showWebcam = useRecoilValue(showSelfWebcamState)
  const youtubeUrl = useRecoilValue(youtubeUrlState)
  const playYoutubeVideo = useRecoilValue(playYoutubeVideoState)

  const youtubePlayerRef = useRef() as React.MutableRefObject<any>
  // const youtubeLoadVideoBtnRef = useRef() as React.MutableRefObject<
  //   HTMLButtonElement
  // >

  console.log("URL", youtubeUrl)

  const loadVideoPlayer = () => {
    // @ts-ignore
    const player = new window.YT.Player("player", {
      height: "390",
      width: "100%",
    })

    youtubePlayerRef.current = player
  }

  useEffect(() => {
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    // @ts-ignore
    window.onYouTubeIframeAPIReady = loadVideoPlayer
  }, [])

  // const loadVideo = () => {
  //   youtubePlayerRef?.current?.loadVideoById(youtubeUrl.split("=")[1])
  // }

  const loadedVideo = useRef(false)

  useEffect(() => {
    if (youtubeUrl || (!playYoutubeVideo && !loadedVideo.current)) {
      youtubePlayerRef?.current?.loadVideoById(youtubeUrl.split("=")[1])
      loadedVideo.current = true
    }
    if (playYoutubeVideo) {
      youtubePlayerRef?.current?.playVideo()
    } else {
      youtubePlayerRef?.current?.pauseVideo()
    }
  }, [youtubeUrl, playYoutubeVideo])

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <YoutubeVideo id="player" />
        <VideoContainer>
          <SelfVideo
            muted
            initial={{ scaleX: -1 }}
            exit={{ scaleX: 0 }}
            ref={selfVideoRef}
            playsInline
            autoPlay
            showWebcam={showWebcam}
          />
          <FriendVideo ref={friendVideoRef} playsInline autoPlay />
        </VideoContainer>
        {/* <button
          hidden
          ref={youtubeLoadVideoBtnRef}
          onClick={loadVideo}
        ></button> */}
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
  background: black;
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
  width: 100%;
  grid-template-columns: auto auto;
  grid-gap: 2rem;
  justify-content: center;
  justify-items: center;
`

const YoutubeVideo = styled.div`
  margin-bottom: 4rem;
`

const FriendVideo = styled.video`
  height: 150px;
  width: 300px;
  margin: 0;
  padding: 0;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  outline: 2px solid red;
`

const SelfVideo = styled(motion.video)`
  height: 150px;
  width: 300px;
  object-fit: cover;
  /* position: absolute;
  bottom: 3vh;
  left: 5vh; */
  z-index: 2;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  opacity: ${(props: { showWebcam: boolean }) => (props.showWebcam ? 1 : 0)};
`
