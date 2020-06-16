import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`

:root {
  --primaryColor: #9D00E0;

  --systemFont: font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
}


*, *:before, *:after {
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
  box-sizing: border-box;
  height: 100%;

  @media (max-width: 1500px) {
    font-size: 57.5%;
  }
}

#__next {
  height: 100%;
  width: 100%;

}

body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  /* font-family: 'Open Sans', sans-serif; */
  color: #555;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


h1, h2, h3, h4, h5 {
  margin-top: 0;
  color: #333;
}

h1, h2 {
  /* font-family: 'Playfair+Display', serif; */
  /* font-weight: 500; */
}

input {
  font-family: inherit;
}

p {
  font-family: "Playfair+Display", serif;
  font-size: 1.8rem;
}
`

export default GlobalStyles
