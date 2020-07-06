import * as React from "react"
import styled from "styled-components"
import { useRecoilValue } from "recoil"

import { youtubeProgressBarWidthState } from "../../store/youtube"

const YoutubeProgressBar = () => {
  const width = useRecoilValue(youtubeProgressBarWidthState)

  return <Bar style={{ width: width }} />
}

export default YoutubeProgressBar

// Styles
const Bar = styled.div`
  background: -webkit-linear-gradient(
    145deg,
    var(--primaryColor),
    var(--tertiaryColor)
  );
  height: 5px;
  opacity: 0.2;
`
