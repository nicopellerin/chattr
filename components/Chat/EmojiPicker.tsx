import * as React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Picker from "emoji-picker-react"

import Portal from "./Portal"
import { FaTimes } from "react-icons/fa"

interface Props {
  setMsg: React.Dispatch<React.SetStateAction<string>>
  setTogglePicker: React.Dispatch<React.SetStateAction<boolean>>
  inputTextRef: React.MutableRefObject<HTMLInputElement>
}

const EmojiPicker: React.FC<Props> = ({
  setMsg,
  setTogglePicker,
  inputTextRef,
}) => {
  const [chosenEmoji, setChosenEmoji] = useState<any>(null)

  const onEmojiClick = (_: any, emojiObject: any) => {
    setChosenEmoji(emojiObject)
    inputTextRef.current.focus()
  }

  useEffect(() => {
    if (chosenEmoji) {
      setMsg((prevState: string) => prevState + chosenEmoji?.emoji)
    }
  }, [chosenEmoji])

  return (
    <Wrapper>
      <CloseButton
        onClick={(e) => {
          e.stopPropagation()
          setTogglePicker(false)
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaTimes />
      </CloseButton>
      <Picker onEmojiClick={onEmojiClick} disableSearchBar={true} />
      <Portal />
    </Wrapper>
  )
}

export default EmojiPicker

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  bottom: 10rem;
  right: 1rem;
  z-index: 10000000;
`

const CloseButton = styled(motion.button)`
  position: absolute;
  z-index: 1000;
  right: 30px;
  top: 10px;
  border: none;
  font-size: 2rem;
  background: transparent;
  color: #aaf;
  cursor: pointer;
  outline: transparent;
`
