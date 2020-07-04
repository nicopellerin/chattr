import * as React from "react"
import Lottie from "react-lottie"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useStateDesigner } from "@state-designer/react"

import {
  QuitButton,
  RematchButton,
  WinnerText,
  OWonText,
  XWonText,
  Container,
  ScreenWrapper,
} from "./GameStyles"

import {
  playerXGlobalState,
  playerOGlobalState,
  wonGameState,
  xIsNextState,
  resetGameState,
} from "../../../store/game"

import wonAnim from "./confetti.json"
import { gameScreens } from "./Game"

const animOptions = {
  loop: true,
  autoplay: true,
  animationData: wonAnim,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ScreenWinOrTie: React.FC<Props> = ({ socket }) => {
  const state = useStateDesigner(gameScreens)

  const playerXGlobal = useRecoilValue(playerXGlobalState)
  const playerOGlobal = useRecoilValue(playerOGlobalState)
  const xIsNext = useRecoilValue(xIsNextState)
  const wonGame = useRecoilValue(wonGameState)

  const setResetGame = useSetRecoilState(resetGameState)

  const handleQuit = () => {
    state.reset()
    setResetGame()
    socket.current.emit("playGameOtherPlayerAccepted", false)
  }

  return (
    <ScreenWrapper>
      <Container
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        {wonGame ? (
          <>
            <Lottie
              options={animOptions}
              height={125}
              width={150}
              isStopped={!wonGame}
            />
            <WinnerText>
              {xIsNext ? (
                <OWonText>{playerOGlobal?.username}</OWonText>
              ) : (
                <XWonText>{playerXGlobal?.username}</XWonText>
              )}{" "}
              won this game!
            </WinnerText>
          </>
        ) : (
          <WinnerText>It's a draw!</WinnerText>
        )}
        <RematchButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          // onClick={() => setResetGame()}
        >
          Re-match
        </RematchButton>
        <QuitButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuit}
        >
          Quit
        </QuitButton>
      </Container>
    </ScreenWrapper>
  )
}

export default ScreenWinOrTie
