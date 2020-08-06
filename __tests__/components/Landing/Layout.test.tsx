import { render } from "@testing-library/react"

import Layout from "../../../components/Landing/Layout"

const renderTest = () => {
  const { getByTestId } = render(
    <Layout>
      <div data-testid="child" />
    </Layout>
  )

  const container = getByTestId("layout-wrapper")

  return {
    getByTestId,
    container,
  }
}

test("it renders children", () => {
  const { container, getByTestId } = renderTest()
  expect(container.children.length).toBe(2) // Includes <Navbar />
  expect(getByTestId("child")).toBeDefined()
})
