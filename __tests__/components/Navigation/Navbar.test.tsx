import { render } from "@testing-library/react"
// import Router from "next/router"

import Navbar from "../../../components/Navigation/Navbar"

test("renders without crashing", () => {
  const { getByTestId } = render(<Navbar />)
  expect(getByTestId("logo")).toBeInTheDocument()
})

// test("links to join page when clicked", async () => {
//   const { getByTestId } = render(<Navbar />)

//   fireEvent.click(getByTestId("link-join"))

//   // await waitFor(() => screen.getByText("Join existing"))

//   // expect(screen.getByText("Join existing")).toBeInTheDocument()
// })
