import * as React from "react"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { FaRocket } from "react-icons/fa"
import { useSetRecoilState, useRecoilState } from "recoil"
import { useRouter } from "next/router"
import shortid from "shortid"

import MessageBar from "./MessageBar"

import { usernameState, avatarState } from "../../../store/users"

const avatars = [
  "/avatars/white-dude.png",
  "/avatars/white-girl.png",
  "/avatars/black-girl.png",
  "/avatars/brown-dude.png",
  "/avatars/black-dude.png",
  "/avatars/white-dude2.png",
  "/avatars/white-girl2.png",
]

const avatarsContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
  const [otherUserAvatar, setOtherUserAvatar] = useState("")
  const [prevAvatar, setPrevAvatar] = useState(0)
  const [nextAvatar, setNextAvatar] = useState(5)

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

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

    if (noUsernameModal && socket?.current) {
      socket.current.emit("userJoined")
      return
    }

    const room = shortid.generate()
    router.push(`/room/[room]`, `/room/${room}`)
  }

  const handlePrevAvatar = () => {
    if (prevAvatar - 1 >= 0) {
      setPrevAvatar((prevState) => prevState - 1)
      setNextAvatar((prevState) => prevState - 1)
    }
  }

  const handleNextAvatar = () => {
    if (nextAvatar < avatars.length) {
      setPrevAvatar((prevState) => prevState + 1)
      setNextAvatar((prevState) => prevState + 1)
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  // Returns other user's avatar
  useEffect(() => {
    socket?.current?.on("otherUserAvatarStart", (avatar: string) => {
      setOtherUserAvatar(avatar)
    })
  }, [socket?.current])

  // useEffect(() => {
  //   let randomIdx
  //   if (noUsernameModal) {
  //     randomIdx = Math.floor(Math.random() * avatars.length - 1)
  //   } else {
  //     randomIdx = Math.floor(Math.random() * avatars.length)
  //   }
  //   setAvatar(avatars[randomIdx])
  // }, [])

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
          ref={inputRef}
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
          <PrevIcon
            onClick={handlePrevAvatar}
            initial={{ scale: 0.5, rotate: -180, y: "-50%", opacity: 0 }}
            animate={{ opacity: 0.8, x: [-50, 0] }}
            transition={{ delay: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="42">
              <path
                d="M 1.067 0.94 C 2.069 -0.058 3.69 -0.058 4.693 0.94 L 22.821 18.992 C 23.821 19.988 23.821 21.607 22.821 22.603 L 22.821 22.603 C 21.818 23.601 20.198 23.601 19.195 22.603 L 1.067 4.551 C 0.067 3.555 0.067 1.936 1.067 0.94 Z M 22.547 19.399 C 23.547 20.395 23.547 22.014 22.547 23.01 L 4.419 41.062 C 3.417 42.06 1.796 42.06 0.793 41.062 L 0.793 41.062 C -0.207 40.066 -0.207 38.447 0.793 37.451 L 18.922 19.399 C 19.924 18.401 21.545 18.401 22.547 19.399 Z"
                fill={prevAvatar - 1 >= 0 ? "var(--primaryColorDark)" : "#ccc"}
              ></path>
            </svg>
          </PrevIcon>
          {avatars
            .filter((avatar) => avatar !== otherUserAvatar)
            .slice(prevAvatar, nextAvatar)
            .map((avatarImg) => {
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
                  <AnimateSharedLayout>
                    <Avatar
                      whileHover={{ opacity: 1 }}
                      src={avatarImg}
                      alt="avatar"
                      width="32"
                    />
                    {avatar === avatarImg && (
                      <SelectedAvatarDot
                        layoutId="selected"
                        initial={{ x: "-50%" }}
                      />
                    )}
                  </AnimateSharedLayout>
                </AvatarItem>
              )
            })}
          <NextIcon
            onClick={handleNextAvatar}
            initial={{ scale: 0.5, y: "-50%", opacity: 0 }}
            animate={{ opacity: 0.8, x: [50, 0] }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="42">
              <path
                d="M 1.067 0.94 C 2.069 -0.058 3.69 -0.058 4.693 0.94 L 22.821 18.992 C 23.821 19.988 23.821 21.607 22.821 22.603 L 22.821 22.603 C 21.818 23.601 20.198 23.601 19.195 22.603 L 1.067 4.551 C 0.067 3.555 0.067 1.936 1.067 0.94 Z M 22.547 19.399 C 23.547 20.395 23.547 22.014 22.547 23.01 L 4.419 41.062 C 3.417 42.06 1.796 42.06 0.793 41.062 L 0.793 41.062 C -0.207 40.066 -0.207 38.447 0.793 37.451 L 18.922 19.399 C 19.924 18.401 21.545 18.401 22.547 19.399 Z"
                fill={
                  nextAvatar < avatars.length
                    ? "var(--primaryColorDark)"
                    : "#ccc"
                }
              ></path>
            </svg>
          </NextIcon>
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
  min-width: 43rem;
  box-shadow: 0 0.4rem 5rem rgba(131, 82, 253, 0.05);

  @media (max-width: 500px) {
    width: 90vw;
    margin: 0 auto;
    filter: none;
    padding: 4rem 5rem;
  }
`

const Tagline = styled.label`
  font-family: "Lora", sans-serif;
  font-size: 3.4rem;
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  font-weight: 600;
`

const AvatarsContainer = styled(motion.ul)`
  display: flex;
  align-items: baseline;
  justify-content: space-around;
  width: 95%;
  margin: 0;
  padding: 0;
  margin-bottom: 3.4rem;
  position: relative;
`

const AvatarItem = styled(motion.li)`
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
`

const Avatar = styled(motion.img)`
  cursor: pointer;
`

const SelectedAvatarDot = styled(motion.div)`
  position: absolute;
  left: 40%;
  bottom: -14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primaryColor);
`

const PrevIcon = styled(motion.div)`
  top: calc(50% + 2px);
  left: -4rem;
  position: absolute;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  z-index: 2000;
`

const NextIcon = styled(motion.div)`
  top: calc(50% + 2px);
  right: -3rem;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  z-index: 2000;
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
