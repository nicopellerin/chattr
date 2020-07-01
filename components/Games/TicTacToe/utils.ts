enum SquareValue {
  X = "X",
  O = "O",
}

export const calculateWinner = (squares: Array<SquareValue | null>) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return true
    }
  }
  return false
}

export const calculateTie = (
  squares: Array<SquareValue | null>,
  winner: boolean
) => {
  if (squares.every((square) => square !== null) && !winner) {
    return true
  }
  return false
}
