import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { ThreeBounce } from "better-react-spinkit"

const ChatScreenWaitingForConnect = () => {
  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <Title style={{ margin: 0 }}>
          <ThreeBounce size={30} style={{ marginBottom: 40 }} color="#f9e4fe" />
          <div>
            {/* <span>🧘‍♂️</span> */}
            <span style={{ margin: 20 }}>Waiting for friend to connect</span>
            {/* <span>🧘‍♂️</span> */}
          </div>
        </Title>
      </Container>
    </Wrapper>
  )
}

export default ChatScreenWaitingForConnect

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

  @media (max-width: 500px) {
    max-height: 300px;
  }
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
  color: #f9e4fe;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
