import * as React from "react"
import { detect } from "detect-browser"
import dynamic from "next/dynamic"
import Head from "next/head"

import Hero from "../components/Landing/Hero"
import HowItWorks from "../components/Landing/HowItWorks"
import Footer from "../components/Landing/Footer"

const DetectWrongBrowser = dynamic(
  () => import("../components/Chat/Shared/DetectWrongBrowser"),
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
    <>
      <Head>
        <title>Chattr · Enjoy watching videos with friends</title>
        <meta
          property="og:title"
          content="Chattr · Enjoy watching videos with friends"
        />
        <meta property="og:url" content="https://chattr.lol" />
        <meta
          property="og:description"
          content="Watch Youtube videos in-sync while you chat 👀"
        />
        <meta property="og:image" content="https://chattr.lol/og-image4.jpg" />
      </Head>
      {notSupported ? (
        <DetectWrongBrowser />
      ) : (
        <>
          <Hero />
          <HowItWorks />
          <Footer />
        </>
      )}
    </>
  )
}

export default IndexPage

// Styles
