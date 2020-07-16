import * as React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import { useStateDesigner, createState } from "@state-designer/react"
import {
  FaPauseCircle,
  FaPlayCircle,
  FaVolumeMute,
  FaVolumeUp,
  FaFastBackward,
} from "react-icons/fa"

import { chatVideoScreens } from "./ChatVideo"
import MessageBar from "../MessageBar"

import { expandChatWindowState } from "../../store/chat"
import {
  playYoutubeVideoState,
  youtubeUrlState,
  youtubeVideoMuteSoundState,
  youtubeVideoMetaDataState,
  youtubeVideoRewindState,
} from "../../store/youtube"
import { listUsersState, usernameState } from "../../store/users"
import { streamOtherPeerState } from "../../store/video"

import { maxLength } from "../../utils/maxLength"

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
  const chatVideoScreensState = useStateDesigner(chatVideoScreens)

  const expandChatWindow = useRecoilValue(expandChatWindowState)
  const playYoutubeVideo = useRecoilValue(playYoutubeVideoState)
  const listUsers = useRecoilValue(listUsersState)
  const streamOtherPeer = useRecoilValue(streamOtherPeerState)
  const username = useRecoilValue(usernameState)

  const [youtubeVideoMuteSound, setYoutubeVideoMuteSound] = useRecoilState(
    youtubeVideoMuteSoundState
  )
  const [youtubeVideoMetaData, setYoutubeVideoMetaData] = useRecoilState(
    youtubeVideoMetaDataState
  )
  const [youtubeVideoRewind, setYoutubeVideoRewind] = useRecoilState(
    youtubeVideoRewindState
  )

  const setYoutubeUrl = useSetRecoilState(youtubeUrlState)

  const [url, setUrl] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const noConnection = listUsers?.length < 2
  const hasConnection = listUsers?.length > 1

  const buttonText = () => {
    switch (true) {
      case noConnection || !streamOtherPeer:
        return `Waiting for call connection`
      case hasConnection:
        return `Send request`
    }
  }

  const fetchMetaData = async () => {
    const videoId = url.split("=")[1]
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YTKEY}`
    )
    const data = await res.json()
    return data?.items[0]?.snippet
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    if (
      !url.match(
        /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/
      )
    ) {
      setErrorMsg("Please enter a valid Youtube URL")
      return
    }

    setYoutubeUrl(url)
    fetchMetaData().then((meta) => {
      setYoutubeVideoMetaData(meta)
      socket.current.emit("sendYoutubeUrl", { url, meta, username })
      youtubeChatWindowScreensState.forceTransition("waitingScreen")
    })
  }

  const rewindVideo = () => {
    socket.current.emit("rewindYoutubeVideo")
  }

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>
    if (youtubeVideoRewind) {
      idx = setTimeout(() => setYoutubeVideoRewind(false), 500)
    }

    return () => clearTimeout(idx)
  }, [youtubeVideoRewind])

  return (
    <>
      <Wrapper
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 80 }}
        style={{ height: expandChatWindow ? 570 : 400 }}
      >
        <AnimatePresence>
          {youtubeChatWindowScreensState.whenIn({
            initialScreen: (
              <Container layout>
                <Form onSubmit={handleSubmit}>
                  <YoutubeIcon src="/yt.png" alt="Youtube logo" />
                  <Title style={{ marginTop: "1rem" }}>
                    Watch video with friend
                  </Title>
                  <Input
                    name="youtubeURL"
                    placeholder="Enter Youtube URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <WaitingButton
                    style={{
                      cursor:
                        noConnection && !streamOtherPeer ? "initial" : "cursor",
                      pointerEvents:
                        noConnection || !streamOtherPeer ? "none" : "all",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {buttonText()}
                  </WaitingButton>
                </Form>
              </Container>
            ),
            waitingScreen: (
              <Container layout>
                <YoutubeIcon src="/yt.png" alt="Youtube logo" />
                <Title>Waiting for your friend to accept...</Title>
                <WaitingButton
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    youtubeChatWindowScreensState.reset()
                    setUrl("")
                  }}
                >
                  Cancel
                </WaitingButton>
              </Container>
            ),
            commandScreen: (
              <Container layout>
                <WatchingWrapper>
                  <WatchingTitle>Watching</WatchingTitle>
                  <WatchingText>
                    {maxLength(youtubeVideoMetaData?.title, 30)}
                  </WatchingText>
                </WatchingWrapper>
                <CommandsWrapper>
                  <ActionButton
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      socket.current.emit("playYoutubeVideo")
                    }}
                  >
                    {playYoutubeVideo ? <FaPauseCircle /> : <FaPlayCircle />}
                  </ActionButton>
                  <ButtonGroup>
                    <MuteButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setYoutubeVideoMuteSound((prevState) => !prevState)
                      }
                    >
                      {youtubeVideoMuteSound ? (
                        <>
                          <FaVolumeMute style={{ opacity: 0.5 }} />
                        </>
                      ) : (
                        <>
                          <FaVolumeUp />
                        </>
                      )}
                    </MuteButton>
                    <RewindButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={rewindVideo}
                    >
                      <FaFastBackward />
                    </RewindButton>
                  </ButtonGroup>
                </CommandsWrapper>

                <Button
                  whileHover={{
                    scale: 1.02,
                    color: "var(--primaryColorLight)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setUrl("")
                    youtubeChatWindowScreensState.reset()
                    socket.current.emit("sendingYoutubeVideoAccepted", false)
                    chatVideoScreensState.forceTransition(
                      "youtubeVideoScreen.hidden"
                    )
                  }}
                >
                  Quit watching
                </Button>
              </Container>
            ),
          })}
        </AnimatePresence>
      </Wrapper>
      <AnimatePresence>
        {errorMsg && (
          <MessageBar errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
        )}
      </AnimatePresence>
    </>
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

const YoutubeIcon = styled.img`
  position: absolute;
  top: 4rem;
  width: 18rem;
