import { render } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"

import HowItWorks from "../../../components/Landing/HowItWorks"

test("renders title", () => {
  const { getByText } = render(<HowItWorks />)
  expect(getByText("How it works")).toBeInTheDocument()
})
