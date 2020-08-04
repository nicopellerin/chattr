import { render } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"

import Hero from "../../../components/Landing/Hero"

test("renders title", () => {
  const { getByText } = render(<Hero />)
  expect(getByText("Enjoy watching videos with friends")).toBeInTheDocument()
})
