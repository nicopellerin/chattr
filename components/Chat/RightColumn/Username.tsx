import * as React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue, useRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import { FaCog, FaWaveSquare } from "react-icons/fa"

import VisualizerBar from "./VisualizerBar"
import AvatarBar from "./AvatarBar"

import {
  usernameState,
  userSoundOnState,
  avatarState,
  toggleVisualizerState,
} from "../../../store/users"
import { getUserMediaNotSupportedState } from "../../../store/video"

interface Props {
  streamRef: React.MutableRefObject<MediaStream>
}

const ChatUsername: React.FC<Props> = ({ streamRef }) => {
  const username = useRecoilValue(usernameState)
  const avatar = useRecoilValue(avatarState)
  const getUserMediaNotSupported = useRecoilValue(getUserMediaNotSupportedState)

  const [soundOn, setSoundOn] = useRecoilState(userSoundOnState)
  const [toggleVisualizer, setToggleVisualizer] = useRecoilState(
    toggleVisualizerState
  )

  const [toggleDrawer, setToggleDrawer] = useState(false)
  const [toggleAvatar, setToggleAvatar] = useState(false)

  const beepOn = new Audio("/sounds/slide_drop.mp3")
  const swoosh = new Audio("/sounds/paper_slide.mp3")
  beepOn.volume = 0.2
  swoosh.volume = 0.2

  useEffect(() => {
    window.localStorage.setItem("chattr-sounds-on", JSON.stringify(soundOn))
  }, [soundOn])

  return (
    <Wrapper>
      <AnimatePresence initial={false}>
        {toggleVisualizer && <VisualizerBar streamRef={streamRef} />}
      </AnimatePresence>
      <Container>
        <AnimatePresence initial={false}>
          {toggleDrawer ? (
            <>
              <ToggleWrapper
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                exit={{ y: 30 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <Text style={{ marginRight: 20 }}>Sound FX</Text>
                <ToggleSwitch
                  onClick={() => {
                    setSoundOn((prevState) => !prevState)
                    if (!soundOn) {
                      swoosh.play()
                    }
                  }}
                >
                  <ToggleSwitchCheckbox
                    type="checkbox"
                    name="status"
                    id="status"
                  />
                  <ToggleSwitchLabel>
                    <ToggleSwitchInner layout isOn={soundOn ? true : false} />
                    <ToggleSwitchSwitch
                      layout
                      isOn={soundOn ? true : false}
                    ></ToggleSwitchSwitch>
                  </ToggleSwitchLabel>
                </ToggleSwitch>
              </ToggleWrapper>
            </>
          ) : (
            <UsernameWrapper
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              exit={{ y: 30 }}
              transition={{ type: "spring", damping: 17 }}
            >
              <Avatar
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                src={avatar}
                alt="avatar"
                onClick={() => setToggleAvatar((prevState) => !prevState)}
              />
              <Username>{username}</Username>
            </UsernameWrapper>
          )}
        </AnimatePresence>
        <div>
          {!getUserMediaNotSupported && (
            <IconWave
              onClick={() => setToggleVisualizer((prevState) => !prevState)}
            />
          )}
          <IconCog
            onClick={() => {
              setToggleDrawer((prevState) => !prevState)
              if (soundOn) {
                beepOn.play()
              }
            }}
          />
        </div>
        <AnimatePresence>
          {toggleAvatar && <AvatarBar setToggleAvatar={setToggleAvatar} />}
        </AnimatePresence>
      </Container>
    </Wrapper>
  )
}

export default ChatUsername

// Styles
const Wrapper = styled.div`
  position: relative;
`

const Container = styled.form`
  background: #1a0d2b;
  height: 100%;
  padding: 1.2rem 1.7rem;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  min-height: 65px;
  box-shadow: 0 0.7rem 5rem rgba(131, 82, 253, 0.1);

  @media (min-width: 1600px) {
    height: 75px;
  }
`

const Text = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  margin-right: 1rem;
  color: var(--textColor);
`

const Avatar = styled(motion.img)`
  width: 2.6rem;
  margin-right: 1.4rem;
  cursor: pointer;
`

const Username = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--tertiaryColor);
`

const IconCog = styled(FaCog)`
  font-size: 2rem;
  color: #aaa;
  cursor: pointer;
  transition: all 300ms ease-in-out;

  &:hover {
    color: #eef;
    transform: rotate(90deg);
  }
`

const IconWave = styled(FaWaveSquare)`
  font-size: 2rem;
  color: #aaa;
  cursor: pointer;
  transition: all 300ms ease-in-out;
  margin-right: 2rem;

  &:hover {
    color: #eef;
  }
`

const UsernameWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
`

const ToggleWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 2rem;
  box-shadow: 0 10px 5px -5px rgba(0, 0, 0, 0.03);
  transition: background 0.3s ease-in 0s;
`

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  display: inline-block;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  text-align: left;
`

const ToggleSwitchCheckbox = styled.input`
  display: none;
`

const ToggleSwitchLabel = styled.label`
  display: block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px;
  margin: 0;
  box-shadow: inset rgba(0, 0, 0, 0.1) 0px 7px 15px;
  background-color: #0c0613;
`

const ToggleSwitchInner = styled(motion.span)`
  display: block;
  width: 100%;
  margin-left: ${(props: { isOn: boolean }) => (props.isOn ? 0 : "-100%")};

  &:before,
  :after {
    display: block;
    float: left;
    width: 50%;
    height: 25px;
    padding: 0;
    line-height: 25px;
    font-size: 1.4em;
    color: white;
    font-family: inherit;
    font-weight: 500;
    box-sizing: border-box;
  }

  &:before {
    content: "On";
    padding-left: 15px;
    color: transparent;
  }

  &:after {
    content: "Off";
    padding-right: 13px;
    color: transparent;
    text-align: right;
  }
`

const ToggleSwitchSwitch = styled(motion.span)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  margin: 0px;
  background: ${(props: { isOn: boolean }) =>
    props.isOn ? "linear-gradient(45deg, #d852fd, #9c74fe)" : "#f4f4f4"};
  position: absolute;
  top: -1px;
  bottom: 0;
  right: ${(props: { isOn: boolean }) => (props.isOn ? "0px" : "21px")};
  border-radius: 50%;
  color: #fff;
  filter: drop-shadow(0 0 0.75rem rgba(89, 86, 213, 0.25));
`
