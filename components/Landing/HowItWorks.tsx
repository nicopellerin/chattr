import * as React from "react"
import styled from "styled-components"

const HowItWorks = () => {
  return (
    <Wrapper>
      <Container>
        <Title>How it works</Title>
        <Tagline>
          Chattr is a free p2p video chat app with your security in mind
        </Tagline>
        <StepsList>
          <StepsItem>
            <StepsItemOrder>1.</StepsItemOrder>
            <StepsItemTitle>Create room</StepsItemTitle>
          </StepsItem>
          <StepsItem>
            <StepsItemOrder>2.</StepsItemOrder>
            <StepsItemTitle>Invite friend</StepsItemTitle>
          </StepsItem>
          <StepsItem>
            <StepsItemOrder>3.</StepsItemOrder>
            <StepsItemTitle>Start call</StepsItemTitle>
          </StepsItem>
          <StepsItem>
            <StepsItemOrder>4.</StepsItemOrder>
            <StepsItemTitle>Enjoy watching video</StepsItemTitle>
          </StepsItem>
        </StepsList>
      </Container>
    </Wrapper>
  )
}

export default HowItWorks

// Styles
const Wrapper = styled.div`
  background: #0c0614;
  min-height: 60rem;
  position: relative;
  z-index: 2;
`

const Container = styled.div`
  max-width: 85vw;
  margin: 0 auto;
  padding: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h3`
  font-size: 5rem;
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--secondaryColor)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3rem;
`

const Tagline = styled.span`
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--textColor);
  margin-bottom: 7rem;
`

const StepsList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

const StepsItem = styled.div``

const StepsItemOrder = styled.h5`
  font-size: 6rem;
  margin: 0;
  color: var(--tertiaryColor);
`

const StepsItemTitle = styled.h4`
  font-size: 3rem;
  color: var(--textColor);
`
