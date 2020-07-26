import Head from "next/head"
import dynamic from "next/dynamic"
import styled from "styled-components"
import { detect } from "detect-browser"
import { useRouter } from "next/router"

const ChatMainClient = dynamic(() => import("../../components/Chat/Main"), {
  ssr: false,
})

const DetectWrongBrowser = dynamic(
  () => import("../../components/Chat/Shared/DetectWrongBrowser"),
  {
    ssr: false,
  }
)

const RoomPage = () => {
  const browser = detect()

  const notSupported =
    browser?.name === "safari" ||
    browser?.name === "ie" ||
    browser?.os === "iOS" ||
    browser?.os === "Android OS"

  const { query } = useRouter()

  return (
    <>
      <Head>
        <title>Chattr · Room: {query?.room}</title>
        <meta property="og:title" content={`Chattr · Join room`} />
        <meta
          property="og:description"
          content="One-on-one hangouts in a fun and secure way"
        />
        <meta property="og:image" content="https://chattr.lol/og-image4.jpg" />
        {/* <script>
          if(/^\?fbclid=/.test(location.search))
          location.replace(location.href.replace(/\?fbclid.+/, ""));
        </script> */}
      </Head>
      <Wrapper>
        {notSupported ? <DetectWrongBrowser /> : <ChatMainClient />}
      </Wrapper>
    </>
  )
}

export default RoomPage

// Styles
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  background: linear-gradient(45deg, rgba(12, 6, 19, 0.8), rgba(12, 6, 19, 0.9)),
    url("/bg-2.webp");
  background-size: cover;
  background-position: center left;

  @media (max-width: 500px) {
    min-height: 100%;
  }
`
