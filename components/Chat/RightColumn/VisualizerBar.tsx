import * as React from "react"
import { useRef, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

interface Props {
  streamRef: React.MutableRefObject<MediaStream>
}

const VisualizerBar: React.FC<Props> = ({ streamRef }) => {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>

  const audioVisualiser = () => {
    const context = new AudioContext()

    const src = context.createMediaStreamSource(streamRef.current)

    const analyser = context.createAnalyser()
    analyser.smoothingTimeConstant = 0.92
    analyser.minDecibels = -65

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    src.connect(analyser)
    // analyser.connect(context.destination)

    analyser.fftSize = 256

    const bufferLength = analyser.frequencyBinCount

    const dataArray = new Uint8Array(bufferLength)

    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    const barWidth = (WIDTH / bufferLength) * 1.9
    let barHeight
    let x = 0

    function renderFrame() {
      requestAnimationFrame(renderFrame)
      x = 0
      analyser.getByteFrequencyData(dataArray)

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 0.65

        for (var i = 0; i < bufferLength / 1.05; i++) {
          barHeight = dataArray[i] * 0.13

          const r = barHeight + 125 * (i / bufferLength)
          const g = 50 * (i / bufferLength)
          const b = 150

          ctx!.fillStyle = "rgb(" + r + "," + g + "," + b + ")"
          ctx!.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

          x += barWidth + 1
        }
      }
    }

    requestAnimationFrame(renderFrame)
  }

  useEffect(() => {
    if (streamRef.current) {
      audioVisualiser()
    }
  }, [streamRef.current])

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <CanvasStyled ref={canvasRef} id="canvas" />
      </Container>
    </Wrapper>
  )
}

export default VisualizerBar

// Styles
const Wrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  top: -141px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 1600px) {
    top: -119px;
  }
`

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  border-radius: 5px;
  z-index: 0;
`

const CanvasStyled = styled.canvas`
  width: 100%;
`
