import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import Square from "./Square"

enum SquareValue {
  "X",
  "O",
}

interface Props {
  squares: Array<SquareValue | null>
  onClick: (i: number) => void
}

const Board: React.FC<Props> = ({ squares, onClick }) => {
  return (
    <Wrapper animate={{ scale: [0.9, 1.03, 1] }}>
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={() => onClick(i)} />
      ))}
    </Wrapper>
  )
}

export default Board

// Styles
const Wrapper = styled(motion.div)`
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  grid-gap: 1rem;
  height: 100%;
`
