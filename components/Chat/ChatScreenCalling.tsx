import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { DoubleBounce } from "better-react-spinkit"

const ChatScreenCalling = () => {
  return (
    <IncomingCallWrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <IncomingCallContainer>
        <IncomingCallTitle style={{ margin: 0 }}>
          <DoubleBounce
            size={40}
            style={{ marginBottom: 40 }}
            color="var(--textColor)"
          />
          Calling...
        </IncomingCallTitle>
      </IncomingCallContainer>
    </IncomingCallWrapper>
  )
}

export default ChatScreenCalling

// Styles
const IncomingCallWrapper = styled(motion.div)`
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

const IncomingCallContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
`

const IncomingCallTitle = styled.h4`
  font-size: 3rem;
  color: var(--textColor);
  display: flex;
  flex-direction: column;
  align-items: center;
`
