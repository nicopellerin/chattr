import * as React from "react"
import { useEffect, useRef } from "react"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { motion } from "framer-motion"

import {
  youtubeProgressBarWidthState,
  playYoutubeVideoState,
} from "../../store/youtube"

interface Props {
  youtubePlayerRef: React.MutableRefObject<any>
  handleSeekTo: (e: any) => void
}

const YoutubeProgressBar: React.FC<Props> = ({
  youtubePlayerRef,
  handleSeekTo,
}) => {
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

  useEffect(() => {
    if (playYoutubeVideo) {
      requestRef.current = requestAnimationFrame(barProgress)
    }
    return () => cancelAnimationFrame(requestRef.current)
  }, [playYoutubeVideo])

  return (
    <Wrapper>
      <BarOverlay onClick={handleSeekTo} />
      <Bar style={{ width }} />
    </Wrapper>
  )
}

export default YoutubeProgressBar

// Styles
const Wrapper = styled.div`
  width: 800px;
  height: 10px;
  position: relative;
  background: #112;
  /* margin-top: 5px; */
  /* margin-bottom: 3rem; */
`

const BarOverlay = styled.div`
  width: 800px;
  height: 10px;
  position: absolute;
  left: 0;
  top: 0px;
  background: transparent;
  z-index: 10;
  cursor: pointer;
`

const Bar = styled(motion.div)`
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  position: absolute;
  left: 0;
  top: 0px;
  opacity: 0.3;
  height: 10px;
  transition: 150ms opacity ease-in-out;

  &:after {
    content: "";
    background: linear-gradient(45deg, var(--tertiaryColor), #9c74fe);
    border: 1px solid var(--secondaryColor);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    /* box-shadow: -3px 0 5px rgba(0, 0, 0, 0.5); */
  }

  ${Wrapper}:hover & {
    opacity: 1;
  }
`
