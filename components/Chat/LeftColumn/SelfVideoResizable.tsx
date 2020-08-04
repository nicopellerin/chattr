import * as React from "react"
import { useState, useEffect } from "react"
import styled, { css } from "styled-components"
import { useRecoilValue, useRecoilState } from "recoil"
import { Resizable } from "react-resizable"
import { FaRedoAlt, FaChevronLeft, FaChevronCircleUp } from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"
import { motion } from "framer-motion"

import { useClickOutside } from "../../../hooks/useClickOutside"

import {
  showSelfWebcamState,
  sharingScreenState,
  displayTheatreModeState,
  flipSelfVideoState,
  chatVideoScreens,
} from "../../../store/video"

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

const SelfVideoResizable: React.FC<Props> = ({
  selfVideoRef,
  contraintsRef,
}) => {
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)

  const showWebcam = useRecoilValue(showSelfWebcamState)
  const sharingScreen = useRecoilValue(sharingScreenState)
  const displayTheatreMode = useRecoilValue(displayTheatreModeState)

  const [flipSelfVideo, setFlipSelfVideo] = useRecoilState(flipSelfVideoState)

  const [element, setElement] = useState({
    style: {
      width: 250,
      height: 130,
    },
  })
  const [isSelected, setIsSelected] = useState(false)
  const [minimizeWindow, setMinimizeWindow] = useState(false)

  const node = useClickOutside(setIsSelected)

  // Launches "resize" on right click
  useEffect(() => {
    node.current.addEventListener("contextmenu", (e: MouseEvent) => {
      e.preventDefault()
      setIsSelected((prevState) => !prevState)
    })

    return () => {
      node.current.removeEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault()
        setIsSelected((prevState) => !prevState)
      })
    }
  }, [])

  return (
    <SelfVideoWrapper
      layout={isSelected ? false : true}
      drag={isSelected ? false : true}
      dragMomentum={false}
      // @ts-ignore
      dragConstraints={contraintsRef}
      theatreMode={displayTheatreMode}
      showWebcam={showWebcam}
      ref={node}
    >
      {minimizeWindow && (
        <MaximizeButton
          whileHover={{ color: "var(--tertiaryColor)" }}
          layout
          onClick={() => setMinimizeWindow(false)}
        >
          <FaChevronCircleUp />
        </MaximizeButton>
      )}
      <Resizable
        width={element.style.width}
        height={element.style.height}
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
        // @ts-ignore
        style={{ position: "relative" }}
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
              width: minimizeWindow ? 0 : element.style.width,
            }}
            animate={{ scaleX: flipSelfVideo ? 1 : -1 }}
            ref={selfVideoRef}
            playsInline
            autoPlay
            width={element.style.width}
            height={element.style.height}
            isVisible={isSelected}
          />
          {!sharingScreen && !isSelected && !minimizeWindow && (
            <RotateIcon
              onClick={() => setFlipSelfVideo((prevState) => !prevState)}
            />
          )}
          {!isSelected && !minimizeWindow && (
            <LeftIcon onClick={() => setMinimizeWindow(true)} />
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
  bottom: 0;
  left: 0;
  z-index: 19;
`

const SelfVideo = styled(motion.video)`
  object-fit: cover;
  margin: 0;
  padding: 0;
  border-radius: 3px;
  cursor: move;
  height: 100%;

  ${(props: { isVisible: boolean }) =>
    props.isVisible &&
    css`
      border: 2px dashed rgba(0, 229, 255, 0.6);
      cursor: initial;
    `}
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

const LeftIcon = styled(FaChevronLeft)`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.4rem;
  color: var(--textColor);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
  background: rgba(72, 35, 201, 0.8);
  border-radius: 50%;
  padding: 3px;

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

const MaximizeButton = styled(motion.button)`
  background: rgba(72, 35, 201, 0.6);
  border: none;
  border-top-right-radius: 50%;
  padding: 1rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
`
