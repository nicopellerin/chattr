import * as React from "react"
import styled from "styled-components"

const Footer = () => {
  return (
    <Wrapper>
      Made by
      <a
        href="https://nicopellerin.io"
        target="_blank"
        rel="noreferrer"
        style={{ marginLeft: 5 }}
      >
        Nico Pellerin
      </a>
    </Wrapper>
  )
}

export default Footer

// Styles
const Wrapper = styled.footer`
  background: #0e0718;
  color: #2fb5fc;
  font-size: 1.7rem;
  font-weight: 700;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12rem;
  padding-bottom: 4rem;

  a {
    color: var(--tertiaryColor);
    text-decoration: none;
  }

  @media (max-width: 500px) {
    padding-bottom: 3rem;
  }
`
