import * as React from "react"
import { useEffect, useRef } from "react"
import styled from "styled-components"
import { useRecoilValue, useRecoilState } from "recoil"
import { AnimatePresence, motion } from "framer-motion"
import { FaKiwiBird, FaChevronCircleUp } from "react-icons/fa"
import PerfectScrollbar from "react-perfect-scrollbar"
import { ThreeBounce } from "better-react-spinkit"

import {
  chatWindowState,
  chatWelcomeMessageState,
  chatUserIsTypingState,
  fileTransferProgressState,
  expandChatWindowState,
} from "../../store/chat"
import {
  usernameState,
  userLeftChattrState,
  listUsersState,
  userSoundOnState,
} from "../../store/users"
import Invite from "./Invite"

interface Message {
  msg: string
  user: string
}

const ChatTextWindow: React.FC = () => {
  const welcomeMsg = useRecoilValue(chatWelcomeMessageState)
  const msgs = useRecoilValue(chatWindowState)
  const username = useRecoilValue(usernameState)
  const userIsTyping = useRecoilValue(chatUserIsTypingState)
  const userLeftChattr = useRecoilValue(userLeftChattrState)
  const listUsers = useRecoilValue(listUsersState)
  const soundOn = useRecoilValue(userSoundOnState)

  const [fileTransferProgress, setFileTransferProgress] = useRecoilState(
    fileTransferProgressState
  )
  const [expandChatWindow, setExpandChatWindow] = useRecoilState(
    expandChatWindowState
  )

  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>

  const pop = new Audio("/sounds/pop_drip.mp3")
  pop.volume = 0.3
  const expand = new Audio("/sounds/expand.mp3")
  expand.volume = 0.3

  useEffect(() => {
    if (msgs.length > 0 && soundOn) {
      pop.play()
    }

    scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
  }, [msgs])

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>

    if (fileTransferProgress === "100") {
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
          <AnimatePresence>
            {msgs.length > 0 &&
              msgs.map(({ msg, user }: Message, i) => (
                <MsgWrapper
                  key={i}
                  initial={{ y: 5 }}
                  animate={{ y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ type: "spring", damping: 80 }}
                >
                  <Username me={username === user}>{user}</Username>
                  <span>{msg}</span>
                </MsgWrapper>
              ))}
          </AnimatePresence>
          {msgs.length === 0 && hasConnection && (
            <NoMessages hasConnection={hasConnection}>
              <NoMessagesText>
                <FaKiwiBird
                  size={50}
                  style={{ marginBottom: 20 }}
                  color="var(--primaryColor)"
                />
                <span style={{ fontSize: "2rem" }}>{welcomeMsg}</span>
              </NoMessagesText>
            </NoMessages>
          )}
          {noConnection && !userLeftChattr?.length && (
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
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", damping: 80 }}
              >
                <UserDisconnectedText>{userLeftChattr}</UserDisconnectedText>
              </UserDisconnectedWrapper>
            )}
          </AnimatePresence>
        </Container>
      </PerfectScrollbar>
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

const MsgWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #222;
  background: linear-gradient(45deg, #0c0613, #0f0818);
  border-radius: 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
  word-break: break-all;
`

const Username = styled.span`
  color: ${(props: { me: boolean }) =>
    props.me ? "var(--tertiaryColor)" : "var(--secondaryColor)"};
  font-weight: 600;
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
  font-weight: 600;
  color: var(--primaryColorLight);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  align-items: center;
  justify-content: center;
`

const UserDisconnectedText = styled.span`
  font-size: 2rem;
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
