import * as React from "react"
import styled from "styled-components"
import Head from "next/head"
import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"

import Layout from "../components/Layout"

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>Chattr | About</title>
      </Head>
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 80 }}
        >
          <Container>
            <Title>About Chattr</Title>
            <Text>
              Chattr is a free 1-to-1 P2P audio/video and chat platform built by
              Nico Pellerin. It provides a secure way of communicating on the
              web. The project is still in its infancy and more features will
              likely be added.
            </Text>
            <Text>
              Please note, if you get the{" "}
              <strong>Streaming is not supported</strong> screen, make sure you
              accepted the request to allow video/audio. If this still doesn't
              work, try using a recent Chromium-based browser or Firefox. IE is
              not supported.
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
  align-items: center;
`

const Title = styled.h2`
  font-size: 4rem;
  color: var(--tertiaryColor);
  text-align: center;
`

const Text = styled.p`
  color: var(--textColor);
  font-size: 1.7rem;
  line-height: 1.47059;
  margin-bottom: 1rem;
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
`