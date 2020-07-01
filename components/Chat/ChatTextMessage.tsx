import * as React from "react"
import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import dompurify from "dompurify"
import { saveAs } from "file-saver"
import { FaExpand, FaFileDownload, FaTimes } from "react-icons/fa"
import { useRecoilValue, useRecoilCallback } from "recoil"

import PhotoExpander from "./PhotoExpander"

import { usernameState } from "../../store/users"
import { chatWindowState } from "../../store/chat"

import { Message } from "../../models"

interface Props {
  msg: string
  decryptedData: string
  filename: string | undefined
  usernameMsg: string
  id: string
  socket: React.MutableRefObject<SocketIOClient.Socket>
}

const ChatTextMessage: React.FC<Props> = React.memo(
  ({ msg, decryptedData, filename, usernameMsg, id, socket }) => {
    const username = useRecoilValue(usernameState)
    const messages = useRecoilValue(chatWindowState)

    const removeChatTextMessage = useRecoilCallback(({ set }) => {
      return (id: string) => {
        const newMessages = messages.filter(
          (message: Partial<Message>) => message.id !== id
        )
        set(chatWindowState, newMessages)
        socket.current.emit("removeChatTextMessage", newMessages)
      }
    })

    const [togglePhotoExpander, setTogglePhotoExpander] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState("")

    const sanitizer = dompurify.sanitize

    const convertLinkToHTML = (text: string) => {
      const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
      return text?.replace(
        reg,
        `<a href='$1$2' target='_blank' rel='nofollower'>$1$2</a>`
      )
    }

    return (
      <>
        <MsgWrapper
          key={id}
          initial={{ y: 5 }}
          animate={{ y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ type: "spring", damping: 80 }}
        >
          <Username me={username === usernameMsg}>{usernameMsg}</Username>
          {msg.startsWith("data:image") ? (
            <>
              <DownloadIcon
                title="Download"
                onClick={() => saveAs(msg, filename)}
              />
              <ExpandIcon
                title="Expand"
                onClick={() => {
                  setTogglePhotoExpander((prevState) => !prevState)
                  setSelectedPhoto(msg)
                }}
              />

              <MessageImage src={msg} alt="Sent photo" />
            </>
          ) : (
            <MessageOutput
              dangerouslySetInnerHTML={{
                __html: convertLinkToHTML(sanitizer(decryptedData) || msg),
              }}
            />
          )}
          {usernameMsg === username && (
            <DeleteButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => removeChatTextMessage(id)}
            >
              <FaTimes />
            </DeleteButton>
          )}
        </MsgWrapper>
        {togglePhotoExpander && (
          <PhotoExpander
            imageSrc={selectedPhoto}
            setToggle={setTogglePhotoExpander}
          />
        )}
      </>
    )
  }
)

export default ChatTextMessage

// Styles
const MsgWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #222;
  background: linear-gradient(45deg, #0c0613, #0f0818);
  border-radius: 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
  word-break: break-all;
  position: relative;
`

const Username = styled.span`
  color: ${(props: { me: boolean }) =>
    props.me ? "var(--tertiaryColor)" : "var(--secondaryColor)"};
  font-weight: 600;
`

const MessageOutput = styled.div`
  a {
    color: var(--primaryColorLight);
  }
`

const MessageImage = styled.img`
  max-width: 100%;
`

const DownloadIcon = styled(FaFileDownload)`
  position: absolute;
  top: 1.5rem;
  right: 4.5rem;
  cursor: pointer;
  color: var(--textColor);

  &:hover {
    color: #9c74fe;
  }
`

const ExpandIcon = styled(FaExpand)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  cursor: pointer;
  color: var(--textColor);

  &:hover {
    color: #d852fd;
  }
`

const DeleteButton = styled(motion.button)`
  border: none;
  background: none;
  color: crimson;
  font-size: 2rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  opacity: 0;
  transition: 150ms ease-in-out;

  ${MsgWrapper}:hover & {
    opacity: 1;
  }
`
