import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"

import { joinRoomState } from "../store/app"

const Navbar = () => {
  const [joinRoom, setJoinRoom] = useRecoilState(joinRoomState)

  const { pathname } = useRouter()

  return (
    <Wrapper>
      <Link href="/">
        <LogoStyled src="/logo-3d.svg" alt="logo" />
      </Link>
      <Text>Free P2P audio/video + chat platform</Text>
      <ButtonsWrapper>
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
        <Link href="/">
          <ButtonJoin
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setJoinRoom((prevState) => !prevState)}
          >
            {joinRoom ? `Start room` : `Join room`}
          </ButtonJoin>
        </Link>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default Navbar

// Styles
const Wrapper = styled.nav`
  padding-top: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 87px;

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

const ButtonAbout = styled(motion.button)`
  border: none;
  background: transparent;
  color: var(--primaryColor);
  font-size: 2rem;
  font-weight: 600;
  padding: 0.8em 1em;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
  margin-top: 1.5rem;

  @media (max-width: 500px) {
    margin-top: 2.5rem;
  }
`

const ButtonJoin = styled(motion.button)`
  padding: 0.8em 1em;
  border: none;
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  color: var(--secondaryColor);
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

const Text = styled.span`
  font-family: "Lora", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--textColor);
  margin-top: 1.4rem;
  text-align: center;

  @media (max-width: 600px) {
    display: none;
  }
`
