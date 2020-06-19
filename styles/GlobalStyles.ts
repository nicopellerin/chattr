import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`

:root {
  --primaryColor: #8352FD;
  --primaryColorDark: #3913B8;
  --primaryColorLight: #d75cff;

  --secondaryColor: #f020d8;

  --tertiaryColor: #00e5ff;

  --textColor: #E3E8FF;

  --systemFont: "Inter", sans-serif;
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
  font-family: var(--systemFont);
  color: #555;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* overflow: hidden; */
}


h1, h2, h3, h4, h5 {
  margin-top: 0;
  color: #333;
}

h1, h2 {
  /* font-family: 'Playfair+Display', serif; */
  /* font-weight: 900; */
}

input {
  font-family: inherit;
}

p {
  /* font-family: "Playfair+Display", serif; */
  font-size: 1.8rem;
}
`

export default GlobalStyles
