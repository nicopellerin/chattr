import * as React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ThreeBounce } from "better-react-spinkit";
const ChatScreenWaitingForConnect = () => {
    return (<Wrapper initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", damping: 80 }}>
      <Container>
        <Title style={{ margin: 0 }}>
          <ThreeBounce size={30} style={{ marginBottom: 40 }} color="var(--textColor)"/>
          {"Waiting for friend to connect :)"}
        </Title>
      </Container>
    </Wrapper>);
};
export default ChatScreenWaitingForConnect;
// Styles
const Wrapper = styled(motion.div) `
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Container = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
`;
const Title = styled.h4 `
  font-size: 3rem;
  color: var(--textColor);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
