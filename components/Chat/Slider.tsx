import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { wrap } from "@popmotion/popcorn"
import styled from "styled-components"
import { FaTimesCircle } from "react-icons/fa"

const images = [
  "/cats/cat1.jpg",
  "/cats/cat2.jpg",
  "/cats/cat3.jpg",
  "/cats/cat4.jpg",
  "/cats/cat5.jpg",
  "/cats/cat6.jpg",
  "/cats/cat7.jpg",
  "/cats/cat8.jpg",
  "/cats/cat9.jpg",
  "/cats/cat10.jpg",
  "/cats/cat11.jpg",
  "/cats/cat12.jpg",
  "/cats/cat13.jpg",
  "/cats/cat14.jpg",
  "/cats/cat15.jpg",
  "/cats/cat16.jpg",
  "/cats/cat17.jpg",
  "/cats/cat18.jpg",
]

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

const Slider = ({ setShowCatSlider }) => {
  const [[page, direction], setPage] = useState([
    0 + Math.floor(Math.random() * 19),
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

  return (
    <motion.div
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
      <Container>
        <CloseIcon onClick={() => setShowCatSlider(false)} />
        <AnimatePresence initial={false} custom={direction}>
          <ImageStyled
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
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
          />
        </AnimatePresence>
        {/* <NextIcon onClick={() => paginate(1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="42">
          <path
            d="M 1.067 0.94 C 2.069 -0.058 3.69 -0.058 4.693 0.94 L 22.821 18.992 C 23.821 19.988 23.821 21.607 22.821 22.603 L 22.821 22.603 C 21.818 23.601 20.198 23.601 19.195 22.603 L 1.067 4.551 C 0.067 3.555 0.067 1.936 1.067 0.94 Z M 22.547 19.399 C 23.547 20.395 23.547 22.014 22.547 23.01 L 4.419 41.062 C 3.417 42.06 1.796 42.06 0.793 41.062 L 0.793 41.062 C -0.207 40.066 -0.207 38.447 0.793 37.451 L 18.922 19.399 C 19.924 18.401 21.545 18.401 22.547 19.399 Z"
            fill="#111"
          ></path>
        </svg>
      </NextIcon>
      <PrevIcon onClick={() => paginate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="42">
          <path
            d="M 1.067 0.94 C 2.069 -0.058 3.69 -0.058 4.693 0.94 L 22.821 18.992 C 23.821 19.988 23.821 21.607 22.821 22.603 L 22.821 22.603 C 21.818 23.601 20.198 23.601 19.195 22.603 L 1.067 4.551 C 0.067 3.555 0.067 1.936 1.067 0.94 Z M 22.547 19.399 C 23.547 20.395 23.547 22.014 22.547 23.01 L 4.419 41.062 C 3.417 42.06 1.796 42.06 0.793 41.062 L 0.793 41.062 C -0.207 40.066 -0.207 38.447 0.793 37.451 L 18.922 19.399 C 19.924 18.401 21.545 18.401 22.547 19.399 Z"
            fill="#111"
          ></path>
        </svg>
      </PrevIcon> */}
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
const Container = styled.div`
  background: #000;
  width: 100%;
  height: 67rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const ImageStyled = styled(motion.img)`
  position: absolute;
  width: 100%;
  height: 72rem;
  object-fit: cover;
`

const NextIcon = styled.div`
  top: calc(50% - 60px);
  position: absolute;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  z-index: 2;
  right: 3rem;
`

const PrevIcon = styled.div`
  top: calc(50% - 50px);
  position: absolute;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  z-index: 2;
  left: 3rem;
  transform: rotate(-180deg);
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
