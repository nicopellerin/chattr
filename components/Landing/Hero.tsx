import * as React from "react"
import styled from "styled-components"
import { useViewportScroll, useTransform, motion } from "framer-motion"

import Navbar from "../Navbar"
import Bar from "./Bar"

const Hero = () => {
  const { scrollY } = useViewportScroll()
  const opacity = useTransform(scrollY, [0, 30], [1, 0])

  return (
    <div style={{ overflow: "hidden" }}>
      <Wrapper>
        <Navbar />
        <Container>
          <LeftColumn>
            <Title>Enjoy watching videos with friends</Title>
            <Tagline>Watch Youtube videos in-sync while you chat</Tagline>
          </LeftColumn>
          <RightColumn>
            <DemoImage src="/demo-yt.png" alt="demo" />
          </RightColumn>
        </Container>
        <motion.div
          style={{
            opacity,
            zIndex: 200,
            position: "fixed",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Bar opacity={{ opacity }} />
        </motion.div>
      </Wrapper>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1400"
        height="224"
        viewBox="0 0 1440 224"
        style={{
          position: "fixed",
          bottom: -90,
          // boxShadow: `-5px 0.7rem 10rem rgba(131, 82, 253, 0.6)`,
        }}
      >
        <path
          fill="#0c0614"
          id="wave_3_"
          data-name="wave (3)"
          d="M0,192l60-21.3c60-21.7,180-63.7,300-64,120,.3,240,42.3,360,48C840,160,960,128,1080,112s240-16,300-16h60V320H0Z"
          transform="translate(0 -96)"
        />
      </svg>
    </div>
  )
}

export default Hero

// Styles
const Wrapper = styled.div`
  background: url("/bg-2.jpg");
  background-size: cover;
  height: 95vh;
  overflow: hidden;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 83vw;
  height: 100%;
  margin: 0 auto;
  grid-gap: 0rem;
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

const Title = styled.h1`
  font-size: 7rem;
  background: -webkit-linear-gradient(145deg, var(--textColor), #eee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: 56rem;
  margin-bottom: 2.4rem;
`

const Tagline = styled.h2`
  font-size: 3rem;
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--secondaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: 45rem;
  font-family: "Inter", sans-serif;
`

const DemoImage = styled.img`
  max-width: 100%;
  box-shadow: 0 0.7rem 10rem rgba(131, 82, 253, 0.1);
  border-radius: 5px;
`
