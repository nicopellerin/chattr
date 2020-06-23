import * as React from "react"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { motion } from "framer-motion"

import { usernameState, listUsersState, selfIdState } from "../../store/users"
import { displayTheatreModeState } from "../../store/video"
import EmojiPicker from "./EmojiPicker"
import { FaVolumeUp } from "react-icons/fa"

const lolSounds = [
  "/sounds/lol/laugh.mp3",
  "/sounds/lol/cannedlaugh.mp3",
  "/sounds/lol/chipmunk.mp3",
  "/sounds/lol/tvlaugh.mp3",
  "/sounds/lol/mexlaugh4.mp3",
  "/sounds/lol/family-guy-stewies-annoying-laugh-5.mp3",
  "/sounds/lol/joker-laugh.mp3",
  "/sounds/lol/wiz-khalifa-reacts-to-fan-laugh-impressions-1-mp3cut.mp3",
  "/sounds/lol/laugh-3_9wVKqU7.mp3",
  "/sounds/lol/beavis-and-buttheads-laugh.mp3",
  "/sounds/lol/family-guy-lois-mom-mum-mommy-mp3cut.mp3",
  "/sounds/lol/sitcom-laughing.mp3",
  "/sounds/lol/222122.mp3",
  "/sounds/lol/a-minute-of-laughs-jimmy-carr-online-audio-converter.mp3",
  "/sounds/lol/troll-laugh-sound-effect.mp3",
  "/sounds/lol/homer-simpson-evil-laugh-from-youtube.mp3",
  "/sounds/lol/unnamed.mp3",
  "/sounds/lol/will-smith-laugh.mp3",
  "/sounds/lol/yodalaughing.mp3",
  "/sounds/lol/samuelcreep.mp3",
  "/sounds/lol/family-guy-stewie-s-laugh.mp3",
  "/sounds/lol/cardi-b-hahaha.mp3",
  "/sounds/lol/samuelcreep_uAqES0U.mp3",
]

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextBar: React.FC<Props> = ({ socket }) => {
  const username = useRecoilValue(usernameState)
  const listUsers = useRecoilValue(listUsersState)
  const displayTheatreMode = useRecoilValue(displayTheatreModeState)
  const selfId = useRecoilValue(selfIdState)

  const [msg, setMsg] = useState("")
  const [togglePicker, setTogglePicker] = useState(false)

  const otherUser = listUsers?.filter((user) => user !== selfId).join("")

  let count = useRef(0)
  const inputTextRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const playLolSound = () => {
    const randomIdx = Math.floor(Math.random() * lolSounds.length)
    const sound = new Audio(lolSounds[randomIdx])
    sound.play()
    sound.volume = 0.5

    socket.current.emit("chatMessage", { user: username, msg: "LOL! 😆🤣" })
    socket.current.emit("playLolSound", {
      to: otherUser,
      sound: lolSounds[randomIdx],
    })
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("playingLolSound", (lolSound: string) => {
        const sound = new Audio(lolSound)
        sound.play()
        sound.volume = 0.5
      })
    }
  }, [])

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

  const noConnection = listUsers?.length < 2

  return (
    <>
      <Wrapper theatreMode={displayTheatreMode} onSubmit={handleSubmit}>
        <TextInput
          ref={inputTextRef}
          disabled={noConnection}
          placeholder="Type message..."
          value={msg}
          onChange={(e) => (noConnection ? null : setMsg(e.target.value))}
        />
        <SmileyFace
          src="/smiley.png"
          alt="smiley"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={
            noConnection
              ? { opacity: 0.2, pointerEvents: "none" }
              : { opacity: 1, pointerEvents: "all" }
          }
          onClick={() => setTogglePicker((prevState) => !prevState)}
        />
        <LolButton
          type="button"
          onClick={() => {
            playLolSound()
          }}
          style={
            noConnection
              ? { opacity: 0.2, pointerEvents: "none" }
              : { opacity: 1, pointerEvents: "all" }
          }
          whileTap={{ scale: 0.98 }}
        >
          Lol <FaVolumeUp style={{ marginLeft: 5 }} />
        </LolButton>
        <SendButton disabled={noConnection} whileTap={{ scale: 0.98 }}>
          Send
        </SendButton>
        {togglePicker && (
          <EmojiPicker
            setMsg={setMsg}
            setTogglePicker={setTogglePicker}
            inputTextRef={inputTextRef}
          />
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
  padding: 0 15.8rem 0 1.5rem;
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

const LolButton = styled(motion.button)`
  position: absolute;
  right: 20rem;
  top: 2.45rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  padding: 0.5rem 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  outline: transparent;
`
