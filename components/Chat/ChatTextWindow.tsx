import * as React from "react"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { AnimatePresence, motion } from "framer-motion"
import { FaChevronCircleUp, FaGamepad, FaPhotoVideo } from "react-icons/fa"
import PerfectScrollbar from "react-perfect-scrollbar"
import { ThreeBounce } from "better-react-spinkit"
import CryptoJS from "crypto-js"

import Invite from "./Invite"
import TicTacToe from "../Games/TicTacToe"

import {
  chatWindowState,
  chatWelcomeMessageState,
  chatUserIsTypingState,
  fileTransferProgressState,
  expandChatWindowState,
  messageDeletedState,
  photoGalleryState,
} from "../../store/chat"
import {
  usernameState,
  userLeftChattrState,
  listUsersState,
  userSoundOnState,
  otherUsernameQuery,
} from "../../store/users"
import {
  playGameState,
  playGameShowInitialScreenState,
  wonGameState,
} from "../../store/game"
import ChatTextMessage from "./ChatTextMessage"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextWindow: React.FC<Props> = ({ socket }) => {
  const welcomeMsg = useRecoilValue(chatWelcomeMessageState)
  const msgs = useRecoilValue(chatWindowState)
  const username = useRecoilValue(usernameState)
  const userIsTyping = useRecoilValue(chatUserIsTypingState)
  const userLeftChattr = useRecoilValue(userLeftChattrState)
  const listUsers = useRecoilValue(listUsersState)
  const soundOn = useRecoilValue(userSoundOnState)
  const otherUsername = useRecoilValue(otherUsernameQuery)
  const messagedDeleted = useRecoilValue(messageDeletedState)
  const photoGallery = useRecoilValue(photoGalleryState)

  const [fileTransferProgress, setFileTransferProgress] = useRecoilState(
    fileTransferProgressState
  )
  const [expandChatWindow, setExpandChatWindow] = useRecoilState(
    expandChatWindowState
  )
  const [playGame, setPlayGame] = useRecoilState(playGameState)

  const setPlayGameShowInitialScreen = useSetRecoilState(
    playGameShowInitialScreenState
  )
  const setWon = useSetRecoilState(wonGameState)

  const [showJoinMsg, setShowJoinMsg] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)

  const joined = new Audio("/sounds/joined.mp3")
  joined.volume = 0.3

  // Plays sound when other user connects
  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (otherUsername) {
      setShowJoinMsg(true)
      if (soundOn) {
        joined.play()
      }
      idx = setTimeout(() => {
        setShowJoinMsg(false)
      }, 4000)
    }

    return () => clearTimeout(idx)
  }, [otherUsername])

  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>
  const otherUsernameRef = useRef("")

  useEffect(() => {
    if (otherUsername) {
      otherUsernameRef.current = otherUsername
    }
  }, [otherUsername])

  // If other user disconnects while user is in game mode, revert to chat
  useEffect(() => {
    if (listUsers?.length < 2) {
      setPlayGame(false)
    }
  }, [listUsers])

  const pop = new Audio("/sounds/pop_drip.mp3")
  pop.volume = 0.3
  const expand = new Audio("/sounds/expand.mp3")
  expand.volume = 0.3
  const playGameSound = new Audio("/sounds/play-game.mp3")
  playGameSound.volume = 0.2

  // Play sound when new message is added
  useEffect(() => {
    if (msgs.length > 0 && soundOn && !messagedDeleted) {
      pop.play()
    }
    if (scrollRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
    }
  }, [msgs])

  useEffect(() => {
    if (!expandChatWindow && scrollRef.current) {
      scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
    }
  }, [expandChatWindow])

  useEffect(() => {
    if (showPhotoGallery && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    } else {
      scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
    }
  }, [showPhotoGallery])

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (fileTransferProgress === "Done!") {
      idx = setTimeout(() => setFileTransferProgress("0"), 1500)
    }
    return () => clearTimeout(idx)
  }, [fileTransferProgress])

  const hasConnection = listUsers?.length > 1
  const noConnection = listUsers?.length < 2

  return (
    <Wrapper>
      <ExpandButton
        whileHover={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.95 }}
        animate={expandChatWindow ? { rotate: 180 } : { rotate: 0 }}
        transition={{ type: "spring", damping: 15 }}
        onClick={() => {
          setExpandChatWindow((prevState) => !prevState)
          if (soundOn) {
            expand.play()
          }
        }}
      >
        <FaChevronCircleUp />
      </ExpandButton>
      {hasConnection && (
        <PlayGameButton
          whileHover={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          animate={playGame ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: "spring", damping: 15 }}
          onClick={() => {
            if (noConnection) return
            setPlayGame((prevState) => !prevState)
            setWon(false)
            setPlayGameShowInitialScreen(true)
            if (soundOn) {
              playGameSound.play()
            }
          }}
        >
          <FaGamepad />
        </PlayGameButton>
      )}
      {hasConnection && (
        <PhotoGalleryButton
          whileHover={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          animate={showPhotoGallery ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: "spring", damping: 15 }}
          onClick={() => {
            if (noConnection) return
            setShowPhotoGallery((prevState) => !prevState)
            if (soundOn) {
              playGameSound.play()
            }
          }}
        >
          <FaPhotoVideo />
        </PhotoGalleryButton>
      )}
      {playGame && !showPhotoGallery ? (
        <TicTacToe socket={socket} />
      ) : !playGame && !showPhotoGallery ? (
        <PerfectScrollbar
          containerRef={(ref) => {
            scrollRef.current = ref
          }}
          options={{ wheelSpeed: 0.5 }}
          style={{
            borderRadius: "5px",
          }}
        >
          <Container style={{ height: expandChatWindow ? 585 : 400 }}>
            {msgs.length > 0 &&
              msgs.map(({ msg, username: usernameMsg, filename, id }) => {
                let decryptedData
                // If message is not an image, encrypt it. TODO: Need to fix this
                if (!msg.startsWith("data:image")) {
                  const bytes = CryptoJS.AES.decrypt(
                    msg,
                    String(process.env.NEXT_PUBLIC_KEY)
                  )
                  decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                }

                return (
                  <ChatTextMessage
                    key={id}
                    id={id}
                    msg={msg}
                    decryptedData={decryptedData}
                    filename={filename}
                    usernameMsg={usernameMsg}
                    socket={socket}
                  />
                )
              })}

            {msgs.length === 0 && hasConnection && (
              <NoMessages hasConnection={hasConnection}>
                <NoMessagesText>
                  <IconLogo
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 80 }}
                    src="/favicon.png"
                    alt="Icon"
                  />
                  {showJoinMsg ? (
                    <UserJoinedText>
                      {otherUsername} joined the room
                    </UserJoinedText>
                  ) : (
                    <span>{welcomeMsg}</span>
                  )}
                </NoMessagesText>
              </NoMessages>
            )}
            {noConnection && !userLeftChattr && (
              <motion.div animate style={{ height: 400 }}>
                <Invite />
              </motion.div>
            )}

            {hasConnection &&
              userIsTyping?.status &&
              username !== userIsTyping?.username && (
                <UserIsTypingWrapper
                  initial={{ y: 5 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", damping: 80 }}
                >
                  <UserIsTypingText>
                    <ThreeBounce color="var(--textColor)" size={7} />
                  </UserIsTypingText>
                </UserIsTypingWrapper>
              )}

            <AnimatePresence>
              {userLeftChattr && (
                <UserDisconnectedWrapper
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: -20, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 80 }}
                >
                  <IconLogo
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 80 }}
                    src="/favicon.png"
                    alt="Icon"
                  />
                  <UserDisconnectedText>
                    {otherUsernameRef.current} has left Chattr
                  </UserDisconnectedText>
                </UserDisconnectedWrapper>
              )}
            </AnimatePresence>
          </Container>
        </PerfectScrollbar>
      ) : (
        <PerfectScrollbar
          containerRef={(ref) => {
            scrollRef.current = ref
          }}
          options={{ wheelSpeed: 0.5 }}
          style={{
            borderRadius: "5px",
          }}
        >
          <Container style={{ height: expandChatWindow ? 585 : 400 }}>
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
      )}
    </Wrapper>
  )
}

