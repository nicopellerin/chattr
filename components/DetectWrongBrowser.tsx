import * as React from "react"
import styled from "styled-components"

const DetectWrongBrowser = () => {
  return (
    <Wrapper>
      <Logo src="/logo-3d.svg" alt="logo" />
      <Text>
        Chattr doesn't currently support your browser. Please use a
        Chromium-based browser (Chrome, Edge, Brave) or Firefox.
      </Text>
    </Wrapper>
  )
}

export default DetectWrongBrowser

// Styles
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: rgba(12, 6, 19, 1);
  background: url("/bg-2.jpg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 500px) {
    min-height: 100vh;
  }
`

const Logo = styled.img`
  width: 60rem;
  margin-bottom: 8rem;
`

const Text = styled.span`
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--textColor);
  max-width: 60ch;
  text-align: center;
  line-height: 1.4;
`
