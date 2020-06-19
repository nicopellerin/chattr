import React from "react";
import { RecoilRoot } from "recoil";
import "typeface-inter";
import GlobalStyles from "../styles/GlobalStyles";
const MyApp = ({ Component, pageProps, router }) => {
    return (<RecoilRoot>
      <Component {...pageProps} key={router.query.id}/>
      <GlobalStyles />
      <div id="portal"/>
    </RecoilRoot>);
};
export default MyApp;
