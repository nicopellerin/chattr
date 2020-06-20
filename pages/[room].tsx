import Head from "next/head"
import dynamic from "next/dynamic"
import styled from "styled-components"

const ChatMainClient = dynamic(() => import("../components/Chat/ChatMain"), {
  ssr: false,
})

const IndexPage = () => {
  return (
    <>
      <Head>
        <title>Chattr</title>
      </Head>
      <Wrapper>
        <ChatMainClient />
      </Wrapper>
    </>
  )
}

export default IndexPage

// Styles
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: #0c0613;
`
