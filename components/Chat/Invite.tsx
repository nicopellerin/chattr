import * as React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaLink } from "react-icons/fa"
import { copyToClipboard } from "../../utils/copyToClipboard"

const Invite = () => {
  const [copied, setCopied] = useState(false)

  let copySounds = new Audio("/sounds/etc_camera_shutter.mp3")

  useEffect(() => {
    let idx: ReturnType<typeof setTimeout>

    if (copied) {
      idx = setTimeout(() => {
        setCopied(false)
      }, 2000)
    }

    return () => clearTimeout(idx)
  }, [copied])

  return (
    <Wrapper
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", damping: 80 }}
    >
      <Container>
        <Text>Invite friend via</Text>
        <a
          href={`http://www.facebook.com/dialog/send?app_id=296141104755109&link=${window.location.href}&redirect_uri=${window.location.href}`}
          target="_blank"
          rel="noopener"
        >
          <FbookMessengerIcon
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            src="/messenger.svg"
            alt="Messenger"
          />
        </a>
        <CopyButton
          onClick={() => {
            copyToClipboard(window.location.href)
            setCopied((prevState) => !prevState)
            copySounds.play()
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          disabled={copied}
        >
          <FaLink style={{ marginRight: 7 }} />{" "}
          {copied ? `Copied to clipboard` : `Copy room link`}
        </CopyButton>
      </Container>
    </Wrapper>
  )
}

export default Invite

// Styles
const Wrapper = styled(motion.div)`
  height: 28rem;
`

const Container = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const Text = styled.span`
  font-size: 2rem;
  color: var(--textColor);
  font-weight: 600;
  margin-bottom: 2rem;
`

const CopyButton = styled(motion.button)`
  margin-top: 5rem;
  background: ${(props: { disabled: boolean }) =>
    props.disabled
      ? "green"
      : `linear-gradient(
    180deg,
    var(--primaryColor),
    var(--primaryColorDark)
  )`};
  color: var(--textColor);
  border: none;
  border-radius: 5px;
  padding: 1rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  outline: transparent;
  display: flex;
  align-items: center;
`

const FbookMessengerIcon = styled(motion.img)`
  width: 6rem;
`
