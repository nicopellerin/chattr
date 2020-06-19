import * as React from "react"
import styled from "styled-components"
import { FaPlusCircle } from "react-icons/fa"
import { motion } from "framer-motion"

const Invite = () => {
  const inviteFriend = async () => {
    if (typeof window !== "undefined" && navigator && navigator.share) {
      try {
        await navigator.share({
          title: "Chattr",
          text: "Share this session with a friend",
          url: window.location.href,
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <Wrapper
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container onClick={inviteFriend}>
        <Icon />
        <Text>Invite friend</Text>
      </Container>
    </Wrapper>
  )
}

export default Invite

// Styles
const Wrapper = styled(motion.div)`
  height: 28rem;
`

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const Icon = styled(FaPlusCircle)`
  font-size: 3rem;
  margin-bottom: 1.4rem;
  color: var(--tertiaryColor);
`

const Text = styled.span`
  font-size: 2rem;
  color: var(--textColor);
  font-weight: 600;
`
