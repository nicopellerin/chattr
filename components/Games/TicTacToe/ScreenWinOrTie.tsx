import * as React from "react"
import Lottie from "react-lottie"
import { useRecoilValue, useSetRecoilState } from "recoil"

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
  playGameState,
  xIsNextState,
} from "../../../store/game"

import wonAnim from "./confetti.json"

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
  const playerXGlobal = useRecoilValue(playerXGlobalState)
  const playerOGlobal = useRecoilValue(playerOGlobalState)
  const wonGame = useRecoilValue(wonGameState)
  const xIsNext = useRecoilValue(xIsNextState)

  const setPlayGame = useSetRecoilState(playGameState)

  const handleReplay = () => {
    // Temp
    // if (true) return
    // setBoard(Array(9).fill(null))
    // setXisNext(true)
    // setWon(false)
    // setPlayGameShowInitialScreen(false)
    // setShowWaitingScreen(true)
    // socket.current.emit("playGameOtherPlayerAccepted", true)
    // socket.current.emit("startGame", username)
    // socket.current.emit("playGameAssignPlayers", {
    //   playerX: { username, letter: "X" },
    //   playerO: { username: otherUsername, letter: "O" },
    // })
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
          onClick={handleReplay}
        >
          Re-match
        </RematchButton>
        <QuitButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setPlayGame(false)
            socket.current.emit("playGameOtherPlayerAccepted", false)
          }}
        >
          Quit
        </QuitButton>
      </Container>
    </ScreenWrapper>
  )
}

export default ScreenWinOrTie
