import * as React from "react"
import styled from "styled-components"
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
        <Title style={{ margin: 0 }}>
          <ThreeBounce
            size={24}
            style={{ marginBottom: 24 }}
            color="var(--secondaryColor)"
          />
          Calling...
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

const Title = styled.h4`
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
`
