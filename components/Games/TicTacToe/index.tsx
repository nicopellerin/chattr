import * as React from "react"

import Game from "./Game"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const TicTacToe: React.FC<Props> = ({ socket }) => {
  return <Game socket={socket} />
}

export default TicTacToe
