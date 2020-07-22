import * as React from "react"
import Hero from "../components/Landing/Hero"
import HowItWorks from "../components/Landing/HowItWorks"
import Footer from "../components/Landing/Footer"
import { detect } from "detect-browser"
import dynamic from "next/dynamic"

const DetectWrongBrowser = dynamic(
  () => import("../components/DetectWrongBrowser"),
  {
    ssr: false,
  }
)

const IndexPage = () => {
  const browser = detect()

  const notSupported =
    browser?.name === "safari" ||
    browser?.name === "ie" ||
    browser?.os === "iOS" ||
    browser?.os === "Android OS"

  return (
    <div>
      {notSupported ? (
        <DetectWrongBrowser />
      ) : (
        <>
          <Hero />
          <HowItWorks />
          <Footer />
        </>
      )}
    </div>
  )
}

export default IndexPage

// Styles
