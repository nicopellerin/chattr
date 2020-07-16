import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { FaRocket } from "react-icons/fa"
import { useSetRecoilState, useRecoilState } from "recoil"
import { useRouter } from "next/router"
import shortid from "shortid"

import { usernameState, avatarState } from "../store/users"
import MessageBar from "./MessageBar"

const avatars = [
  "/avatars/devil.png",
  "/avatars/gurl.png",
  "/avatars/jedi.png",
  "/avatars/girl-glasses.png",
  "/avatars/tophat.png",
]

interface Props {
  buttonText?: string
  noUsernameModal?: boolean
  socket?: React.MutableRefObject<SocketIOClient.Socket>
}

const UsernameModal: React.FC<Props> = ({
  buttonText = "Launch room",
  noUsernameModal = false,
  socket,
}) => {
  const setUsername = useSetRecoilState(usernameState)
  const [avatar, setAvatar] = useRecoilState(avatarState)

  const [user, setUser] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const letters = /^[0-9a-zA-Z]+$/
    if (!user.match(letters)) {
      setErrorMsg("Username must only contain letters & numbers")
      return
    }

    setUsername(user)

    typeof window !== "undefined" &&
      window.sessionStorage.setItem("chattr-username", JSON.stringify(user))
    typeof window !== "undefined" &&
      window.sessionStorage.setItem("chattr-avatar", JSON.stringify(avatar))

    if (noUsernameModal && socket) {
      socket?.current?.emit("username", user)
      return
    }

    const room = shortid.generate()
    router.push(`/room/[room]`, `/room/${room}`)
  }

  return (
    <Container
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Form
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <Tagline htmlFor="username">Hi, stranger!</Tagline>
        <Input
          id="username"
          required
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Pick a username..."
          maxLength={18}
        />
        <AvatarsContainer>
          {avatars.map((avatarImg) => (
            <Avatar
              src={avatarImg}
              onClick={() => setAvatar(avatarImg)}
              alt="avatar"
              width="45"
              style={{ opacity: avatar === avatarImg ? 1 : 0.5 }}
            />
          ))}
        </AvatarsContainer>
        <Button whileTap={{ y: 1 }} whileHover={{ y: -1 }}>
          {buttonText} <FaRocket style={{ marginLeft: 7 }} />
        </Button>
      </Form>
      <AnimatePresence>
        {errorMsg && (
          <MessageBar errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
        )}
      </AnimatePresence>
    </Container>
  )
}

export default UsernameModal

// Styles
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #1a0d2b 50%, #4d2f72);
  padding: 4rem 4rem;
  border-radius: 10%;
  border-bottom: 7px solid var(--primaryColor);
  min-width: 40rem;
  filter: drop-shadow(0 0.7rem 2rem rgba(131, 82, 253, 0.3));

  @media (max-width: 500px) {
    width: 90vw;
    margin: 0 auto;
    filter: none;
    padding: 4rem 5rem;
  }
`

const AvatarsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 4rem;
`

const Avatar = styled.img`
  cursor: pointer;
`

const Tagline = styled.label`
  font-family: "Lora", sans-serif;
  font-size: 3.6rem;
  color: var(--tertiaryColor);
  margin-bottom: 2rem;
  font-weight: 600;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Input = styled.input`
  border: none;
  background: #0c0613;
  color: var(--textColor);
  padding: 0.9em 0.7em;
  font-size: 2rem;
  border-radius: 5px;
  margin-bottom: 3rem;
  width: 100%;
  outline: transparent;

  &::placeholder {
    color: rgba(240, 32, 216, 0.57);
  }
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
