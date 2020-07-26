import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import UsernameModal from "../Shared/UsernameModal"
// import Portal from "./Portal"

interface Props {
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const NoUsername: React.FC<Props> = ({ socket }) => {
  return (
    <>
      <Wrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <UsernameModal
          buttonText="Start chatting!"
          noUsernameModal={true}
          socket={socket}
        />
      </Wrapper>
      {/* <Portal /> */}
    </>
  )
}

export default NoUsername

// Styles
const Wrapper = styled(motion.div)`
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
