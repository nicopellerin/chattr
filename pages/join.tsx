import * as React from "react"
import { useEffect, useState } from "react"
import Head from "next/head"
import styled from "styled-components"
import { motion } from "framer-motion"
import { detect } from "detect-browser"
import dynamic from "next/dynamic"
import { useRecoilState } from "recoil"
import { FaDownload } from "react-icons/fa"

import Layout from "../components/Landing/Layout"
import JoinRoomModal from "../components/Chat/Shared/JoinRoomModal"

import { supportsPWAState } from "../store/app"

const DetectWrongBrowser = dynamic(
  () => import("../components/Chat/Shared/DetectWrongBrowser"),
  {
    ssr: false,
  }
)

const JoinPage = () => {
  const [supportsPWA, setSupportsPWA] = useRecoilState(supportsPWAState)

  const [promptInstall, setPromptInstall] = useState<any>(null)
  const [installMsg, setInstallMsg] = useState("Install the app")

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

  const downloadTheApp = (e: React.MouseEvent) => {
    e.preventDefault()
    promptInstall.prompt()
    promptInstall.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        setInstallMsg("App installed")
      }
    })
  }

  const inPWA =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches

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
      {notSupported ? (
        <DetectWrongBrowser />
      ) : (
        <Layout>
          <Container style={{ height: promptInstall ? "47rem" : "auto" }}>
            <JoinRoomModal />
            {!inPWA && (
              <Note
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", damping: 80, delay: 0.5 }}
              >
                At the moment, please use a desktop Chromium-based browser for
                the best experience
              </Note>
            )}
            {supportsPWA && (
              <AppButton
                onClick={(e) =>
                  installMsg === "Install the app" ? downloadTheApp(e) : null
                }
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 80, delay: 0.7 }}
                style={{
                  cursor:
                    installMsg === "Install the app" ? "cursor" : "initial",
                }}
              >
                <FaDownload style={{ marginRight: 5 }} />
                {installMsg}
              </AppButton>
            )}
          </Container>
        </Layout>
      )}
    </>
  )
}

export default JoinPage

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
  margin-top: 3rem;
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
