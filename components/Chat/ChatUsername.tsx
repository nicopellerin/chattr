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
  background: #1a0d2b;
  height: 100%;
  padding: 1.5rem 1.7rem;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr auto;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 0 0.75rem rgba(204, 75, 194, 0.1));
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
