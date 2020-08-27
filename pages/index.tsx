import * as React from "react"
import { detect } from "detect-browser"
import dynamic from "next/dynamic"
import Head from "next/head"

const DetectWrongBrowser = dynamic(
  () => import("../components/Chat/Shared/DetectWrongBrowser"),
  {
    ssr: false,
  }
)

const Home = dynamic(() => import("../components/Landing/Home"))

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {notSupported ? <DetectWrongBrowser /> : <Home />}
    </>
  )
}

export default IndexPage

// Styles
