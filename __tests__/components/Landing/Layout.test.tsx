import { render } from "@testing-library/react"

import Layout from "../../../components/Landing/Layout"

test("renders without crashing", () => {
  const { getByTestId } = render(<Layout />)
  expect(getByTestId("link-join")).toBeInTheDocument()
})
