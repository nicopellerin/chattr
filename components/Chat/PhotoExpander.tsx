import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Portal from "./Portal"
import { FaTimesCircle } from "react-icons/fa"

const PhotoExpander = ({ imageSrc, setToggle }) => {
  return (
    <Wrapper>
      <Container>
        <ExpandedImage
          animate
          layoutId="msgPhoto"
          src={imageSrc}
          alt="User sent"
        />
        <Button onClick={() => setToggle(false)}>
          <CloseIcon color="var(--textColor)" />
        </Button>
      </Container>
      <Portal />
    </Wrapper>
  )
}

export default PhotoExpander

// Styles
const Wrapper = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  position: relative;
`

const ExpandedImage = styled(motion.img)`
  max-height: 70vh;
`

const Button = styled(motion.button)`
  position: absolute;
  top: -2rem;
  right: -2rem;
  background: transparent;
  border: none;
  color: var(-textColor);
  cursor: pointer;
  outline: transparent;
`

const CloseIcon = styled(FaTimesCircle)`
  font-size: 3rem;
  color: var(-textColor);
`
