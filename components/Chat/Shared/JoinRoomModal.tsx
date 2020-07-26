import * as React from "react"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaRocket } from "react-icons/fa"

import { isDevURL } from "../../../config"

const JoinRoomModal = () => {
  const [roomId, setRoomId] = useState("")

  const handlePasteUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomId) {
      return
    }
    if (roomId.startsWith(`${isDevURL}/room/`)) {
      window.location.href = roomId
      return
    }
    const url = `${isDevURL}/room/${roomId}`
    window.location.href = url
  }

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <PasteUrlWrapper>
      <PasteUrlText
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 80 }}
      >
        Join existing room
      </PasteUrlText>
      <PasteUrlForm
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 80 }}
        onSubmit={handlePasteUrl}
      >
        <Input
          ref={inputRef}
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID or full URL"
        />
        <Button whileTap={{ scale: 0.98 }}>
          <span>Join room</span> <FaRocket style={{ marginLeft: 7 }} />
        </Button>
      </PasteUrlForm>
    </PasteUrlWrapper>
  )
}

export default JoinRoomModal

// Styles
const PasteUrlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PasteUrlText = styled(motion.h3)`
  margin: 0 0 5rem 0;
  font-size: 5rem;
  color: var(--tertiaryColor);
`

const PasteUrlForm = styled(motion.form)`
  display: flex;
  align-items: center;
  background: linear-gradient(-45deg, #1a0d2b 50%, #4d2f72);
  padding: 1.7rem;
  border-radius: 5px;
`

const Input = styled.input`
  border: none;
  background: #0c0613;
  color: var(--textColor);
  padding: 0.8em 1em;
  font-size: 2rem;
  border-radius: 5px;
  width: 100%;
  min-width: 40rem;
  margin-right: 1rem;
  outline: transparent;
`

const Button = styled(motion.button)`
  padding: 0.8em 1em;
  border: none;
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  color: var(--tertiaryColor);
  font-size: 2rem;
  font-weight: 600;
  height: 5.5rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
  white-space: nowrap;
  will-change: transform;
`
