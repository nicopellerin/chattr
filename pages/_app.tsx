import React from "react"
import { RecoilRoot } from "recoil"

import GlobalStyles from "../styles/GlobalStyles"

const MyApp = ({ Component, pageProps, router }) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} key={router.query.id} />
      <GlobalStyles />
    </RecoilRoot>
  )
}

export default MyApp
