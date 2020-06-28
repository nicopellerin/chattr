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
  socket?: React.MutableRefObject<SocketIOClient.Socket>
}

const UsernameModal: React.FC<Props> = ({
  buttonText = "Launch chat",
  noUsernameModal = false,
  socket,
}) => {
  const setUsername = useSetRecoilState(usernameState)

  const [user, setUser] = useState("")

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUsername(user)

    typeof window !== "undefined" &&
      window.sessionStorage.setItem("chattr-username", JSON.stringify(user))

    if (noUsernameModal && socket) {
      socket?.current?.emit("username", user)
      return
    }

    const room = shortid.generate()
    router.push(`/room/[room]`, `/room/${room}`)
  }

  return (
    <Container>
      <Form
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <Tagline htmlFor="username">Pick a username</Tagline>
        <Input
          id="username"
          required
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Eg. koolz69"
          maxLength={18}
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
  background: linear-gradient(-45deg, #1a0d2b 50%, #4d2f72);
  padding: 5rem;
  border-radius: 10%;
  border-bottom: 7px solid var(--primaryColor);

  @media (max-width: 500px) {
    width: 90vw;
    margin: 0 auto;
    filter: none;
    padding: 4rem 5rem;
  }
`

const Tagline = styled.label`
  font-size: 3rem;
  color: var(--textColor);
  margin-bottom: 2rem;
  font-weight: 600;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
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
