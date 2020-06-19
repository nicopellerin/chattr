import * as React from "react"
import styled from "styled-components"

import UsernameModal from "../components/UsernameModal"
import Navbar from "../components/Navbar"
import { motion } from "framer-motion"

const IndexPage = () => {
  return (
    <Wrapper>
      <Navbar />
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
          At the moment, please use a Chromium-based browser for the best
          experience
        </Note>
      </motion.div>
      <Footer>
        Made by{" "}
        <a href="https://nicopellerin.io" target="_blank">
          Nico Pellerin
        </a>
      </Footer>
    </Wrapper>
  )
}

export default IndexPage

// Styles
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(12, 6, 19, 0.9), rgba(12, 6, 19, 0.99)),
    url("/bg.jpg");
  background-size: cover;
  display: grid;
  place-items: center;
`

const Note = styled(motion.span)`
  display: block;
  font-size: 1.7rem;
  width: 40ch;
  text-align: center;
  margin-top: 4rem;
  line-height: 1.4;
`

const Footer = styled.footer`
  left: 50%;
  bottom: 5.2rem;
  position: absolute;
  color: #2fb5fc;
  transform: translateX(-50%);
  font-size: 1.7rem;
  font-weight: 700;

  a {
    color: var(--tertiaryColor);
    text-decoration: none;
  }
`
