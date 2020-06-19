import * as React from "react"
import styled from "styled-components"

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
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
