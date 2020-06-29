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
import { useRecoilState } from "recoil"

import { supportsPWAState } from "../store/app"

const DetectWrongBrowser = dynamic(
  () => import("../components/DetectWrongBrowser"),
  {
    ssr: false,
  }
)

const IndexPage = () => {
  const [supportsPWA, setSupportsPWA] = useRecoilState(supportsPWAState)

  const [promptInstall, setPromptInstall] = useState<any>(null)
  const [installMsg, setInstallMsg] = useState("Install the app")
  const [roomId, setRoomId] = useState("")

  const browser = detect()

  const notSupported =
    browser?.name === "safari" ||
    browser?.name === "ie" ||
    browser?.os === "iOS" ||
    browser?.os === "Android OS"

  const isDevURL =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : "https://chattr.lol"

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

  const handlePasteUrl = (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomId) {
      return
    }

    if (roomId.startsWith(`${isDevURL}/room/`)) {
      window.location.href = roomId
      return
    }

    const url = `${isDevURL}/room/${roomId}`
    window.location.href = url
  }

  const inPWA =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches

  return (
    <>
      <Head>
        <title>Chattr · Free P2P audio/video + chat platform</title>
        <meta
          property="og:title"
          content="Chattr · Free P2P audio/video + chat platform"
        />
        <meta property="og:url" content="https://chattr.lol" />
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
          <Container
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 80 }}
            style={{ height: promptInstall ? "47rem" : "auto" }}
          >
            <UsernameModal />
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
            {inPWA && (
              <PasteUrlWrapper>
                <PasteUrlText
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 80, delay: 0.3 }}
                >
                  OR
                </PasteUrlText>
                <PasteUrlForm
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 80, delay: 0.5 }}
                  onSubmit={handlePasteUrl}
                >
                  <Input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Room ID or full URL"
                  />
                  <Button>Join room</Button>
                </PasteUrlForm>
              </PasteUrlWrapper>
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

const PasteUrlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PasteUrlText = styled(motion.h3)`
  margin: 4rem 0;
  font-size: 3rem;
  color: var(--primaryColor);
`

const PasteUrlForm = styled(motion.form)`
  display: flex;
  align-items: center;
  background: linear-gradient(-45deg, #1a0d2b 50%, #4d2f72);
  padding: 1.7rem;
  border-radius: 5px;
`

const Input = styled.input`
  border: none;
  background: #0c0613;
  color: var(--textColor);
  padding: 0.8em 1em;
  font-size: 1.7rem;
  border-radius: 5px;
  width: 100%;
  margin-right: 1rem;
  outline: transparent;
`

const Button = styled(motion.button)`
  padding: 0.8em 1em;
  border: none;
  background: linear-gradient(
    140deg,
    var(--primaryColor),
    var(--primaryColorDark)
  );
  color: #0c0613;
  font-size: 1.7rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
  white-space: nowrap;
`
