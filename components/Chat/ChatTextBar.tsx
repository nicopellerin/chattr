import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { motion } from "framer-motion"

import { usernameState, listUsersState } from "../../store/users"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextBar: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const listUsers = useRecoilValue(listUsersState)

  const [msg, setMsg] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!msg || Object.keys(listUsers).length < 2) return

    socket.current.emit("chatMessage", { user: username, msg })

    setMsg("")
  }

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
  background: #1e1e1e;
  height: 100%;
  padding: 1rem;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr auto;
  /* border: 1px solid #222; */
`

const TextInput = styled.input`
  width: 100%;
  height: 100%;
  background: #121212;
  border: none;
  color: #ffe9ff;
  font-size: 1.6rem;
  padding: 0 1.6rem;
  outline: transparent;

  &::placeholder {
    color: #ffe9ff;
  }
`

const SendButton = styled(motion.button)`
  padding: 1em 1.8em;
  border: none;
  background: #a020f0;
  color: #ffe9ff;
  font-size: 1.6rem;
  font-weight: 600;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`
