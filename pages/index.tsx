import * as React from "react"
import styled from "styled-components"

import Layout from "../components/Home/Layout"
import UsernameModal from "../components/UsernameModal"
import Navbar from "../components/Home/Navbar"
import { motion } from "framer-motion"

const IndexPage = () => {
  return (
    <Layout>
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
      <Footer>Made by Nico Pellerin</Footer>
      {/* <svg
        style={{ position: "absolute", bottom: -50 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#0E0717"
          fill-opacity="1"
          d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,122.7C672,128,768,192,864,213.3C960,235,1056,213,1152,176C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg> */}
    </Layout>
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

const Footer = styled.footer`
  left: 50%;
  bottom: 5.2rem;
  position: absolute;
  color: #2fb5fc;
  transform: translateX(-50%);
  font-size: 1.7rem;
  font-weight: 700;
`
