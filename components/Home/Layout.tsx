import * as React from "react"
import styled from "styled-components"

const Layout = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

export default Layout

// Styles
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: #111111;
  display: grid;
  place-items: center;
`
