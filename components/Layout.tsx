import * as React from "react"
import styled from "styled-components"

import Navbar from "./Navbar"

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Wrapper>
      <Navbar />
      <Container>{children}</Container>
      <Footer>
        Made by{" "}
        <a href="https://nicopellerin.io" target="_blank" rel="noreferrer">
          Nico Pellerin
        </a>
      </Footer>
    </Wrapper>
  )
}

export default Layout

// Styles
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(12, 6, 19, 0.9), rgba(12, 6, 19, 0.99)),
    url("/bg.jpg");
  background-size: cover;

  @media (max-width: 500px) {
    min-height: 100vh;
  }
`

const Container = styled.main`
  display: grid;
  place-items: center;
  height: calc(100% - 150px);
`

const Footer = styled.footer`
  color: #2fb5fc;
  font-size: 1.7rem;
  font-weight: 700;
  padding-bottom: 4rem;
  text-align: center;

  a {
    color: var(--tertiaryColor);
    text-decoration: none;
  }

  @media (max-width: 500px) {
    padding-bottom: 3rem;
  }
`
