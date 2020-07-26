import * as React from "react"
import styled from "styled-components"

import Portal from "./Portal"

const DetectWrongBrowser = () => {
  return (
    <WrapperDetectBrowser>
      <LogoDetectBrowser src="/logo-3d.svg" alt="logo" />
      <TextDetectBrowser>
        Chattr doesn't currently support your browser. Please use a desktop
        Chromium-based browser (Chrome, Edge, Brave) or Firefox.
      </TextDetectBrowser>
      <Portal />
    </WrapperDetectBrowser>
  )
}

export default DetectWrongBrowser

// Styles
const WrapperDetectBrowser = styled.div`
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: url("/bg-2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 2000;

  @media (max-width: 500px) {
    min-height: 100vh;
  }
`

const LogoDetectBrowser = styled.img`
  width: 50rem;
  margin-bottom: 8rem;

  @media (max-width: 600px) {
    width: 35rem;
    margin-bottom: 5rem;
  }
`

const TextDetectBrowser = styled.span`
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--textColor);
  max-width: 55ch;
  text-align: center;
  line-height: 1.6;

  @media (max-width: 600px) {
    font-size: 2rem;
    padding: 0 2rem;
    max-width: 30ch;
  }
`
