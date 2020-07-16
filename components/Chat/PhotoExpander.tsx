import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Portal from "./Portal"
import { FaTimesCircle } from "react-icons/fa"
import { useRecoilValue, useSetRecoilState } from "recoil"

import { selectedPhotoState, togglePhotoExpanderState } from "../../store/chat"

const PhotoExpander = () => {
  const selectedPhoto = useRecoilValue(selectedPhotoState)

  const setTogglePhotoExpander = useSetRecoilState(togglePhotoExpanderState)

  const [fullWidth, setFullWidth] = useState(false)

  return (
    <Wrapper
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <ExpandedImage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          layout
          src={selectedPhoto}
          alt="User sent"
          isFullWidth={fullWidth}
          onClick={() => setFullWidth((prevState) => !prevState)}
        />
        <Button
          layout
          whileHover={{ rotate: 5 }}
          onClick={() => setTogglePhotoExpander(false)}
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
  cursor: ${(props: { isFullWidth: boolean }) =>
    props.isFullWidth ? "zoom-out" : "zoom-in"};
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
