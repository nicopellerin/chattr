import * as React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue, useRecoilState } from "recoil"
import { motion } from "framer-motion"

import { usernameState, listUsersState } from "../../store/users"
import { chatUserIsTypingState } from "../../store/chat"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextBar: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const listUsers = useRecoilValue(listUsersState)

  console.log(username)

  const [msg, setMsg] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!msg || Object.keys(listUsers).length < 2) return

    socket.current.emit("chatMessageIsTyping", {
      username,
      status: false,
      msg: "",
    })
    socket.current.emit("chatMessage", { user: username, msg })

    setMsg("")
  }

  useEffect(() => {
    if (msg.length > 0) {
      socket?.current?.emit("chatMessageIsTyping", {
        username,
        status: true,
        msg,
      })
    }
  }, [msg])

  useEffect(() => {
    if (!msg.length) {
      // socket.current.emit("chatMessageIsTyping", { username, status: false })
    }
  })

  return (
    <Wrapper onSubmit={handleSubmit}>
      <TextInput
        placeholder="Type message..."
        value={msg}
        onChange={(e) =>
          Object.keys(listUsers).length < 2 ? null : setMsg(e.target.value)
        }
      />
      <SendButton whileTap={{ scale: 0.98 }}>Send</SendButton>
    </Wrapper>
  )
}

export default ChatTextBar

// Styles
const Wrapper = styled.form`
  background: #1a0d2b;
  height: 100%;
  padding: 1rem;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr auto;
  filter: drop-shadow(0 0 0.75rem rgba(204, 75, 194, 0.1));
`

const TextInput = styled.input`
  width: 100%;
  height: 100%;
  background: #0c0613;
  border: none;
  color: var(--textColor);
  font-size: 1.7rem;
  padding: 0 1.5rem;
  outline: transparent;

  &::placeholder {
    color: var(--textColor);
  }
`

const SendButton = styled(motion.button)`
  padding: 1em 1.8em;
  border: none;
  background: #a020f0;
  color: #ffe9ff;
  font-size: 1.7rem;
  font-weight: 600;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`
