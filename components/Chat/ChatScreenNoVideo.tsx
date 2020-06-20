import * as React from "react"
// import { useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
// import { useRecoilValue } from "recoil"

// import { listUsersState } from "../../store/users"

interface Props {
  setShowCatSlider: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatScreenNoVideo: React.FC<Props> = ({ setShowCatSlider }) => {
  // const listUsers = useRecoilValue(listUsersState)

  // let conn = new Audio("/sounds/connection.mp3")

  // useEffect(() => {
  //   if (listUsers?.length > 1) {
  //     conn.play()
  //   }
  // }, [])

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <Title>{"No video connection"}</Title>
        <Tagline>
          Press <span style={{ color: "var(--primaryColor)" }}>Call</span> to
          start video/audio call
        </Tagline>
        <SlideshowButton
          onClick={() => setShowCatSlider(true)}
          whileTap={{ y: 1 }}
          whileHover={{ y: -1 }}
        >
          Show me cats instead :3
        </SlideshowButton>
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

const Title = styled.h2`
  font-size: 5rem;
  margin-bottom: 4rem;
  color: var(--tertiaryColor);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Tagline = styled.h4`
  font-size: 2rem;
  color: var(--textColor);
  margin-bottom: 5rem;
`

export const Button = styled(motion.button)`
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

const SlideshowButton = styled(Button)`
  background: var(--primaryColor);
  color: var(--textColor);
`
