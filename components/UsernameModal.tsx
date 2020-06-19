import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaRocket } from "react-icons/fa"
import { useSetRecoilState } from "recoil"
import { useRouter } from "next/router"
import shortid from "shortid"

import { usernameState } from "../store/users"

interface Props {
  buttonText?: string
  noUsernameModal?: boolean
}

const UsernameModal: React.FC<Props> = ({
  buttonText = "Launch Chat",
  noUsernameModal = false,
}) => {
  const setUsername = useSetRecoilState(usernameState)
  const [user, setUser] = useState("")

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUsername(user)

    typeof window !== "undefined" &&
      window.localStorage.setItem("chattr-username", JSON.stringify(user))

    if (noUsernameModal) return

    const room = shortid.generate()
    router.push(`/[room]`, `/${room}`)
  }

  return (
    <Container noUsernameModal={noUsernameModal}>
      <Tagline>Pick a username</Tagline>
      <Form onSubmit={handleSubmit}>
        <Input
          required
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Eg. koolz69"
          maxLength={20}
        />
        <Button whileTap={{ y: 1 }} whileHover={{ y: -1 }}>
          {buttonText} <FaRocket style={{ marginLeft: 7 }} />
        </Button>
      </Form>
    </Container>
  )
}

export default UsernameModal

// Styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a0d2b;
  padding: 5rem;
  border-radius: 10%;
  border-bottom: 7px solid var(--primaryColor);
  filter: ${(props: { noUsernameModal: boolean }) =>
    props.noUsernameModal
      ? "drop-shadow(0 0 20rem rgba(131, 82, 253, 0.9))"
      : "drop-shadow(0 0 20rem rgba(131, 82, 253, 0.45))"};
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
  /* width: 30rem; */
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

const Button = styled(motion.button)`
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
