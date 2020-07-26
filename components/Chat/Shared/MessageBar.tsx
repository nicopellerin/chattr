import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaTimesCircle } from "react-icons/fa"
import { useRecoilValue } from "recoil"

import Portal from "./Portal"

import { userSoundOnState } from "../../../store/users"

interface Props {
  errorMsg: string
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>
  delay?: number
}

const MessageBar: React.FC<Props> = ({
  errorMsg = "An error has occured",
  setErrorMsg,
  delay = 3000,
}) => {
  const soundOn = useRecoilValue(userSoundOnState)

  const errorSound = new Audio("/sounds/digi_error_short.mp3")
  errorSound.volume = 0.5

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>

    if (errorMsg) {
      if (soundOn) {
        errorSound.play()
      }
      idx = setTimeout(() => setErrorMsg(""), delay)
    }

    return () => clearTimeout(idx)
  }, [errorMsg])

  return (
    <Wrapper
      initial={{ x: "-50%", y: 50 }}
      animate={{ y: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 12 }}
    >
      <Container>
        <Text>
          <FaTimesCircle style={{ marginRight: 7 }} /> {errorMsg}
        </Text>
      </Container>
      <Portal />
    </Wrapper>
  )
}

export default MessageBar

// Styles
const Wrapper = styled(motion.div)`
  position: fixed;
  bottom: 4rem;
  left: 50%;
  z-index: 9999;
  /* width: 100%; */
`

const Container = styled(motion.div)`
  background: crimson;
  padding: 1.2rem 1.5rem;
  border-radius: 5px;
  color: var(--textColor);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`

const Text = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`
