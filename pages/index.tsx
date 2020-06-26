import * as React from "react"
import { useEffect, useState } from "react"
import Head from "next/head"
import styled from "styled-components"
import { motion } from "framer-motion"
import { detect } from "detect-browser"
import dynamic from "next/dynamic"

import UsernameModal from "../components/UsernameModal"
import Layout from "../components/Layout"
import { FaDownload } from "react-icons/fa"

const DetectWrongBrowser = dynamic(
  () => import("../components/DetectWrongBrowser"),
  {
    ssr: false,
  }
)

const IndexPage = () => {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)

  const browser = detect()

  const notSupported =
    browser?.name === "safari" ||
    browser?.name === "ie" ||
    browser?.os === "iOS" ||
    browser?.os === "Android OS"

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setSupportsPWA(true)
      setPromptInstall(e)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("transitionend", handler)
  }, [])

  const downloadTheApp = (e) => {
    e.preventDefault()
    if (promptInstall) {
      promptInstall?.prompt()
    } else {
      return
    }
  }

  return (
    <>
      <Head>
        <title>Chattr | Free P2P audio/video + chat platform</title>
      </Head>

      {notSupported ? (
        <DetectWrongBrowser />
      ) : (
        <Layout>
          <Container
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 80 }}
          >
            <UsernameModal />
            <Note
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", damping: 80, delay: 0.5 }}
            >
              At the moment, please use a desktop Chromium-based browser for the
              best experience
            </Note>
            {supportsPWA && (
              <AppButton
                onClick={downloadTheApp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 80, delay: 0.7 }}
              >
                <FaDownload style={{ marginRight: 5 }} /> Install the app
              </AppButton>
            )}
          </Container>
        </Layout>
      )}
    </>
  )
}

export default IndexPage

// Styles
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Note = styled(motion.span)`
  display: block;
  font-size: 1.7rem;
  width: 40ch;
  text-align: center;
  margin-top: 4rem;
  line-height: 1.4;

  @media (max-width: 500px) {
    width: 80vw;
    margin: 4rem auto 0;
  }
`

const AppButton = styled(motion.button)`
  margin-top: 4rem;
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  color: var(--textColor);
  border: none;
  border-radius: 5px;
  padding: 1rem 1.5rem;
  font-size: 1.7rem;
  font-weight: 600;
  cursor: pointer;
  outline: transparent;
  display: flex;
  align-items: center;
`
