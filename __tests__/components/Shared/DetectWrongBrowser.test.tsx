import { render } from "@testing-library/react"

import DetectWrongBrowser from "../../../components/Chat/Shared/DetectWrongBrowser"

test("renders if browser is not Firefox or Chromium", () => {
  const browser = { name: "ie", os: "windows" }

  const notSupported =
    browser?.name === "safari" ||
    browser?.name === "ie" ||
    browser?.os === "iOS" ||
    browser?.os === "Android OS"

  if (notSupported) {
    const { getByTestId } = render(<DetectWrongBrowser />)
    expect(getByTestId("logo-detect-browser")).toBeInTheDocument()
  } else {
    fail("Browser is chrome. Should not have rendered")
  }
})
