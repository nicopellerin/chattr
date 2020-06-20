import * as React from "react"
import styled from "styled-components"
import Head from "next/head"
import { motion } from "framer-motion"

import Navbar from "../components/Navbar"

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>Chattr | About</title>
      </Head>
      <Wrapper>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 80 }}
        >
          <Container>
            <Title>About Chattr</Title>
            <Text>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam
              delectus beatae quas rem, fuga, a cum, iusto dolore repellendus
              quam nostrum commodi eius id architecto dignissimos. Ratione
              nostrum esse deserunt.
            </Text>
            <Text>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam
              delectus beatae quas rem, fuga, a cum, iusto dolore repellendus
              quam nostrum commodi eius id architecto dignissimos. Ratione
              nostrum esse deserunt.
            </Text>
          </Container>
        </motion.div>
        <Footer>
          Made by{" "}
          <a href="https://nicopellerin.io" target="_blank">
            Nico Pellerin
          </a>
        </Footer>
      </Wrapper>
    </>
  )
}

export default AboutPage

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

const Container = styled.div`
  max-width: 80ch;
  margin: 0 auto;
  background: transparent;
  padding: 4rem;
  border-radius: 5px;
`

const Title = styled.h2`
  font-size: 4rem;
  color: var(--tertiaryColor);
  text-align: center;
`

const Text = styled.p`
  color: var(--textColor);
  font-size: 1.7rem;
  line-height: 1.6;
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
