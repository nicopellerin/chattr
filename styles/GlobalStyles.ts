import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`

:root {
  --primaryColor: #8352FD;
  --primaryColorDark: #4823c9;
  --primaryColorLight: #b981ff;

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
  min-height: 100%;

  @media (max-width: 1500px) {
    font-size: 57.5%;
  }
}

#__next {
  height: 100%;
  min-height: 100%;
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100%;
  font-family: var(--systemFont);
  color: #555;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-transform: translateZ(0);
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


aside.emoji-picker-react {
    background: #112 !important;
    box-shadow: none !important;
    border: none !important;
  }

.emoji-categories {
  display: none!important;
}

.emoji-picker-react .emoji-group:before {
  background: #112 !important;
}

.emoji-picker-react .emoji-group:before {
  content: "";
} 

.ps__rail-y {
  display: none!important;
}

.custom-box {
  overflow: visible;
}
.custom-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #1153aa;
  opacity: 0.75;
  border-radius: 4px;
}
.custom-handle-sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}
.custom-handle-se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}
.custom-handle-nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}
.custom-handle-ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}
.custom-handle-w,
.custom-handle-e {
  top: 50%;
  margin-top: -4px;
  cursor: ew-resize;
}
.custom-handle-w {
  left: -4px;
}
.custom-handle-e {
  right: -4px;
}
.custom-handle-n,
.custom-handle-s {
  left: 50%;
  margin-left: -4px;
  cursor: ns-resize;
}
.custom-handle-n {
  top: -4px;
}
.custom-handle-s {
  bottom: -4px;
}

`

export default GlobalStyles
