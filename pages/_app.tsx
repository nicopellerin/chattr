import React from "react"
import { RecoilRoot } from "recoil"

import "react-perfect-scrollbar/dist/css/styles.css"

import GlobalStyles from "../styles/GlobalStyles"

interface Props {
  Component: any
  pageProps: any
  router: any
}

const MyApp = ({ Component, pageProps, router }: Props) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} key={router.query.id} />
      <GlobalStyles />
      <div id="portal" />
    </RecoilRoot>
  )
}

export default MyApp
