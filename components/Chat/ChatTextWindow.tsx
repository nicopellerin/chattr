import * as React from "react"
import { useEffect, useRef } from "react"
import styled from "styled-components"
import { useRecoilValue, useRecoilState } from "recoil"
import { AnimatePresence, motion } from "framer-motion"
import ScrollArea from "react-scrollbar"
import { FaKiwiBird, FaRocket } from "react-icons/fa"

import {
  chatWindowState,
  chatWelcomeMessageState,
  chatUserIsTypingState,
  fileTransferProgressState,
} from "../../store/chat"
import {
  usernameState,
  userLeftChattrState,
  listUsersState,
  userSoundOnState,
  selfIdState,
} from "../../store/users"
import Invite from "./Invite"

interface Message {
  msg: string
  user: string
}

interface Props {
  sendFile: (id: string, file: any) => void
}

const ChatTextWindow: React.FC<Props> = ({ sendFile }) => {
  const welcomeMsg = useRecoilValue(chatWelcomeMessageState)
  const msgs = useRecoilValue(chatWindowState)
  const username = useRecoilValue(usernameState)
  const userIsTyping = useRecoilValue(chatUserIsTypingState)
  const userLeftChattr = useRecoilValue(userLeftChattrState)
  const listUsers = useRecoilValue(listUsersState)
  const soundOn = useRecoilValue(userSoundOnState)
  const selfId = useRecoilValue(selfIdState)

  const [fileTransferProgress, setFileTransferProgress] = useRecoilState(
    fileTransferProgressState
  )

  // const chatWindowRef = useRef()
  const fileInputRef = useRef() as React.RefObject<HTMLInputElement>

  const otherUser = listUsers?.filter((user) => user !== selfId).join("")

  const handleSendFile = (e: any) => {
    const file = e.target.files[0]

    if (file.size > 5 * 1000000) {
      alert("File too big. Max size is 5 mb")
      e.target.value = ""
      return
    }

    sendFile(otherUser, file)
  }

  const pop = new Audio("/sounds/pop_drip.mp3")

  useEffect(() => {
    if (msgs.length > 0 && soundOn) {
      pop.play()
    }
    // chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
  }, [msgs])

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>

    if (fileTransferProgress === "100") {
      idx = setTimeout(() => setFileTransferProgress("0"), 3000)
    }

    return () => clearTimeout(idx)
  }, [fileTransferProgress])

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
                  exit={{ opacity: 0, transition: { duration: 0 } }}
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
                color="var(--textColor)"
              />
              <NoMessagesText>{welcomeMsg}</NoMessagesText>
            </NoMessages>
          )}

          {userIsTyping?.status && username !== userIsTyping?.username && (
            <UserIsTypingWrapper
              initial={{ y: 5 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 80 }}
            >
              <UserIsTypingText>
                {userIsTyping?.username} is typing...
              </UserIsTypingText>
            </UserIsTypingWrapper>
          )}

          {userLeftChattr && (
            <UserDisconnectedWrapper
              initial={{ y: 5 }}
              animate={{ y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 80 }}
            >
              <UserDisconnectedText>{userLeftChattr}</UserDisconnectedText>
            </UserDisconnectedWrapper>
          )}
        </Container>

        {listUsers?.length < 2 && !userLeftChattr?.length && <Invite />}
      </ScrollArea>
      {/* {listUsers?.length > 1 && (
        <SendFileWrapper>
          <ButtonSend
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Send file
            <FaRocket style={{ marginLeft: 5 }} />
          </ButtonSend>
          <input
            hidden
            name="file"
            id="file"
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleSendFile(e)}
          />
          {fileTransferProgress !== "0" && (
            <h3 style={{ color: "red" }}>{fileTransferProgress + "%"}</h3>
          )}
        </SendFileWrapper>
      )} */}
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
  /* filter: drop-shadow(0 0 10rem rgba(131, 82, 253, 0.05)); */
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

const UserDisconnectedWrapper = styled(motion.div)`
  padding: 3rem 1.7rem 1rem;
  text-align: center;
`

const UserDisconnectedText = styled.span`
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--secondaryColor);
`

const ButtonSend = styled(motion.button)`
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  border: none;
  color: var(--textColor);
  font-size: 1.4rem;
  font-weight: 600;
  padding: 0.8rem 1rem;
  border-radius: 5px;
  outline: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const SendFileWrapper = styled.div`
  display: flex;
  justify-content: center;
`
