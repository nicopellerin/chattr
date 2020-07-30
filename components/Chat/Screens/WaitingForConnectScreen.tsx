import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { ThreeBounce } from "better-react-spinkit"

const WaitingForConnectScreen = () => {
  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container layout>
        <Title style={{ margin: 0 }}>
          <ThreeBounce
            size={30}
            style={{ marginBottom: 30 }}
            color="var(--secondaryColor)"
          />
          <Text
            animate={{ scale: [1, 1.05] }}
            transition={{ yoyo: "Infinity", duration: 2 }}
          >
            Waiting for friend to connect
          </Text>
        </Title>
      </Container>
    </Wrapper>
  )
}

export default WaitingForConnectScreen

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

const Title = styled(motion.h4)`
  font-size: 4rem;
  /* color: #f9e4fe; */
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Text = styled(motion.span)`
  text-align: center;
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
