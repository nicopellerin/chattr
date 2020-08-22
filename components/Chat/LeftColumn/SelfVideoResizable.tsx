import * as React from "react"
import { useState, useEffect } from "react"
import styled, { css } from "styled-components"
import { useRecoilValue, useRecoilState } from "recoil"
import { Resizable } from "react-resizable"
import {
  FaRedoAlt,
  FaChevronCircleLeft,
  FaChevronCircleUp,
  FaSlidersH,
} from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"
import { motion } from "framer-motion"

import { useClickOutside } from "../../../hooks/useClickOutside"

import {
  showSelfWebcamState,
  sharingScreenState,
  flipSelfVideoState,
  chatVideoScreens,
  videoFilterClassState,
} from "../../../store/video"

import { FilterClasses } from "../../../models"

interface Props {
  contraintsRef: React.MutableRefObject<HTMLDivElement>
  selfVideoRef: React.MutableRefObject<HTMLVideoElement>
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

interface StyledProps {
  supported?: boolean
  isYoutubeVideo?: boolean
  showWebcam?: boolean
}

const SelfVideoResizable: React.FC<Props> = ({
  selfVideoRef,
  contraintsRef,
  socket,
}) => {
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)

  const showWebcam = useRecoilValue(showSelfWebcamState)
  const sharingScreen = useRecoilValue(sharingScreenState)

  const [flipSelfVideo, setFlipSelfVideo] = useRecoilState(flipSelfVideoState)
  const [videoFilterClass, setVideoFilterClass] = useRecoilState(
    videoFilterClassState
  )

  const [element, setElement] = useState({
    style: {
      width: 225,
      height: 130,
    },
  })
  const [isSelected, setIsSelected] = useState(false)
  const [minimizeWindow, setMinimizeWindow] = useState(false)
  const [points, setPoints] = useState({ x: 0, y: 0 })

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

  // Handles Instagram-like filter classes for self video
  const handleVideoFilterClasses = () => {
    if (!videoFilterClass) {
      setVideoFilterClass(FilterClasses.INKWELL)
      socket.current.emit("videoFilterClass", FilterClasses.INKWELL)
    } else {
      setVideoFilterClass(null)
      socket.current.emit("videoFilterClass", null)
    }
  }

  return (
    <SelfVideoWrapper
      layout={isSelected ? false : true}
      drag={isSelected ? false : true}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={() => {
        if (contraintsRef.current !== null) {
          setPoints({
            x:
              node.current.getBoundingClientRect().left -
              contraintsRef.current.getBoundingClientRect().left,
            y:
              contraintsRef.current.getBoundingClientRect().bottom -
              node.current.getBoundingClientRect().bottom,
          })
        }
      }}
      dragConstraints={contraintsRef}
      showWebcam={showWebcam}
      ref={node}
      style={{ left: points.x, bottom: points.y }}
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
        minConstraints={[190, 90]}
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
            className={videoFilterClass as string | undefined}
          />
          {!sharingScreen && !isSelected && !minimizeWindow && (
            <RotateIcon
              onClick={() => setFlipSelfVideo((prevState) => !prevState)}
            />
          )}
          {!isSelected && !minimizeWindow && (
            <LeftIcon onClick={() => setMinimizeWindow(true)} />
          )}
          {!isSelected && !minimizeWindow && (
            <FiltersIcon onClick={handleVideoFilterClasses} />
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
      border: 2px dashed rgba(255, 255, 255, 0.6);
      cursor: initial;
    `}
`

const RotateIcon = styled(FaRedoAlt)`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  font-size: 2rem;
  color: var(--secondaryColor);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
  filter: drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.5));

  ${SelfVideoWrapper}:hover & {
    opacity: 1;
  }
`

const LeftIcon = styled(FaChevronCircleLeft)`
  position: absolute;
  right: 0.9rem;
  bottom: 7.5rem;
  font-size: 2.2rem;
  color: var(--tertiaryColor);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
  filter: drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.5));

  ${SelfVideoWrapper}:hover & {
    opacity: 1;
  }
`

const FiltersIcon = styled(FaSlidersH)`
  position: absolute;
  right: 0.9rem;
  bottom: 4.2rem;
  font-size: 2rem;
  color: var(--primaryColorLight);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
  filter: drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.5));

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
  position: fixed;
  left: 0;
  bottom: 0;
`
