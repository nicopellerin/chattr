import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import Layout from "../components/Home/Layout"
import { FaRocket } from "react-icons/fa"

const IndexPage = () => {
  return (
    <Layout>
      <div>
        <LogoStyled src="/logo.svg" alt="logo" />
        <Container>
          <Tagline>Pick a username</Tagline>
          <Form>
            <Input placeholder="Some random name" />
            <Button>
              Launch chat <FaRocket style={{ marginLeft: 7 }} />
            </Button>
          </Form>
          <ShareButton>About</ShareButton>
          <Text>Free P2P audio/video + chat</Text>
          <Footer>Made by Nico Pellerin</Footer>
        </Container>
      </div>
    </Layout>
  )
}

export default IndexPage

// Styles
const LogoStyled = styled.img`
  width: 20rem;
  position: absolute;
  top: 3rem;
  left: 8rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a0d2b;
  padding: 5rem;
  border-radius: 10%;
  width: 40rem;
  height: 30rem;
  border-bottom: 7px solid var(--primaryColorDark);
`

const Tagline = styled.span`
  font-size: 3rem;
  color: var(--textColor);
  margin-bottom: 2rem;
  font-weight: 600;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30rem;
`

const Input = styled.input`
  border: none;
  background: #0c0613;
  color: var(--textColor);
  padding: 0.8em 1em;
  font-size: 2rem;
  border-radius: 5px;
  margin-bottom: 3rem;
  width: 100%;
`

export const Button = styled(motion.button)`
  padding: 1em 1.5em;
  border: none;
  background: var(--tertiaryColor);
  color: #0c0613;
  font-size: 2rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`

const ShareButton = styled(motion.button)`
  padding: 0.7em 1.5em;
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
  position: absolute;
  right: 8rem;
  top: 3.5rem;
`

const Text = styled.span`
  font-size: 2rem;
  font-weight: 700;
  position: absolute;
  left: 50%;
  top: 5.2rem;
  color: var(--textColor);
  transform: translateX(-50%);
`

const Footer = styled.footer`
  left: 50%;
  bottom: 5.2rem;
  position: absolute;
  color: #2fb5fc;
  transform: translateX(-50%);
  font-size: 1.7rem;
  font-weight: 700;
`
