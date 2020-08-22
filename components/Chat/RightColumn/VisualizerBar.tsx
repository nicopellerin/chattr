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

    if (!streamRef.current) return

    const src = context.createMediaStreamSource(streamRef.current)

    // Initiate analsyer
    const analyser = context.createAnalyser()
    analyser.smoothingTimeConstant = 0.88
    analyser.minDecibels = -88

    // Highpass filter
    const hipassFilter = context.createBiquadFilter()
    hipassFilter.type = "highpass"
    hipassFilter.frequency.value = 2300

    // Lowpass filter
    const lowpassFilter = context.createBiquadFilter()
    lowpassFilter.type = "lowpass"
    lowpassFilter.frequency.value = 10000

    hipassFilter.connect(analyser)
    lowpassFilter.connect(hipassFilter)
    src.connect(lowpassFilter)

    analyser.fftSize = 128

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    const barWidth = (WIDTH / bufferLength) * 1.25
    let barHeight
    let x = 0

    const renderFrame = () => {
      requestAnimationFrame(renderFrame)
      analyser.getByteFrequencyData(dataArray)
      x = 0

      if (ctx) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT)

        for (var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * 0.13

          const r = barHeight + 125 * (i / bufferLength)
          const g = 50 * (i / bufferLength)
          const b = 90

          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")"
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

          x += barWidth + 1
        }
      }
    }

    requestAnimationFrame(renderFrame)
  }

  useEffect(() => {
    audioVisualiser()
  }, [streamRef.current])

  return (
    <Wrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
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
  top: -143px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 1600px) {
    top: -117px;
  }
`

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  border-radius: 5px;
`

const CanvasStyled = styled(motion.canvas)`
  width: 100%;
`
