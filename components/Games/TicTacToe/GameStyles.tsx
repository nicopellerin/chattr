import styled from "styled-components"
import { motion } from "framer-motion"

// Styles
const Wrapper = styled.div`
  height: 400px;
`

const ScreenWrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), #0f0818);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const NotYourTurnWrapper = styled(ScreenWrapper)`
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.2), #0f0818);
`

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -5rem;
`

const NoMarginContainer = styled(Container)`
  margin-top: -3rem;
`

const WinnerText = styled.h3`
  color: var(--tertiaryColor);
  font-size: 3.4rem;
  margin: 0 auto;
  margin-bottom: 3rem;
  text-align: center;
  line-height: 1.3;
  max-width: 90%;
`

const WaitingText = styled.h5`
  color: var(--tertiaryColor);
  font-size: 3rem;
  text-align: center;
  line-height: 1.3;
  margin: 0 auto;
  max-width: 80%;
`

const XWonText = styled.span`
  color: var(--primaryColor);
`

const OWonText = styled.span`
  color: var(--secondaryColor);
`

const RematchButton = styled(motion.button)`
  background: linear-gradient(45deg, #d852fd, #9c74fe);
  border: none;
  border-radius: 5px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.7rem;
  color: var(--textColor);
  cursor: pointer;
  outline: transparent;
`

const QuitButton = styled(RematchButton)`
  background: var(--primaryColorDark);
  margin-top: 2rem;
`

export {
  Wrapper,
  ScreenWrapper,
  NotYourTurnWrapper,
  Container,
  NoMarginContainer,
  WinnerText,
  WaitingText,
  XWonText,
  OWonText,
  RematchButton,
  QuitButton,
}
