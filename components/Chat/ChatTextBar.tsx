import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { useSetRecoilState } from "recoil"

import { chatWindowState } from "../../store/chat"
import { motion } from "framer-motion"

const ChatTextBar = () => {
  const setChatMsg = useSetRecoilState(chatWindowState)
  const [msg, setMsg] = useState("")

  const user = "Nico"

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!msg) return

    setChatMsg((prevState) => [...prevState, { user, msg }])
    setMsg("")
  }

  return (
    <Wrapper onSubmit={handleSubmit}>
      <TextInput
        placeholder="Type message..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
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
  color: #f8f8f8;
  font-size: 1.6rem;
  padding: 0 1.6rem;
  outline: transparent;
`

const SendButton = styled(motion.button)`
  padding: 1em 1.8em;
  border: none;
  background: #f968b0;
  color: #f8f8f8;
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
