import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        try {
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props}/>),
            });
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (<>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>),
            };
        }
        finally {
            sheet.seal();
        }
    }
    render() {
        return (<Html lang="fr">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
          <meta name="description" content="Créer ton propre journal de bord en ligne. Facile d'utilisation et
            100% gratuit."/>
          <meta name="theme-color" content="#9D00E0"/>
          <meta name="og:title" content="monjournaldebord"/>
          <meta name="og:url" content="https://monjournaldebord.ca"/>
          <meta name="og:description" content="Créer ton propre journal de bord en ligne. Facile d'utilisation et
            100% gratuit."/>
          <meta name="og:image" content="/og-image-5.png"/>
          <link href="/manifest.json" rel="manifest"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
          <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5"/>
          <link rel="shortcut icon" href="/icons/favicon.ico"/>
          <meta name="msapplication-TileColor" content="#da532c"/>
          <meta name="msapplication-config" content="/icons/browserconfig.xml"/>
          <meta name="theme-color" content="#ffffff"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>);
    }
}
