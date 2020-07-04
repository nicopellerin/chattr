import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import { useStateDesigner, createState } from "@state-designer/react"
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa"

import { expandChatWindowState } from "../../store/chat"

import { playYoutubeVideoState, youtubeUrlState } from "../../store/youtube"

export const youtubeChatWindowScreens = createState({
  id: "youtubeChatWindow",
  initial: "initialScreen",
  states: {
    initialScreen: {},
    waitingScreen: {},
    commandScreen: {},
  },
})

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const YoutubeChatWindow: React.FC<Props> = ({ socket }) => {
  const youtubeChatWindowScreensState = useStateDesigner(
    youtubeChatWindowScreens
  )

  const expandChatWindow = useRecoilValue(expandChatWindowState)
  const playYoutubeVideo = useRecoilValue(playYoutubeVideoState)

  const setYoutubeUrl = useSetRecoilState(youtubeUrlState)

  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setYoutubeUrl(url)
    socket.current.emit("sendYoutubeUrl", url)
    youtubeChatWindowScreensState.forceTransition("waitingScreen")
  }

  return (
    <Wrapper style={{ height: expandChatWindow ? 585 : 400 }}>
      <AnimatePresence>
        {youtubeChatWindowScreensState.whenIn({
          initialScreen: (
            <Container
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 80 }}
            >
              <Form onSubmit={handleSubmit}>
                <Title>Watch Youtube video with friend</Title>
                <Input
                  name="youtubeURL"
                  placeholder="Enter Youtube URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <Button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Send request
                </Button>
              </Form>
            </Container>
          ),
          waitingScreen: (
            <Container>
              <Title>Waiting for your friend to accept...</Title>
              <Button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  youtubeChatWindowScreensState.reset()
                  setUrl("")
                }}
              >
                Cancel
              </Button>
            </Container>
          ),
          commandScreen: (
            <Container>
              <CommandsWrapper>
                <PauseButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    socket.current.emit("playYoutubeVideo")
                  }}
                >
                  {playYoutubeVideo ? <FaPauseCircle /> : <FaPlayCircle />}
                </PauseButton>
                <Button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setUrl("")
                    youtubeChatWindowScreensState.reset()
                  }}
                >
                  Quit watching
                </Button>
              </CommandsWrapper>
            </Container>
          ),
        })}
      </AnimatePresence>
    </Wrapper>
  )
}

export default YoutubeChatWindow

// Styles
const Wrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  color: var(--textColor);
  font-size: 1.7rem;
  line-height: 1.4;
  position: relative;
`

const Container = styled(motion.div)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.15);
  border-bottom: 7px solid #0c0613;
  border-radius: 75px;
  background: #1a0d2b;
  filter: drop-shadow(0 0.7rem 0.2rem rgba(131, 82, 253, 0.05));
`

const Form = styled.form`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.h3`
  color: var(--tertiaryColor);
  font-size: 3rem;
  text-align: center;
  max-width: 90%;
`

const Input = styled.input`
  border: none;
  background: #0c0613;
  color: var(--textColor);
  padding: 0.8em 1em;
  font-size: 1.7rem;
  border-radius: 5px;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 90%;
  outline: transparent;
`

const CommandsWrapper = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.01),
    rgba(156, 116, 254, 0.1)
  );
  padding: 4rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`

const Button = styled(motion.button)`
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  border: none;
  border-radius: 5px;
  padding: 0.8em 1em;
  font-weight: 600;
  font-size: 1.7rem;
  color: var(--textColor);
  cursor: pointer;
  outline: transparent;
  height: 48px;
`

const PauseButton = styled(motion.button)`
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), #9c74fe);
  padding: 1rem;
  border: none;
  border-radius: 50%;
  height: 10rem;
  width: 10rem;
  font-weight: 600;
  font-size: 9rem;
  color: var(--textColor);
  cursor: pointer;
  outline: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
`
