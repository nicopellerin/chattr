import * as React from "react"
import {useEffect, useRef} from 'react'
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useStateDesigner } from "@state-designer/react"
import lottie from "lottie-web"

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
  gameScreens,
} from "../../../store/game"



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

  const lottieRef = useRef() as React.MutableRefObject<HTMLDivElement>

  let anim: any
  useEffect(() => {
    anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/confetti.json",
    })

    return () => anim.destroy()
  }, [])


  return (
    <ScreenWrapper>
      <Container
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        {wonGame ? (
          <>
            <div style={{ width: 150, height: 125 }} ref={lottieRef} />
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
