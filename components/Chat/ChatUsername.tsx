import * as React from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"

import { usernameState } from "../../store/users"

const ChatUsername = () => {
  const username = useRecoilValue(usernameState)

  return (
    <Wrapper>
      <Text>Username</Text>
      <Username>{username}</Username>
    </Wrapper>
  )
}

export default ChatUsername

// Styles
const Wrapper = styled.form`
  background: #1e1e1e;
  height: 100%;
  padding: 1.5rem 2rem;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr auto;
  display: flex;
  align-items: center;
`

const Text = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  margin-right: 1rem;
  color: var(--textColor);
`

const Username = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--secondaryColor);
`
