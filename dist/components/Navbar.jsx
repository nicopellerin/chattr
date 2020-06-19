import * as React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
const Navbar = () => {
    return (<Wrapper>
      <LogoStyled src="/logo.svg" alt="logo"/>
      <Text>Free P2P audio/video + chat</Text>
      <ButtonAbout whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>
        About
      </ButtonAbout>
    </Wrapper>);
};
export default Navbar;
// Styles
const Wrapper = styled.nav `
  position: absolute;
  top: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
`;
const LogoStyled = styled.img `
  width: 20rem;
`;
const ButtonAbout = styled(motion.button) `
  /* padding: 0.7em 1.5em; */
  border: none;
  background: transparent;
  color: var(--primaryColor);
  font-size: 2rem;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: transparent;
`;
const Text = styled.span `
  font-size: 2rem;
  font-weight: 700;
  color: var(--textColor);
`;
