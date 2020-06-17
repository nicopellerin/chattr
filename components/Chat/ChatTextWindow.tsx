import * as React from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { AnimatePresence, motion } from "framer-motion"
import ScrollArea from "react-scrollbar"

import { chatWindowState, chatWelcomeMessageState } from "../../store/chat"
import { FaKiwiBird } from "react-icons/fa"
import { usernameState } from "../../store/users"

interface Message {
  msg: string
  user: string
}

const ChatTextWindow = () => {
  const welcomeMsg = useRecoilValue(chatWelcomeMessageState)
  const msgs = useRecoilValue(chatWindowState)
  const username = useRecoilValue(usernameState)

  return (
    <Wrapper>
      <ScrollArea
        style={{
          height: 400,
          width: "100%",
          background: "rgba(255, 255, 255, 0.05)",
          boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
        }}
        verticalScrollbarStyle={{ background: "#000" }}
        verticalContainerStyle={{ background: "#eee" }}
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
                color="#FFE9FF"
              />
              <NoMessagesText>{welcomeMsg}</NoMessagesText>
            </NoMessages>
          )}
        </Container>
      </ScrollArea>
    </Wrapper>
  )
}

export default ChatTextWindow

// Styles
const Wrapper = styled.div`
  background: #1e1e1e;
  height: 100%;
  padding: 2rem;
  border-radius: 5px;
  /* border: 1px solid #222; */
`

const Container = styled.div`
  background: rgba(255, 255, 255, 0.01);
  width: 100%;
  height: 100%;
  padding: 2.2rem 2rem;
  color: #ffe9ff;
  font-size: 1.6rem;
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
  color: ${(props: { me: boolean }) => (props.me ? "#2cfcf0" : "#FF2F79")};
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
  font-size: 1.6rem;
  font-weight: 600;
  color: #ffe9ff;
`
