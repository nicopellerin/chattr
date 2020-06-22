import * as React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { useRecoilValue, useRecoilState } from "recoil"

import { fileNameState, receivingFileState } from "../../store/chat"

interface Props {
  acceptFile: () => void
}

const ChatScreenReceivingFile: React.FC<Props> = ({ acceptFile }) => {
  const fileName = useRecoilValue(fileNameState)

  const [receivingFile, setReceivingFile] = useRecoilState(receivingFileState)

  let sound = new Audio("/sounds/connection.mp3")
  sound.volume = 0.3

  useEffect(() => {
    if (receivingFile) {
      sound.play()
    }
  }, [receivingFile])

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <Title>Your friend wants to send a file</Title>
        <Filename>{fileName}</Filename>
        <ButtonWrapper>
          <AcceptButton
            onClick={() => {
              acceptFile()
              setReceivingFile(false)
            }}
            whileTap={{ y: 1 }}
            whileHover={{ y: -1 }}
          >
            <FaCheckCircle size={14} style={{ marginRight: 7 }} />
            Accept
          </AcceptButton>
          <RejectButton
            onClick={() => {
              // setCancelCallRequest(true)
              // socket.current.emit("cancelCallRequest")
            }}
            whileTap={{ y: 1 }}
            whileHover={{ y: -1 }}
          >
            <FaTimesCircle size={14} style={{ marginRight: 7 }} />
            Reject
          </RejectButton>
        </ButtonWrapper>
      </Container>
    </Wrapper>
  )
}

export default ChatScreenReceivingFile

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
`

const Title = styled.h4`
  font-size: 4rem;
  color: var(--tertiaryColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
`

const Filename = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: var(--textColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
`

const ButtonWrapper = styled.div`
  display: flex;
`

export const AcceptButton = styled(motion.button)`
  padding: 1em 1.5em;
  border: none;
  background: #28d728;
  color: #ffe9ff;
  font-size: 1.7rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`

const RejectButton = styled(AcceptButton)`
  margin-left: 3rem;
  background: crimson;
`
