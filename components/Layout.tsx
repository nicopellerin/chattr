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
      {children}
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
  display: grid;
  place-items: center;
`

const Footer = styled.footer`
  left: 50%;
  bottom: 5.2rem;
  position: absolute;
  color: #2fb5fc;
  transform: translateX(-50%);
  font-size: 1.7rem;
  font-weight: 700;

  a {
    color: var(--tertiaryColor);
    text-decoration: none;
  }
`
