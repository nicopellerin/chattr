import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useRecoilValue } from "recoil"
import { motion } from "framer-motion"

import ChatTextMessage from "./ChatTextMessage"

import {
  photoGalleryState,
  expandChatWindowState,
  showPhotoGalleryState,
} from "../../store/chat"

const ChatTextWindowGallery = () => {
  const photoGallery = useRecoilValue(photoGalleryState)
  const showPhotoGallery = useRecoilValue(showPhotoGalleryState)
  const expandChatWindow = useRecoilValue(expandChatWindowState)

  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>

  useEffect(() => {
    if (showPhotoGallery && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    } else {
      scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
    }
  }, [showPhotoGallery, expandChatWindow])

  return (
    <PerfectScrollbar
      containerRef={(ref) => {
        scrollRef.current = ref
      }}
      options={{ wheelSpeed: 0.5 }}
      style={{
        borderRadius: "5px",
      }}
    >
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 80 }}
        style={{ height: expandChatWindow ? 585 : 400 }}
      >
        {photoGallery.length > 0 ? (
          photoGallery.map(({ msg, filename, id, username }) => (
            <ChatTextMessage
              msg={msg}
              usernameMsg={username}
              id={id}
              filename={filename}
            />
          ))
        ) : (
          <NoImages>
            <NoImagesTitle>No images yet</NoImagesTitle>
            <NoImagesTagline>
              Images sent through the chat will be available here
            </NoImagesTagline>
          </NoImages>
        )}
      </Container>
    </PerfectScrollbar>
  )
}

export default ChatTextWindowGallery

// Styles
const Container = styled(motion.div)`
  width: 100%;
  height: 100%;
  color: var(--textColor);
  font-size: 1.7rem;
  line-height: 1.4;
  position: relative;
`

const NoImages = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const NoImagesTitle = styled.h2`
  color: var(--tertiaryColor);
  font-size: 3rem;
`

const NoImagesTagline = styled.span`
  color: var(--textColor);
  font-size: 1.7rem;
  font-weight: 600;
  text-align: center;
`
