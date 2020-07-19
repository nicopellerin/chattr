import * as React from "react"
import { useEffect, useRef } from "react"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"

import {
  youtubeProgressBarWidthState,
  playYoutubeVideoState,
} from "../../store/youtube"

interface Props {
  youtubePlayerRef: React.MutableRefObject<any>
}

const YoutubeProgressBar: React.FC<Props> = ({ youtubePlayerRef }) => {
  const playYoutubeVideo = useRecoilValue(playYoutubeVideoState)
  const setYoutubeProgressBarWidth = useSetRecoilState(
    youtubeProgressBarWidthState
  )

  const progress = (percent: number) => {
    const barWidth = (percent * 800) / 100
    setYoutubeProgressBarWidth(barWidth)
  }

  const width = useRecoilValue(youtubeProgressBarWidthState)

  const requestRef = useRef() as React.MutableRefObject<
    ReturnType<typeof requestAnimationFrame>
  >

  const barProgress = () => {
    const playerCurrentTime = youtubePlayerRef?.current?.getCurrentTime()
    const playerTotalTime = youtubePlayerRef?.current?.getDuration()
    const playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100
    progress(playerTimeDifference)
    requestRef.current = requestAnimationFrame(barProgress)
  }

  // const handleSeekTo = (e) => {
  //   console.log(e.clientX / 800)
  //   console.log(youtubePlayerRef?.current?.getDuration() * (e.clientX / 800))
  //   // console.log(youtubePlayerRef?.current?.getDuration() / 800)

  //   youtubePlayerRef?.current?.seekTo(
  //     youtubePlayerRef?.current?.getDuration() * (e.clientX / 800)
  //   )
  // }

  useEffect(() => {
    if (playYoutubeVideo) {
      requestRef.current = requestAnimationFrame(barProgress)
    }

    return () => cancelAnimationFrame(requestRef.current)
  }, [playYoutubeVideo])

  return (
    <Bar
      style={{ width: width }}
      // onClick={handleSeekTo}
    />
  )
}

export default YoutubeProgressBar

// Styles
const Bar = styled.div`
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  height: 10px;
  opacity: 0.2;
`