`

const Title = styled.h3`
  color: var(--tertiaryColor);
  font-size: 2.6rem;
  text-align: center;
  max-width: 100%;
  margin-bottom: 2rem;
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
  height: 48px;

  &::placeholder {
    color: rgba(240, 32, 216, 0.57);
  }
`

const CommandsWrapper = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.01),
    rgba(156, 116, 254, 0.1)
  );
  padding: 2rem 4rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 3rem;
  /* filter: drop-shadow(0 0.75rem 8rem rgba(131, 82, 253, 0.45)); */
`

const Button = styled(motion.button)`
  background: rgba(255, 255, 255, 0.01);
  border: none;
  border-radius: 5px;
  padding: 0.8em 1em;
  font-weight: 600;
  font-size: 1.7rem;
  color: var(--primaryColor);
  cursor: pointer;
  outline: transparent;
  height: 48px;
`

const ActionButton = styled(motion.button)`
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
  margin-bottom: 2.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
`

const MuteButton = styled(motion.button)`
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05),
    rgba(156, 116, 254, 0.1)
  );
  padding: 1rem;
  border: none;
  font-weight: 600;
  font-size: 2.4rem;
  border-radius: 50%;
  height: 4rem;
  width: 4rem;
  font-weight: 600;
  color: var(--primaryColorLight);
  cursor: pointer;
  outline: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
`

const WaitingButton = styled(Button)`
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  color: var(--textColor);
`

const RewindButton = styled(MuteButton)`
  margin-left: 2rem;
`

const WatchingWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 3rem;
`

const WatchingTitle = styled.h5`
  margin: 0;
  color: var(--tertiaryColor);
  font-size: 2.4rem;
  margin-bottom: 1rem;
`

const WatchingText = styled.span`
  margin: 0;
  color: var(--textColor);
  font-size: 1.7rem;
  font-weight: 600;
`
