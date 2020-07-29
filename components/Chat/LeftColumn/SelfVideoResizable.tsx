import * as React from "react"
import { useState } from "react"
import styled, { css } from "styled-components"
import { useRecoilValue } from "recoil"
import { Resizable } from "react-resizable"
import { FaRedoAlt } from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"
import { motion } from "framer-motion"

import { chatVideoScreens } from "./ChatVideo"

import {
  showSelfWebcamState,
  sharingScreenState,
  displayTheatreModeState,
  flipSelfVideoState,
} from "../../../store/video"
import { useRecoilState } from "recoil"

interface Props {
  contraintsRef: React.Ref<HTMLDivElement>
  selfVideoRef: any
}

interface StyledProps {
  supported?: boolean
  isYoutubeVideo?: boolean
  theatreMode?: boolean
  showWebcam?: boolean
}

const SelfVideoResizable: React.FC<Props> = ({ selfVideoRef, contraintsRef }) => {
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)

  const showWebcam = useRecoilValue(showSelfWebcamState)
  const sharingScreen = useRecoilValue(sharingScreenState)
  const displayTheatreMode = useRecoilValue(displayTheatreModeState)

  const [flipSelfVideo, setFlipSelfVideo] = useRecoilState(flipSelfVideoState)

  const [element, setElement] = useState({
    style: {
      width: 200,
      height: 130,
    },
  })

  const [isSelected, setIsSelected] = useState(false)

  return (
    <SelfVideoWrapper
      layout={isSelected ? false : true}
      drag={isSelected ? false : true}
      dragMomentum={false}
      // @ts-ignore
      dragConstraints={contraintsRef}
      theatreMode={displayTheatreMode}
      showWebcam={showWebcam}
      onDoubleClick={() => setIsSelected((prevState) => !prevState)}
    >
      <Resizable
        width={element.style.width}
        height={element.style.height}
        lockAspectRatio={true}
        onResize={(_, { size }) => {
          setElement((element) => ({
            ...element,
            style: {
              ...element.style,
              width: Math.round(size.width),
              height: Math.round(size.height),
            },
          }))
        }}
        minConstraints={[150, 90]}
        maxConstraints={[500, 300]}
        resizeHandles={["ne"]}
        handle={(h) => (
          <Handle className={`handle-${h}`} isVisible={isSelected} />
        )}
      >
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
            animate={{ scaleX: flipSelfVideo ? 1 : -1 }}
            ref={selfVideoRef}
            playsInline
            autoPlay
            width={element.style.width}
            height={element.style.height}
            isVisible={isSelected}
          />
          {!sharingScreen && !isSelected && (
            <RotateIcon
              onClick={() => setFlipSelfVideo((prevState) => !prevState)}
            />
          )}
        </>
      </Resizable>
    </SelfVideoWrapper>
  )
}

export default SelfVideoResizable

// Styles
const SelfVideoWrapper = styled(motion.div)`
  opacity: ${(props: StyledProps) => (props.showWebcam ? 1 : 0)};
  display: ${(props: StyledProps) => (props.theatreMode ? "none" : "block")};
  position: absolute;
  bottom: 3vh;
  left: 3vh;
  z-index: 19;
`

const SelfVideo = styled(motion.video)`
  object-fit: cover;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  cursor: move;

  ${(props: { isVisible: boolean }) =>
    props.isVisible &&
    css`
      border: 2px dotted var(--tertiaryColor);
      cursor: initial;
    `}

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

const Handle = styled.span`
  opacity: 0;
  pointer-events: none;
  transition: 0.1s opacity ease-in-out;
  position: absolute;
  right: -17px;
  top: -2px;
  transform: translateX(-50%) rotate(225deg);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--tertiaryColor);
  border-radius: 2px;

  ${(props: { isVisible: boolean }) =>
    props.isVisible &&
    css`
      opacity: 1;
      pointer-events: initial;
    `}

  &.handle-ne {
    cursor: ne-resize;
  }
`