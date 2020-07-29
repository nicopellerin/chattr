import * as React from "react"
import styled from "styled-components"
import { useViewportScroll, useTransform, motion } from "framer-motion"

import Navbar from "../Navigation/Navbar"
import Bar from "./Bar"

const Hero = () => {
  const { scrollY } = useViewportScroll()
  const opacity = useTransform(scrollY, [0, 30], [1, 0])

  return (
    <div style={{ overflow: "hidden" }}>
      <Wrapper>
        <Navbar />
        <Container>
          <LeftColumn animate={{ opacity: [0, 1], y: [20, 0] }}>
            <Title>Enjoy watching videos with friends</Title>
            <Tagline>
              <span>Watch Youtube videos in-sync while you chat</span> 👀
            </Tagline>
          </LeftColumn>
          <RightColumn>
            <DemoImage
              animate={{ opacity: [0, 1], y: [20, 0] }}
              transition={{ delay: 0.2 }}
              src="/demo-yt.webp"
              alt="demo"
            />
          </RightColumn>
        </Container>
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ delay: 1.2 }}
          style={{ zIndex: 200, position: "fixed", opacity: 0 }}
        >
          <motion.div
            style={{
              opacity,
            }}
          >
            <Bar />
          </motion.div>
        </motion.div>
        <Wave
          src="/wave.svg"
          alt=""
          initial={{ y: -50 }}
          animate={{
            y: [-50, -110],
          }}
        />
      </Wrapper>
    </div>
  )
}

export default Hero

// Styles
const Wrapper = styled.div`
  background: url("/bg-2.webp");
  background-size: cover;
  height: 98vh;
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

const LeftColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  opacity: 0;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

const Title = styled.h1`
  font-size: 7rem;
  background: -webkit-linear-gradient(
    140deg,
    rgb(235, 36, 218) -200%,
    var(--textColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: 56rem;
  margin-bottom: 2.4rem;
  line-height: 1.2;
`

const Tagline = styled.h2`
  font-size: 3rem;
  max-width: 45rem;
  font-family: "Inter", sans-serif;

  span {
    display: inline;
    background: -webkit-linear-gradient(
      145deg,
      var(--primaryColor),
      var(--secondaryColor)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const DemoImage = styled(motion.img)`
  max-width: 100%;
  box-shadow: 0 0.7rem 10rem rgba(131, 82, 253, 0.1);
  border-radius: 5px;
  opacity: 0;
  border: 1px solid rgba(131, 82, 253, 0.2);
`

const Wave = styled(motion.img)`
  position: fixed;
  left: 0;
  bottom: -50;
  right: 0;
  fill: #000;

  @media (max-width: 500px) {
    bottom: -75px;
  }
`
