import * as React from "react"
import { useState, useEffect } from "react"
import styled, { keyframes, css } from "styled-components"
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

import { chatVideoScreens } from "../LeftColumn/ChatVideo"
import MessageBar from "../Shared/MessageBar"

import {
  playYoutubeVideoState,
  youtubeUrlState,
  youtubeVideoMuteSoundState,
  youtubeVideoMetaDataState,
  youtubeVideoRewindState,
} from "../../../store/youtube"
import { listUsersState, usernameState } from "../../../store/users"
import { streamOtherPeerState } from "../../../store/video"

import { maxLength } from "../../../utils/maxLength"

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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        style={{ height: 400 }}
      >
        <AnimatePresence>
          {youtubeChatWindowScreensState.whenIn({
            initialScreen: (
              <Container layout="position">
                <Form onSubmit={handleSubmit}>
                  <InnerContainer>
                    <Title>
                      <span>
                        Watch <YoutubeIcon src="/yt.png" alt="Youtube logo" />
                      </span>
                      with a friend
                    </Title>
                    <Input
                      name="youtubeURL"
                      placeholder="Enter Youtube URL..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                    <WaitingButton
                      waiting={!streamOtherPeer ? true : false}
                      style={{
                        cursor:
                          noConnection && !streamOtherPeer
                            ? "not-allowed"
                            : "cursor",
                        pointerEvents:
                          noConnection || !streamOtherPeer ? "none" : "all",
                        opacity: noConnection || !streamOtherPeer ? 0.5 : 1,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {buttonText()}
                    </WaitingButton>
                  </InnerContainer>
                </Form>
              </Container>
            ),
            waitingScreen: (
              <Container layout="position">
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
              <Container layout="position">
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

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2.4rem;
  padding-top: 8rem;
  padding-bottom: 8rem;
  border-radius: 50px;
  box-shadow: 0 -8px 4px -4px rgba(0, 0, 0, 0.2);

  @media (min-width: 1800px) {
    padding-top: 7rem;
    margin-top: 3rem;
  }
`

const YoutubeIcon = styled.img`
  width: 13.5rem;
  margin-left: 1rem;
  border-radius: 5px;
  filter: drop-shadow(0 0.4rem 3rem rgba(131, 82, 253, 0.2));
`

const Title = styled.h3`
  color: var(--textColor);
  font-size: 3rem;
  text-align: center;
  max-width: 100%;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  span {
    display: flex;
    align-items: center;
    margin-bottom: 0.1rem;
  }
`

const Input = styled.input`
  border: none;
  background: #0a0515;
  color: var(--textColor);
  padding: 0.8em 0.8em;
  font-size: 1.7rem;
  font-weight: 600;
  border-radius: 5px;
  margin-bottom: 3rem;
  width: 100%;
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

const shimmer = keyframes`
    100% {
      transform: translateX(100%);
    }
`

const WaitingButton = styled(Button)`
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  color: var(--textColor);
  position: relative;
  overflow: hidden;

  ${(props: { waiting: boolean }) =>
    props.waiting &&
    css`
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(-100%);
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.05) 20%,
          rgba(255, 255, 255, 0.2) 60%,
          rgba(255, 255, 255, 0)
        );
        animation: ${shimmer} 1.5s infinite;
        content: "";
      }
    `}
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
