import * as React from "react"
import styled from "styled-components"

import UsernameModal from "../UsernameModal"
import Portal from "./Portal"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const NoUsername: React.FC<Props> = ({ socket }) => {
  return (
    <>
      <Wrapper>
        <UsernameModal
          buttonText="Join room"
          noUsernameModal={true}
          socket={socket}
        />
      </Wrapper>
      <Portal />
    </>
  )
}

export default NoUsername

// Styles
const Wrapper = styled.div`
  position: fixed;
  z-index: 2000;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9));
  /* backdrop-filter: blur(15px); */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
