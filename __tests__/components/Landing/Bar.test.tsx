import { render } from "@testing-library/react"

import Bar from "../../../components/Landing/Bar"

test("renders text", () => {
  const { getByText } = render(<Bar />)
  expect(getByText("How it works")).toBeInTheDocument()
})
