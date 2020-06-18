import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { AnimatePresence, motion } from "framer-motion"
import ScrollArea from "react-scrollbar"
import { FaKiwiBird } from "react-icons/fa"

import {
  chatWindowState,
  chatWelcomeMessageState,
  chatUserIsTypingState,
} from "../../store/chat"
import { usernameState } from "../../store/users"

interface Message {
  msg: string
  user: string
}

const ChatTextWindow = () => {
  const welcomeMsg = useRecoilValue(chatWelcomeMessageState)
  const msgs = useRecoilValue(chatWindowState)
  const username = useRecoilValue(usernameState)
  const userIsTyping = useRecoilValue(chatUserIsTypingState)

  const pop = new Audio("/sounds/pop_drip.mp3")

  useEffect(() => {
    pop.play()
  }, [msgs])

  return (
    <Wrapper>
      <ScrollArea
        style={{
          height: 400,
          boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
        verticalScrollbarStyle={{ background: "#000" }}
        verticalContainerStyle={{ background: "#eee" }}
        horizontal={false}
      >
        <Container>
          <AnimatePresence>
            {msgs.length > 0 &&
              msgs.map(({ msg, user }: Message, i) => (
                <MsgWrapper
                  key={i}
                  initial={{ y: 5 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", damping: 80 }}
                >
                  <Username me={username === user}>{user}</Username>
                  <span>{msg}</span>
                </MsgWrapper>
              ))}
          </AnimatePresence>
          {msgs.length === 0 && (
            <NoMessages>
              <FaKiwiBird
                size={32}
                style={{ marginBottom: 15 }}
                color="var(--textColor);"
              />
              <NoMessagesText>{welcomeMsg}</NoMessagesText>
            </NoMessages>
          )}
          <AnimatePresence>
            {userIsTyping?.status && username !== userIsTyping?.username && (
              <UserIsTypingWrapper
                initial={{ y: 5 }}
                animate={{ y: 0 }}
                exit={{ y: 5 }}
                transition={{ type: "spring", damping: 80 }}
              >
                <UserIsTypingText>
                  {userIsTyping?.username} is typing...
                </UserIsTypingText>
              </UserIsTypingWrapper>
            )}
          </AnimatePresence>
        </Container>
      </ScrollArea>
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
  filter: drop-shadow(0 0 0.75rem rgba(204, 75, 194, 0.1));
`

const Container = styled.div`
  background: rgba(255, 255, 255, 0.01);
  width: 100%;
  height: 100%;
  padding: 2.2rem 1.7rem;
  color: var(--textColor);
  font-size: 1.7rem;
  overflow: auto;
`

const MsgWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #222;

  &:not(:first-child) {
    padding-top: 1.5rem;
  }
`

const Username = styled.span`
  color: ${(props: { me: boolean }) =>
    props.me ? "var(--tertiaryColor)" : "var(--secondaryColor)"};
  font-weight: 600;
`

const NoMessages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`

const NoMessagesText = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--textColor);
`

const UserIsTypingWrapper = styled(motion.div)`
  padding: 3rem 1.7rem 1rem;
  text-align: center;
`

const UserIsTypingText = styled.span`
  font-size: 1.7rem;
`
