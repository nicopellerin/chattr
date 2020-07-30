import * as React from "react"
import styled, { keyframes } from "styled-components"
import { motion } from "framer-motion"
import { ThreeBounce } from "better-react-spinkit"

const CallingScreen = () => {
  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container animate>
        <Title
          animate={{ scale: [1, 1.08] }}
          transition={{ yoyo: "Infinity", duration: 2 }}
          style={{ margin: 0 }}
        >
          <ThreeBounce
            size={24}
            style={{ marginBottom: 24 }}
            color="var(--secondaryColor)"
          />
          <div>
            Calling<span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </Title>
      </Container>
    </Wrapper>
  )
}

export default CallingScreen

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
  padding: 2rem 3rem;
  border-radius: 5px;
  z-index: 2;
`

const Blink = keyframes`
    0% {
      opacity: .2;
    }

    20% {
      opacity: 1;
    }

    100% {
      opacity: .2;
    }
`

const Title = styled(motion.h4)`
  font-size: 4rem;
  /* color: #f9e4fe; */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  span {
    background: -webkit-linear-gradient(
      145deg,
      var(--primaryColor),
      var(--tertiaryColor)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${Blink};
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`
