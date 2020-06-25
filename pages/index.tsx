import * as React from "react"
import Head from "next/head"
import styled from "styled-components"
import { motion } from "framer-motion"

import UsernameModal from "../components/UsernameModal"
import Layout from "../components/Layout"
import DetectWrongBrowser from "../components/DetectWrongBrowser"

const IndexPage = () => {
  if (
    typeof window !== "undefined" &&
    window.navigator.userAgent.search("Safari") >= 0 &&
    window.navigator.userAgent.search("Chrome") < 0
  ) {
    return <DetectWrongBrowser />
  }

  return (
    <>
      <Head>
        <title>Chattr | Free P2P audio/video + chat platform</title>
      </Head>
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
        </Container>
      </Layout>
    </>
  )
}

export default IndexPage

// Styles
const Container = styled(motion.div)``

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
