import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaPhoneAlt, FaTimesCircle } from "react-icons/fa"

interface Props {
  setReceivingCall: React.SetStateAction<React.Dispatch<boolean>>
  acceptCall: () => void
  setCancelCall: React.SetStateAction<React.Dispatch<boolean>>
}

const ChatScreenNoVideo: React.FC<Props> = ({
  setReceivingCall,
  acceptCall,
  setCancelCall,
}) => {
  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <Title>Incoming call...</Title>
        <ButtonWrapper>
          <AcceptButton
            onClick={() => {
              setReceivingCall(false)
              acceptCall()
            }}
            whileTap={{ y: 1 }}
            whileHover={{ y: -1 }}
          >
            <FaPhoneAlt size={14} style={{ marginRight: 7 }} />
            Answer
          </AcceptButton>
          <RejectButton
            onClick={() => {
              setReceivingCall(false)
              setCancelCall(true)
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

export default ChatScreenNoVideo

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
  font-size: 3rem;
  color: var(--textColor);
  display: flex;
  flex-direction: column;
  align-items: center;
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
