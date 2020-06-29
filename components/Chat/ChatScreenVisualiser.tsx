import * as React from "react"
import { useRef } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

const ChatScreenVisualiser = () => {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>

  // const audioVisualiser = (stream: any) => {
  //   const context = new AudioContext()
  //   const src = context.createMediaStreamSource(stream)

  //   const analyser = context.createAnalyser()
  //   // const smoothValue = analyser.smoothingTimeConstant;
  //   analyser.smoothingTimeConstant = 0.9

  //   const canvas = canvasRef.current
  //   const ctx = canvas.getContext("2d")

  //   src.connect(analyser)
  //   analyser.connect(context.destination)

  //   analyser.fftSize = 256

  //   const bufferLength = analyser.frequencyBinCount

  //   const dataArray = new Uint8Array(bufferLength)

  //   const WIDTH = canvas.width
  //   const HEIGHT = canvas.height

  //   const barWidth = (WIDTH / bufferLength) * 2.5
  //   let barHeight
  //   let x = 0

  //   function renderFrame() {
  //     requestAnimationFrame(renderFrame)

  //     x = 0

  //     analyser.getByteFrequencyData(dataArray)

  //     ctx!.fillStyle = "#000"
  //     ctx!.fillRect(0, 0, WIDTH, HEIGHT)

  //     for (var i = 0; i < bufferLength; i++) {
  //       barHeight = dataArray[i] * 2

  //       const r = barHeight + 125 * (i / bufferLength)
  //       const g = 50 * (i / bufferLength)
  //       const b = 150

  //       ctx!.fillStyle = "rgb(" + r + "," + g + "," + b + ")"
  //       ctx!.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

  //       x += barWidth + 1
  //     }
  //   }

  //   renderFrame()
  // }

  // useEffect(() => {
  //   // audioVisualiser(audioStream)
  // }, [])

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <canvas height={600} width={870} ref={canvasRef} id="canvas" />
      </Container>
    </Wrapper>
  )
}

export default ChatScreenVisualiser

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 5px;
  z-index: 2;
`
