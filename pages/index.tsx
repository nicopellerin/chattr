import * as React from "react"
import styled from "styled-components"

import Layout from "../components/Home/Layout"

const IndexPage = () => {
  return (
    <Layout>
      <Container>
        <LogoStyled src="/logo.png" alt="logo" />
        <Tagline>Free P2P audio/video + chat</Tagline>
        <form>
          <input />
        </form>
      </Container>
    </Layout>
  )
}

export default IndexPage

// Styles
const LogoStyled = styled.img`
  width: 250px;
  justify-self: center;
  margin-bottom: 4rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Tagline = styled.h3`
  font-size: 3rem;
  color: #d0d9eb;
`