export default ChatTextWindow

// Styles
const Wrapper = styled.div`
  background: #1a0d2b;
  height: 100%;
  padding: 1.7rem;
  border-radius: 5px;
  position: relative;
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: var(--textColor);
  font-size: 1.7rem;
  line-height: 1.4;
  position: relative;
`

const NoMessages = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 0.2rem;

  ${(props: { hasConnection: boolean }) =>
    props.hasConnection && `height: 100%;`};
`

const NoMessagesText = styled.span`
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--primaryColorLight);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`

const UserIsTypingWrapper = styled(motion.div)`
  padding: 3rem 1.7rem 1rem;
  text-align: center;
  position: sticky;
  bottom: 0;
  width: 100%;
`

const UserIsTypingText = styled.span`
  font-size: 1.2rem;
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  padding: 0.4rem 0.5rem;
  border-radius: 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

const UserDisconnectedWrapper = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const UserDisconnectedText = styled.span`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--secondaryColor);
  text-align: center;
`

const UserJoinedText = styled.span`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--secondaryColor);
`

const ExpandButton = styled(motion.div)`
  background: transparent;
  border: none;
  color: var(--primaryColorDark);
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  font-size: 2rem;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  position: absolute;
  right: -2.7rem;
  top: 1.5rem;
  z-index: 0;
  cursor: pointer;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: "";
    display: block;
    background: #1a0d2b;
    width: 3.4rem;
    height: 4rem;
    position: absolute;
    z-index: -1;
    border-radius: 5px;
  }
`

const PlayGameButton = styled(ExpandButton)`
  top: 6.5rem;
`

const PhotoGalleryButton = styled(ExpandButton)`
  top: 11.5rem;
`

const IconLogo = styled(motion.img)`
  margin-bottom: 2.4rem;
  width: 12rem;

  @media (max-width: 500px) {
    margin-bottom: 1.7rem;
  }
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
