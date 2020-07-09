import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"

import {
  youtubeProgressBarWidthState,
  playYoutubeVideoState,
} from "../../store/youtube"

const YoutubeProgressBar = ({ youtubePlayerRef }) => {
  const playYoutubeVideo = useRecoilValue(playYoutubeVideoState)
  const setYoutubeProgressBarWidth = useSetRecoilState(
    youtubeProgressBarWidthState
  )

  const progress = (percent: number) => {
    const barWidth = (percent * 800) / 100
    setYoutubeProgressBarWidth(barWidth)
  }

  const width = useRecoilValue(youtubeProgressBarWidthState)

  useEffect(() => {
    let idx: ReturnType<typeof setInterval>
    if (playYoutubeVideo) {
      idx = setInterval(() => {
        const playerCurrentTime = youtubePlayerRef?.current?.getCurrentTime()
        const playerTotalTime = youtubePlayerRef?.current?.getDuration()
        const playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100
        progress(playerTimeDifference)
      }, 50)
    }

    return () => clearInterval(idx)
  }, [playYoutubeVideo])

  return <Bar style={{ width: width }} />
}

export default YoutubeProgressBar

// Styles
const Bar = styled.div`
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  height: 5px;
  opacity: 0.2;
`
