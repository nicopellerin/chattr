import * as React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
const Invite = () => {
    return (<Wrapper initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", damping: 80 }}>
      <Container>
        <Text>Invite friend via</Text>
        <a href={`http://www.facebook.com/dialog/send?app_id=296141104755109&link=${window.location.href}&redirect_uri=${window.location.href}`} target="_blank" rel="noopener">
          <FbookMessengerIcon whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} src="/messenger.svg" alt="Messenger"/>
        </a>
      </Container>
    </Wrapper>);
};
export default Invite;
// Styles
const Wrapper = styled(motion.div) `
  height: 28rem;
`;
const Container = styled(motion.div) `
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const Text = styled.span `
  font-size: 2rem;
  color: var(--textColor);
  font-weight: 600;
  margin-bottom: 2.4rem;
`;
const FbookMessengerIcon = styled(motion.img) `
  width: 6rem;
`;
