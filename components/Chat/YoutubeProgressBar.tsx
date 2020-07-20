import * as React from "react"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import moment from "moment"
import momentDurationFormatSetup from "moment-duration-format"

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
  // @ts-ignore
  momentDurationFormatSetup(moment)

  const playYoutubeVideo = useRecoilValue(playYoutubeVideoState)
  const setYoutubeProgressBarWidth = useSetRecoilState(
    youtubeProgressBarWidthState
  )

  const progress = (percent: number) => {
    const barWidth = (percent * 800) / 100
    setYoutubeProgressBarWidth(barWidth)
  }

  const width = useRecoilValue(youtubeProgressBarWidthState)

  const [barHovered, setBarHovered] = useState(0)

  const barOverlayRef = useRef() as React.MutableRefObject<HTMLDivElement>
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
      <BarOverlay
        ref={barOverlayRef}
        onClick={(e) => {
          handleSeekTo(e)
          setBarHovered(
            e.clientX - barOverlayRef.current.getBoundingClientRect().left
          )
        }}
        onMouseOut={() => setBarHovered(0)}
      />
      <Bar style={{ width }} />
      <AnimatePresence>
        {barHovered ? (
          <Tooltip
            layout
            initial={{ position: "absolute", top: -55, opacity: 0 }}
            animate={{
              left: barHovered - 21,
              opacity: 1,
            }}
            exit={{ scaleY: 0, opacity: 0 }}
          >
            {moment
              .duration(youtubePlayerRef?.current?.getCurrentTime(), "seconds")
              .format("h:mm:ss")
              .padStart(4, "0:0")}
          </Tooltip>
        ) : null}
      </AnimatePresence>
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

const Tooltip = styled(motion.div)`
  background: #112;
  padding: 1rem;
  color: var(--secondaryColor);
  font-size: 1.5rem;
  font-weight: 600;
  z-index: 11000;
  border-radius: 5px;
  box-shadow: 0 0rem 5px rgba(0, 0, 0, 1);

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -1rem;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #1a0d2b;
    /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); */
    /* filter: drop-shadow(0 0.4rem 5rem rgba(131, 82, 253, 0.15)); */
  }
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
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    /* box-shadow: -3px 0 5px rgba(0, 0, 0, 0.5); */
  }

  ${Wrapper}:hover & {
    opacity: 1;
  }
`
