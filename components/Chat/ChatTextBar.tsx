import * as React from "react"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { motion } from "framer-motion"

import { usernameState, listUsersState } from "../../store/users"
// import { chatUserIsTypingState } from "../../store/chat"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextBar: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const listUsers = useRecoilValue(listUsersState)
  // const userIsTyping = useRecoilValue(chatUserIsTypingState)

  const [msg, setMsg] = useState("")

  let count = useRef(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!msg || listUsers?.length < 2) return

    socket.current.emit("chatMessageIsTyping", {
      username,
      status: false,
      msg: "",
    })
    socket.current.emit("chatMessage", { user: username, msg })
    setMsg("")
    count.current = 0
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

  // const click = new Audio("/sounds/click.mp3")

  // useEffect(() => {
  //   if (userIsTyping && userIsTyping?.username !== username && !count.current) {
  //     click.play()
  //     count.current++
  //   }
  // }, [userIsTyping])

  return (
    <Wrapper onSubmit={handleSubmit}>
      <TextInput
        placeholder="Type message..."
        value={msg}
        onChange={(e) =>
          listUsers?.length < 2 ? null : setMsg(e.target.value)
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
  filter: drop-shadow(0 0 10rem rgba(131, 82, 253, 0.05));
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
  background: var(--primaryColor);
  color: var(--textColor);
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
