import * as React from "react"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { motion } from "framer-motion"

import { usernameState, listUsersState } from "../../store/users"
import { displayTheatreModeState } from "../../store/video"
import EmojiPicker from "./EmojiPicker"
// import { chatUserIsTypingState } from "../../store/chat"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextBar: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const listUsers = useRecoilValue(listUsersState)
  const displayTheatreMode = useRecoilValue(displayTheatreModeState)
  // const userIsTyping = useRecoilValue(chatUserIsTypingState)
  const [msg, setMsg] = useState("")
  const [togglePicker, setTogglePicker] = useState(false)

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
    setTogglePicker(false)
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

  return (
    <>
      <Wrapper theatreMode={displayTheatreMode} onSubmit={handleSubmit}>
        <TextInput
          disabled={listUsers?.length < 2}
          placeholder="Type message..."
          value={msg}
          onChange={(e) =>
            listUsers?.length < 2 ? null : setMsg(e.target.value)
          }
        />

        <SmileyFace
          src="/smiley.png"
          alt="smiley"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={
            listUsers?.length < 2
              ? { opacity: 0.2, pointerEvents: "none" }
              : { opacity: 1, pointerEvents: "all" }
          }
          onClick={() => setTogglePicker((prevState) => !prevState)}
        />

        <SendButton disabled={listUsers?.length < 2} whileTap={{ scale: 0.98 }}>
          Send
        </SendButton>
        {togglePicker && (
          <EmojiPicker setMsg={setMsg} setTogglePicker={setTogglePicker} />
        )}
      </Wrapper>
    </>
  )
}

export default ChatTextBar

// Styles
const Wrapper = styled.form`
  background: #1a0d2b;
  height: 100%;
  padding: 1rem;
  border-radius: 5px;
  display: ${(props: { theatreMode: boolean }) =>
    props.theatreMode ? "none" : "grid"};
  grid-template-columns: 1fr auto;
  position: relative;
`

const TextInput = styled.input`
  width: 100%;
  height: 100%;
  background: #0c0613;
  border: none;
  color: var(--textColor);
  font-size: 1.7rem;
  padding: 0 8.8rem 0 1.5rem;
  outline: transparent;

  &::placeholder {
    color: var(--textColor);
  }

  &:disabled {
    &::placeholder {
      color: #aaa;
    }
  }
`

const SendButton = styled(motion.button)`
  padding: 1em 1.8em;
  border: none;
  background: ${(props: { disabled: boolean }) =>
    props.disabled
      ? "#112"
      : `linear-gradient(
    -160deg,
    var(--primaryColor),
    var(--primaryColorDark)
  )`};
  color: ${(props: { disabled: boolean }) =>
    props.disabled ? "#aaa" : "var(--textColor)"};
  font-size: 1.7rem;
  font-weight: 600;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props: { disabled: boolean }) =>
    props.disabled ? "initial" : "pointer"};
  outline: transparent;
`

const SmileyFace = styled(motion.img)`
  position: absolute;
  right: 14rem;
  top: 2rem;
  width: 32px;
  cursor: pointer;
`
