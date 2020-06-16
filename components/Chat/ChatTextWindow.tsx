import * as React from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { AnimatePresence, motion } from "framer-motion"

import { chatWindowState, chatWelcomeMessageState } from "../../store/chat"
import { FaKiwiBird } from "react-icons/fa"
import { usernameState } from "../../store/users"

const ChatTextWindow = () => {
  const welcomeMsg = useRecoilValue(chatWelcomeMessageState)
  const msgs = useRecoilValue(chatWindowState)

  const username = useRecoilValue(usernameState)

  console.log("WINDOW", msgs)

  return (
    <Wrapper>
      <Container>
        <AnimatePresence>
          {msgs.length > 0 &&
            msgs.map(({ msg, user }) => (
              <MsgWrapper
                key={msg}
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
            <FaKiwiBird size={32} style={{ marginBottom: 15 }} color="#aaa" />
            <NoMessagesText>{welcomeMsg}</NoMessagesText>
          </NoMessages>
        )}
      </Container>
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
  color: #f8f8f8;
  font-size: 1.6rem;
  overflow: auto;
`

const MsgWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #222;

  &:not(:first-child) {
    padding-top: 2rem;
  }
`

const Username = styled.span`
  color: ${(props: { me: boolean }) => (props.me ? "#2cfcf0" : "orange")};
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
  color: #aaa;
`
