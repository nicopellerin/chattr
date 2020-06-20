import * as React from "react"
import Head from "next/head"
import styled from "styled-components"
import { motion } from "framer-motion"

import UsernameModal from "../components/UsernameModal"
import Layout from "../components/Layout"

const IndexPage = () => {
  return (
    <>
      <Head>
        <title>Chattr | Free P2P audio/video + chat platform</title>
      </Head>
      <Layout>
        <motion.div
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
        </motion.div>
      </Layout>
    </>
  )
}

export default IndexPage

// Styles
const Note = styled(motion.span)`
  display: block;
  font-size: 1.7rem;
  width: 40ch;
  text-align: center;
  margin-top: 4rem;
  line-height: 1.4;
`
