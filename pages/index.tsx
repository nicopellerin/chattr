import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import shortid from "shortid"
import { FaRocket } from "react-icons/fa"
import { useRecoilState } from "recoil"

import Layout from "../components/Home/Layout"

import { usernameState } from "../store/users"

const IndexPage = () => {
  const [username, setUsername] = useRecoilState(usernameState)

  const [user, setUser] = useState("")

  const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    setUsername(user)

    typeof window !== "undefined" &&
      window.localStorage.setItem("chattr-username", JSON.stringify(user))

    const room = shortid.generate()
    router.push(`/[room]`, `/${room}`)
  }

  return (
    <Layout>
      <div>
        <LogoStyled src="/logo.svg" alt="logo" />
        <Container>
          <Tagline>Pick a username</Tagline>
          <Form onSubmit={handleSubmit}>
            <Input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Eg. koolz69"
              maxLength={20}
            />
            <Button>
              Launch chat <FaRocket style={{ marginLeft: 7 }} />
            </Button>
          </Form>
          <ShareButton>About</ShareButton>
          <Text>Free P2P audio/video + chat</Text>
          <Footer>Made by Nico Pellerin</Footer>
        </Container>
      </div>
      <svg
        style={{ position: "absolute", bottom: -50 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#001"
          fill-opacity="1"
          d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,122.7C672,128,768,192,864,213.3C960,235,1056,213,1152,176C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
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
  outline: transparent;
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
