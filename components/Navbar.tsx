import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"

const Navbar = () => {
  const { pathname } = useRouter()

  return (
    <Wrapper>
      <Link href="/">
        <LogoStyled src="/logo.svg" alt="logo" />
      </Link>
      <Text>Free P2P audio/video + chat platform</Text>
      <Link href="/about">
        <ButtonAbout
          style={{
            textDecoration: pathname === "/about" ? "underline" : "none",
          }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          About
        </ButtonAbout>
      </Link>
    </Wrapper>
  )
}

export default Navbar

// Styles
const Wrapper = styled.nav`
  position: absolute;
  top: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
`

const LogoStyled = styled.img`
  width: 20rem;
  cursor: pointer;
  padding: 1rem 0;
`

const ButtonAbout = styled(motion.button)`
  border: none;
  background: transparent;
  color: var(--primaryColor);
  font-size: 2rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
  margin-top: 1.5rem;
`

const Text = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--textColor);
  margin-top: 1.5rem;
`
