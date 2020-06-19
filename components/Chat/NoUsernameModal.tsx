import * as React from "react"
import styled from "styled-components"

import UsernameModal from "../UsernameModal"
import Portal from "./Portal"

const NoUsername = () => {
  return (
    <>
      <Wrapper>
        <UsernameModal buttonText="Join chat" noUsernameModal={true} />
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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
