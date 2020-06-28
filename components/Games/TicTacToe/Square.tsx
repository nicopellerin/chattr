import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

interface Props {
  value: any
  onClick: any
}

const Square: React.FC<Props> = ({ value, onClick }) => {
  return (
    <Tile
      style={{
        color: value === "X" ? "var(--primaryColor)" : "var(--secondaryColor)",
        cursor: value ? "initial" : "pointer",
        background: value ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: value ? 1 : 0.98 }}
      onClick={onClick}
    >
      <Letter
        initial={{ scale: 0.8 }}
        animate={{ scale: value !== null ? [0.8, 1.1, 1] : 1 }}
      >
        {value}
      </Letter>
    </Tile>
  )
}

export default Square

// Styles
const Tile = styled(motion.button)`
  border: none;
  outline: transparent;
`

const Letter = styled(motion.span)`
  display: block;
  font-size: 7rem;
  font-weight: 900;
`
