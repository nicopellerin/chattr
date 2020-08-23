import * as React from "react"
import styled from "styled-components"

import Navbar from "../Navigation/Navbar"

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Wrapper data-testid="layout-wrapper">
      <Navbar />
      <Container>{children}</Container>
    </Wrapper>
  )
}

export default Layout

// Styles
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: url("/bg-2.webp");
  background-size: cover;

  @media (max-width: 500px) {
    min-height: 100vh;
  }
`

const Container = styled.main`
  display: grid;
  place-items: center;
  height: 100%;
`
