import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Portal from "./Portal"
import { FaTimesCircle } from "react-icons/fa"

interface Props {
  imageSrc: string
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

const PhotoExpander: React.FC<Props> = ({ imageSrc, setToggle }) => {
  const [fullWidth, setFullWidth] = useState(false)

  return (
    <Wrapper>
      <Container>
        <ExpandedImage
          animate
          layoutId="msgPhoto"
          src={imageSrc}
          alt="User sent"
          isFullWidth={fullWidth}
          onClick={() => setFullWidth((prevState) => !prevState)}
        />
        <Button
          animate
          whileHover={{ rotate: 5 }}
          onClick={() => setToggle(false)}
          isFullWidth={fullWidth}
        >
          <CloseIcon title="Close" color="var(--textColor)" />
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
  max-height: ${(props: { isFullWidth: boolean }) =>
    props.isFullWidth ? "100vh" : "70vh"};
  cursor: nwse-resize;
`

const Button = styled(motion.button)`
  position: absolute;
  top: ${(props: { isFullWidth: boolean }) =>
    props.isFullWidth ? "1rem" : "-2rem"};
  right: ${(props: { isFullWidth: boolean }) =>
    props.isFullWidth ? "1rem" : "-2rem"};
  background: transparent;
  border: none;
  color: var(-textColor);
  cursor: pointer;
  outline: transparent;
  background: var(--primaryColorDark);
  border-radius: 50%;
  height: 3.5rem;
  width: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CloseIcon = styled(FaTimesCircle)`
  font-size: 3.2rem;
  color: var(-textColor);
  height: 3.5rem;
  width: 3.5rem;
`
