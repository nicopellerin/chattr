import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useRecoilValue } from "recoil"
import { motion } from "framer-motion"

import ChatTextMessage from "./TextMessage"

import { photoGalleryState, expandChatWindowState } from "../../../store/chat"

const ChatTextWindowGallery = () => {
  const photoGallery = useRecoilValue(photoGalleryState)
  const expandChatWindow = useRecoilValue(expandChatWindowState)

  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [expandChatWindow])

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
      <Wrapper
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        style={{ height: 400 }}
      >
        <Container layout="position">
          {photoGallery.length > 0 ? (
            photoGallery.map(
              ({ msg, filename, id, username, avatar, type }) => (
                <ChatTextMessage
                  msg={msg}
                  usernameMsg={username}
                  id={id}
                  filename={filename}
                  avatar={avatar}
                  type={type}
                />
              )
            )
          ) : (
            <NoImages layout="position">
              <NoImagesTitle>No images yet</NoImagesTitle>
              <NoImagesTagline>
                Images sent through the chat will be available here
              </NoImagesTagline>
            </NoImages>
          )}
        </Container>
      </Wrapper>
    </PerfectScrollbar>
  )
}

export default ChatTextWindowGallery

// Styles
const Wrapper = styled(motion.div)``

const Container = styled(motion.div)`
  width: 100%;
  height: 400px;
  color: var(--textColor);
  font-size: 1.7rem;
  line-height: 1.4;
  position: relative;
`

const NoImages = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.15);
  border-bottom: 7px solid #0c0613;
  border-radius: 75px;
  filter: drop-shadow(0 0.7rem 0.2rem rgba(131, 82, 253, 0.05));
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
  max-width: 80%;
`
