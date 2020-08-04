import { render } from "@testing-library/react"

import Footer from "../../../components/Landing/Footer"

test("renders creator name", () => {
  const { getByText } = render(<Footer />)
  expect(getByText("Nico Pellerin")).toBeInTheDocument()
})
