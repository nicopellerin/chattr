import * as React from "react"
import styled from "styled-components"
import Head from "next/head"
import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { detect } from "detect-browser"
import dynamic from "next/dynamic"

import Layout from "../components/Layout"

const DetectWrongBrowser = dynamic(
  () => import("../components/DetectWrongBrowser"),
  {
    ssr: false,
  }
)

const AboutPage = () => {
  const browser = detect()

  const notSupported =
    browser?.name === "safari" ||
    browser?.name === "ie" ||
    // browser?.os === "iOS" ||
    browser?.os === "Android OS" ||
    (typeof window !== "undefined" && window.innerWidth < 768)

  return (
    <>
      <Head>
        <title>Chattr · About</title>
        <meta property="og:title" content="Chattr · About" />
        <meta property="og:url" content="https://chattr.lol/about" />
        <meta
          property="og:description"
          content="One-on-one hangouts in a fun and secure way"
        />
        <meta property="og:image" content="https://chattr.lol/og-image4.png" />
      </Head>
      {notSupported ? (
        <DetectWrongBrowser />
      ) : (
        <Layout>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 80 }}
          >
            <Container>
              <IconLogo
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 80 }}
                src="/favicon.png"
                alt="Icon"
              />
              <Text>
                Chattr is a free 1-to-1 P2P audio/video and chat platform. Text
                is encrypted and no data is stored on any server, only in the
                browser. This means that when a session ends, all data is gone
                forever.
              </Text>
              <Text>
                Please note, if you get the{" "}
                <strong>Streaming is not supported</strong> screen, make sure
                you accepted the request to allow video/audio. If this still
                doesn't work, try using a recent Chromium-based browser or
                Firefox. IE is not supported.
              </Text>
              <Text>
                Got a suggestion or questions?{" "}
                <a href="mailto:sup@chattrl.lol">sup@chattrl.lol</a>
              </Text>
              <Link href="/">
                <BackButton
                  animate={{ opacity: [0, 1] }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                >
                  <FaArrowLeft style={{ marginRight: 7 }} /> Back
                </BackButton>
              </Link>
            </Container>
          </motion.div>
        </Layout>
      )}
    </>
  )
}

export default AboutPage

// Styles
const Container = styled.div`
  max-width: 80ch;
  margin: 0 auto;
  background: transparent;
  padding: 4rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`

const IconLogo = styled(motion.img)`
  margin-bottom: 2rem;
  width: 15rem;
  align-self: center;

  @media (max-width: 500px) {
    margin-bottom: 1.7rem;
  }
`

const Text = styled.p`
  color: var(--textColor);
  font-size: 1.7rem;
  line-height: 1.47059;
  margin-bottom: 1rem;

  a {
    color: var(--primaryColorLight);
    text-decoration: none;
    font-weight: 600;
  }
`

const BackButton = styled(motion.button)`
  background: transparent;
  border: none;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primaryColor);
  display: flex;
  align-items: center;
  margin-top: 5rem;
  outline: transparent;
  cursor: pointer;
  align-self: center;

  @media (max-width: 500px) {
    margin-top: 3rem;
  }
`
