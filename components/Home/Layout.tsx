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
  background: #0c0613;
  display: grid;
  place-items: center;
`
