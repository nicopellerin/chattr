import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { FaRocket } from "react-icons/fa"
import { useSetRecoilState, useRecoilState } from "recoil"
import { useRouter } from "next/router"
import shortid from "shortid"

import MessageBar from "./MessageBar"

import { usernameState, avatarState } from "../store/users"

const avatars = [
  "/avatars/cat.png",
  "/avatars/dead.png",
  "/avatars/black-unicorn.png",
  "/avatars/white-robot.png",
  "/avatars/test.png",
  // "/avatars/square-top.png",
]

const avatarsContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // delay: 0.1,
      // when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const avatarVariant = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

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
        <Tagline htmlFor="username">Hello, stranger!</Tagline>
        <Input
          id="username"
          required
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Pick a username..."
          maxLength={18}
        />
        <AvatarsContainer
          variants={avatarsContainerVariant}
          initial="hidden"
          animate="visible"
        >
          {avatars.map((avatarImg) => {
            return (
              <AvatarItem
                key={avatarImg}
                variants={avatarVariant}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const selectSound = new Audio("/sounds/select-char4.mp3")
                  selectSound.volume = 0.3
                  setAvatar(avatarImg)
                  selectSound.play()
                }}
              >
                <Avatar
                  animate={{ opacity: avatar === avatarImg ? 1 : 0.3 }}
                  whileHover={{ opacity: 1 }}
                  src={avatarImg}
                  alt="avatar"
                  width="32"
                />
              </AvatarItem>
            )
          })}
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
  padding: 4rem 3rem;
  border-radius: 10%;
  border-bottom: 7px solid var(--primaryColor);
  min-width: 41rem;
  box-shadow: 0 0.4rem 5rem rgba(131, 82, 253, 0.2);

  @media (max-width: 500px) {
    width: 90vw;
    margin: 0 auto;
    filter: none;
    padding: 4rem 5rem;
  }
`

const AvatarsContainer = styled(motion.ul)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-bottom: 2.4rem;
`

const AvatarItem = styled(motion.li)`
  list-style: none;
  margin: 0;
  padding: 0;
`

const Avatar = styled(motion.img)`
  cursor: pointer;
`

const Tagline = styled.label`
  font-family: "Lora", sans-serif;
  font-size: 3.4rem;
  /* color: var(--tertiaryColor); */
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  font-weight: 600;
  /* letter-spacing: 1.4px; */
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Input = styled.input`
  border: none;
  /* background: #0c0613; */
  background: rgba(12, 6, 19, 0.87);
  color: var(--secondaryColor);
  padding: 0.9em 0.7em;
  font-size: 2rem;
  font-weight: 500;
  border-radius: 5px;
  margin-bottom: 2rem;
  width: 80%;
  outline: transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  &::placeholder {
    color: rgba(240, 32, 216, 0.5);
  }
`

const Button = styled(motion.button)`
  padding: 1em 1.5em;
  border: none;
  /* background: var(--tertiaryColor); */
  background: -webkit-linear-gradient(
    125deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
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
