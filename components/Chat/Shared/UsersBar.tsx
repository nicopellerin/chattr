import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useRecoilValue } from "recoil"

import { otherUsernameQuery, otherUserAvatarQuery } from "../../../store/users"

const UsersBar = () => {
  const otherUsername = useRecoilValue(otherUsernameQuery)
  const otherAvatar = useRecoilValue(otherUserAvatarQuery)

  return (
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", damping: 13 }}
      layout="position"
    >
      <Container>
        <UsersList>
          <UsersItem>
            <UsersItemAvatar src={otherAvatar} alt="Other avatar" />
            <UsersItemOtherUsername>{otherUsername}</UsersItemOtherUsername>
          </UsersItem>
        </UsersList>
      </Container>
    </Wrapper>
  )
}

export default UsersBar

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: auto;
  border-radius: 5px;
`

const Container = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const UsersItem = styled.div`
  display: flex;
  align-items: center;
`

const UsersItemAvatar = styled.img`
  margin-right: 1rem;
  width: 2rem;
`

const UsersItemOtherUsername = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--secondaryColor);
`
