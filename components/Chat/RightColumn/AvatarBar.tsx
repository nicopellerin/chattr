import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilState } from "recoil"

import { avatarState } from "../../../store/users"

import { useClickOutside } from "../../../hooks/useClickOutside"

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
  setToggleAvatar: React.Dispatch<React.SetStateAction<boolean>>
}

const AvatarBar: React.FC<Props> = ({ setToggleAvatar }) => {
  const [avatar, setAvatar] = useRecoilState(avatarState)

  const node = useClickOutside(setToggleAvatar)

  const handleChangeAvatar = (avatarImg: string) => {
    const selectSound = new Audio("/sounds/select-char4.mp3")
    selectSound.volume = 0.3
    setAvatar(avatarImg)
    selectSound.play()
    setToggleAvatar(false)
    typeof window !== "undefined" &&
      window.sessionStorage.setItem("chattr-avatar", JSON.stringify(avatarImg))
  }

  return (
    <AvatarsContainer
      variants={avatarsContainerVariant}
      initial="hidden"
      animate="visible"
      exit="hidden"
      ref={node}
    >
      {avatars.map((avatarImg) => {
        return (
          <AvatarItem
            key={avatarImg}
            variants={avatarVariant}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChangeAvatar(avatarImg)}
          >
            <Avatar
              animate={{ opacity: avatar === avatarImg ? 1 : 0.5 }}
              whileHover={{ opacity: 1 }}
              src={avatarImg}
              alt="avatar"
              width="24"
            />
          </AvatarItem>
        )
      })}
    </AvatarsContainer>
  )
}

export default AvatarBar

// Styles
const AvatarsContainer = styled(motion.ul)`
  display: flex;
  align-items: baseline;
  justify-content: space-around;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-bottom: 2.4rem;
  position: absolute;
  z-index: 200;
  background: #1a0d2b;
  width: 34rem;
  padding: 0 1rem;
  border-radius: 5px;
  top: -65px;
  left: -0.7rem;
  min-height: 64px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

  &:after {
    content: "";
    position: absolute;
    left: 35px;
    bottom: -1rem;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #1a0d2b;
  }
`

const AvatarItem = styled(motion.li)`
  list-style: none;
  margin: 0;
  margin-top: 0.7rem;
  padding: 0;
`

const Avatar = styled(motion.img)`
  cursor: pointer;
`
