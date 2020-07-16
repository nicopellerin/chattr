import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import PerfectScrollbar from "react-perfect-scrollbar"
import { ThreeBounce } from "better-react-spinkit"
import CryptoJS from "crypto-js"
import { useRecoilValue, useRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"

import Invite from "./Invite"
import ChatTextMessage from "./ChatTextMessage"

import {
  chatWelcomeMessageState,
  chatWindowState,
  chatUserIsTypingState,
  messageDeletedState,
  expandChatWindowState,
  fileTransferProgressState,
} from "../../store/chat"
import {
  usernameState,
  userSoundOnState,
  listUsersState,
  userLeftChattrState,
  otherUsernameQuery,
} from "../../store/users"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
  showJoinMsg: boolean
}

const ChatTextWindowMain: React.FC<Props> = ({ socket, showJoinMsg }) => {
  const welcomeMsg = useRecoilValue(chatWelcomeMessageState)
  const msgs = useRecoilValue(chatWindowState)
  const username = useRecoilValue(usernameState)
  const userIsTyping = useRecoilValue(chatUserIsTypingState)
  const userLeftChattr = useRecoilValue(userLeftChattrState)
  const listUsers = useRecoilValue(listUsersState)
  const soundOn = useRecoilValue(userSoundOnState)
  const otherUsername = useRecoilValue(otherUsernameQuery)
  const messagedDeleted = useRecoilValue(messageDeletedState)
  const expandChatWindow = useRecoilValue(expandChatWindowState)

  const [fileTransferProgress, setFileTransferProgress] = useRecoilState(
    fileTransferProgressState
  )

  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>
  const otherUsernameRef = useRef("")

  useEffect(() => {
    if (otherUsername) {
      otherUsernameRef.current = otherUsername
    }
  }, [otherUsername])

  const pop = new Audio("/sounds/pop_drip.mp3")
  pop.volume = 0.3

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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
    }
  }, [expandChatWindow])

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
        // layout
        isExpanded={expandChatWindow}
        isIpad={
          typeof window !== "undefined" && window.innerWidth < 1025
            ? true
            : false
        }
      >
        {msgs.length > 0 &&
          msgs.map(
            ({ msg, username: usernameMsg, filename, id, ogData, avatar }) => {
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
                  ogData={ogData}
                  avatar={avatar}
                />
              )
            }
          )}
        {msgs.length === 0 && hasConnection && (
          <NoMessages layout hasConnection={hasConnection}>
            <NoMessagesText layout>
              <IconLogo
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", damping: 80 }}
                src="/favicon.png"
                alt="Icon"
              />
              {showJoinMsg ? (
                <UserJoinedText>
                  {otherUsername}
                  <br /> joined the room
                </UserJoinedText>
              ) : (
                <WelcomeText>{welcomeMsg}</WelcomeText>
              )}
            </NoMessagesText>
          </NoMessages>
        )}
        <AnimatePresence>
          {noConnection && !userLeftChattr && (
            <motion.div layout style={{ height: 400 }}>
              <Invite />
            </motion.div>
          )}
        </AnimatePresence>

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
              layout
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -20, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 80 }}
            >
              <IconLogo
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
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
  )
}

export default ChatTextWindowMain

// Styles
const Container = styled(motion.div)`
  width: 100%;
  height: ${(props: { isExpanded?: boolean; isIpad: boolean }) =>
    props.isExpanded && !props.isIpad ? "570px" : "400px"};
  ${(props: { isIpad: boolean }) => props.isIpad && "height: 350px"};
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
  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.15);
  border-bottom: 7px solid #0c0613;
  border-radius: 75px;
  filter: drop-shadow(0 0.7rem 0.2rem rgba(131, 82, 253, 0.05));

  ${(props: { hasConnection: boolean }) =>
    props.hasConnection && `height: 100%;`};
`

const NoMessagesText = styled(motion.span)`
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

const IconLogo = styled(motion.img)`
  margin-bottom: 2.4rem;
  width: 12rem;

  @media (max-width: 500px) {
    margin-bottom: 1.7rem;
  }
`

const WelcomeText = styled.h3`
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--primaryColorLight)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
