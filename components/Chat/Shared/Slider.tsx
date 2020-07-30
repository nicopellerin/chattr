import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { wrap } from "@popmotion/popcorn"
import styled from "styled-components"
import { FaTimesCircle } from "react-icons/fa"
import { useStateDesigner } from "@state-designer/react"

import { catSliderScreen } from "../../../store/video"

const images = [
  "/cats/cat1.webp",
  "/cats/cat2.webp",
  "/cats/cat3.webp",
  "/cats/cat4.webp",
  "/cats/cat5.webp",
  "/cats/cat6.webp",
  "/cats/cat7.webp",
  "/cats/cat8.webp",
  "/cats/cat9.webp",
  "/cats/cat10.webp",
  "/cats/cat11.webp",
  "/cats/cat12.webp",
  "/cats/cat13.webp",
  "/cats/cat14.webp",
  "/cats/cat15.webp",
  "/cats/cat16.webp",
  "/cats/cat17.webp",
  "/cats/cat18.webp",
  "/cats/cat19.webp",
]

const Slider = () => {
  const catSliderScreenState = useStateDesigner(catSliderScreen)

  const [[page, direction], setPage] = useState([
    0 + Math.floor(Math.random() * images?.length),
    0,
  ])

  const imageIndex = wrap(0, images.length, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      paginate(page + Math.floor(Math.random() * 19))
    }, 4000)

    return () => clearInterval(intervalId)
  })

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      <Container layout>
        <CloseIcon onClick={() => catSliderScreenState.send("SHOW")} />
        <AnimatePresence initial={false} custom={direction}>
          <ImageStyled
            layout="position"
            alt="Slider"
            key={page}
            loading="lazy"
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 200 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
          />
        </AnimatePresence>
      </Container>
    </motion.div>
  )
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export default Slider

// Styles
const Container = styled(motion.div)`
  background: #000;
  width: 100%;
  height: 67rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
`

const ImageStyled = styled(motion.img)`
  position: absolute;
  width: 100%;
  height: 72rem;
  object-fit: cover;
`

const CloseIcon = styled(FaTimesCircle)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 21;
  font-size: 4rem;
  color: var(--tertiaryColor);
  cursor: pointer;

  &:hover {
    transform: rotate(3deg);
  }
`
