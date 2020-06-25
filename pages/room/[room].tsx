import Head from "next/head"
import dynamic from "next/dynamic"
import styled from "styled-components"
import { useRouter } from "next/router"

const ChatMainClient = dynamic(() => import("../../components/Chat/ChatMain"), {
  ssr: false,
})

const IndexPage = () => {
  const { query } = useRouter()
  return (
    <>
      <Head>
        <title>{`Chattr | Room: ${query?.room}`}</title>
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
  min-height: 100%;
  width: 100%;
  background: linear-gradient(
      45deg,
      rgba(12, 6, 19, 0.85),
      rgba(12, 6, 19, 0.97)
    ),
    url("/bg-2.jpg");
  background-size: cover;
  background-position: center left;

  @media (max-width: 500px) {
    min-height: 100%;
  }
`
