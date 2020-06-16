import React from "react"

import GlobalStyles from "../styles/GlobalStyles"

const MyApp = ({ Component, pageProps, router }) => {
  return (
    <>
      <Component {...pageProps} key={router.query.id} />
      <GlobalStyles />
    </>
  )
}

export default MyApp
