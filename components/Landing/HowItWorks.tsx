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
            {/* <StepsItemImg src="/create.png" /> */}
            <StepsItemHeading>
              <StepsItemOrder>1.</StepsItemOrder>
              <StepsItemTitle>Create room</StepsItemTitle>
            </StepsItemHeading>
            <StepsItemDesc>Just choose a username and an avatar</StepsItemDesc>
          </StepsItem>
          <StepsItem>
            {/* <StepsItemImg src="/invite.png" /> */}
            <StepsItemHeading>
              <StepsItemOrder>2.</StepsItemOrder>
              <StepsItemTitle>Invite friend</StepsItemTitle>
            </StepsItemHeading>
            <StepsItemDesc>
              Invite via Messenger, email or by copying link
            </StepsItemDesc>
          </StepsItem>
          <StepsItem>
            {/* <StepsItemImg src="/call.png" /> */}
            <StepsItemHeading>
              <StepsItemOrder>3.</StepsItemOrder>
              <StepsItemTitle>Start call</StepsItemTitle>
            </StepsItemHeading>
            <StepsItemDesc>
              Press phone button on the right to initiate call
            </StepsItemDesc>
          </StepsItem>
          <StepsItem>
            {/* <StepsItemImg src="/demo-yt.png" /> */}
            <StepsItemHeading>
              <StepsItemOrder>4.</StepsItemOrder>
              <StepsItemTitle>Pick a Youtube video</StepsItemTitle>
            </StepsItemHeading>
            <StepsItemDesc>Copy and paste any Youtube video url</StepsItemDesc>
          </StepsItem>
          <StepsItem>
            {/* <StepsItemImg src="/demo-yt.png" /> */}
            <StepsItemHeading>
              <StepsItemOrder>5.</StepsItemOrder>
              <StepsItemTitle>Enjoy watching {":)"}</StepsItemTitle>
            </StepsItemHeading>
            <StepsItemDesc>Press play and enjoy!</StepsItemDesc>
          </StepsItem>
        </StepsList>
      </Container>
    </Wrapper>
  )
}

export default HowItWorks

// Styles
const Wrapper = styled.div`
  background: #0e0718;
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
  margin-bottom: 8rem;
`

const StepsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5rem;
`

const StepsItem = styled.div``

const StepsItemImg = styled.img`
  max-width: 100%;
  margin-bottom: 1rem;
`

const StepsItemHeading = styled.div`
  display: flex;
  align-items: baseline;
`

const StepsItemOrder = styled.h5`
  font-size: 4rem;
  margin: 0;
  margin-right: 1.5rem;
  color: var(--tertiaryColor);
`

const StepsItemTitle = styled.h4`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primaryColorLight);
`

const StepsItemDesc = styled.span`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--textColor);
`
