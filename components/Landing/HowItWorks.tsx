import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { Waypoint } from "react-waypoint"

const stepsData = [
  {
    id: 1,
    src: "/create.webp",
    alt: "Step 1 - Create",
    title: "Create room",
    desc: "Just choose a username and an avatar",
  },
  {
    id: 2,
    src: "/invite.webp",
    alt: "Step 2 - Invite",
    title: "Invite friend",
    desc: "Invite via Messenger, email or by copying link",
  },
  {
    id: 3,
    src: "/call.webp",
    alt: "Step 3 - Start call",
    title: "Start call",
    desc: "Press phone button on the right to start calling",
  },
  {
    id: 4,
    src: "/youtube.webp",
    alt: "Step 4 - Pick a Youtube video",
    title: "Pick a Youtube video",
    desc: "Copy and paste any Youtube video url",
  },
  {
    id: 5,
    src: "/yt-watch.webp",
    alt: "Step 4 - Enjoy watching :)",
    title: "Enjoy watching :)",
    desc: "Press play and enjoy! Oh and try moving the progress bar",
  },
]

const listVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const itemVariant = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Waypoint onEnter={() => setIsVisible(true)}>
      {isVisible && (
        <Wrapper>
          <Container>
            <Title>How it works</Title>
            <Tagline>
              Chattr is a free p2p video chat app with your security in mind
            </Tagline>
            <StepsList
              variants={listVariant}
              initial="hidden"
              animate="visible"
            >
              {stepsData.map(({ id, src, alt, title, desc }) => (
                <StepsItem key={id} variants={itemVariant}>
                  <StepsItemImgWrapper>
                    <StepsItemImg loading="lazy" src={src} alt={alt} />
                  </StepsItemImgWrapper>
                  <StepsItemHeading>
                    <StepsItemOrder>{id}.</StepsItemOrder>
                    <StepsItemTitle>{title}</StepsItemTitle>
                  </StepsItemHeading>
                  <StepsItemDesc>{desc}</StepsItemDesc>
                </StepsItem>
              ))}
            </StepsList>
          </Container>
        </Wrapper>
      )}
    </Waypoint>
  )
}

export default HowItWorks

// Styles
const Wrapper = styled.div`
  background: #0e0718;
  min-height: 60rem;
  position: relative;
  z-index: 2;
  /* height: 100%; */
`

const Container = styled.div`
  max-width: 85vw;
  margin: 0 auto;
  padding: 6rem;
  padding-bottom: 14rem;
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

  @media (min-width: 1800px) {
    margin-bottom: 12rem;
  }
`

const StepsList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(300px, 1fr));
  grid-gap: 6rem 7rem;
  justify-content: center;

  &:last-of-type {
    grid-column: 1 / -1;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 1800px) {
    grid-gap: 9rem 10rem;
  }
`

const StepsItem = styled(motion.div)``

const StepsItemImgWrapper = styled.div`
  height: 35rem;
  display: flex;
  align-items: center;

  @media (min-width: 1800px) {
    margin-bottom: 3rem;
  }
`

const StepsItemImg = styled.img`
  max-width: 100%;
  max-height: 400px;
`

const StepsItemHeading = styled.div`
  display: flex;
  align-items: baseline;
`

const StepsItemOrder = styled.h4`
  font-size: 3.5rem;
  margin: 0;
  margin-right: 1.5rem;
  color: var(--tertiaryColor);
`

const StepsItemTitle = styled.h5`
  font-size: 3rem;
  margin-bottom: 1.7rem;
  color: var(--primaryColorLight);
`

const StepsItemDesc = styled.span`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--textColor);
  line-height: 1.4;
`
