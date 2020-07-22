import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

const Bar = () => {
  return (
    <Wrapper
      initial={{ x: "-50%" }}
      animate={{ y: [0, 5] }}
      transition={{ yoyo: "Infinity", duration: 1 }}
    >
      <Text>How it works</Text>
      <Line />
    </Wrapper>
  )
}

export default Bar

// Styles
const Wrapper = styled(motion.div)`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  bottom: 3rem;
  left: 50%;
`

const Text = styled(motion.span)`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(
    145deg,
    var(--tertiaryColor),
    var(--tertiaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Line = styled(motion.div)`
  width: 2px;
  height: 30px;
  background: -webkit-linear-gradient(
    145deg,
    var(--tertiaryColor),
    var(--secondaryColor)
  );

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--tertiaryColor);
    /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); */
    /* filter: drop-shadow(0 0.4rem 5rem rgba(131, 82, 253, 0.15)); */
  }
`
