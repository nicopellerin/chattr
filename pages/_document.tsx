import Document, { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheet } from "styled-components"

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <meta
            name="description"
            content="Chat 1-on-1 with a friend in a fun and secure way"
          />
          <meta name="theme-color" content="#8352FD" />
          <meta
            name="og:title"
            content="Chattr | Free P2P audio/video + chat platform"
          />
          <meta name="og:url" content="https://chattr.lol" />
          <meta
            name="og:description"
            content="Chat 1-on-1 with a friend in a fun and secure way"
          />
          <meta name="og:image" content="/og-image.png" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <meta name="msapplication-TileColor" content="#8352FD" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
