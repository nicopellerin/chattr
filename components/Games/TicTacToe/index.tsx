import * as React from "react"

import Game from "./Game"

interface Props {
  setPlayGame: React.Dispatch<React.SetStateAction<boolean>>
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const TicTacToe: React.FC<Props> = ({ setPlayGame, socket }) => {
  return <Game socket={socket} setPlayGame={setPlayGame} />
}

export default TicTacToe
