import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Link from "next/link"
import { FaRocket } from "react-icons/fa"

const Navbar = () => {
  return (
    <Wrapper>
      <Link href="/">
        <LogoStyled src="/logo-3d.svg" alt="logo" />
      </Link>
      <ButtonsWrapper>
        <Link href="/join">
          <ButtonJoin whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>
            Join room
          </ButtonJoin>
        </Link>
        <Link href="/create">
          <ButtonCreate whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>
            <FaRocket style={{ marginRight: 5 }} /> Create room
          </ButtonCreate>
        </Link>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default Navbar

// Styles
const Wrapper = styled.nav`
  padding-top: 2rem;
  max-width: 85vw;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* height: 87px; */
  position: fixed;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 600px) {
    display: flex;
    justify-content: space-around;
    padding-top: 1rem;
  }
`

const LogoStyled = styled.img`
  width: 23rem;
  cursor: pointer;
  padding: 1rem 0;
`

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`

const ButtonJoin = styled(motion.button)`
  padding: 0.8em 1em;
  border: none;
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  color: var(--textColor);
  font-size: 2rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
  white-space: nowrap;
  margin-top: 1.3rem;
  margin-left: 2rem;
  height: 5.1rem;
`

const ButtonCreate = styled(motion.button)`
  padding: 0.8em 1em;
  border: none;
  background: linear-gradient(
    145deg,
    var(--tertiaryColor),
    var(--secondaryColor)
  );
  color: var(--primaryColorDark);
  font-size: 2rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
  white-space: nowrap;
  margin-top: 1.3rem;
  margin-left: 3rem;
  height: 5.1rem;
`
