import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,700&display=swap');

*,*::before,*::after {
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background-image: linear-gradient(163.11deg, #DCB172 0%, #A6384B 100%);
  background-repeat: no-repeat;
  background-size: contain;

  #root {
    width: calc(100vw - 14rem);
    min-height: calc(100vh - 14rem);
    margin: 7rem;
    
    animation: scale-up-bottom 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        
    display: grid;
    grid-template-areas:
      "header"
      "router";
    grid-template-rows: 7.7rem auto;
    grid-row-gap: .2rem;

    & > * {
      background-color: ${({ theme }) => theme.color.background}
    }

    a {
      color: ${({theme}) => theme.color.primary};
      text-decoration: none;
    }

  }
}

@keyframes scale-up-bottom {
  0% {
    transform: scale(0.25);
    transform-origin: 50% 50%;
  }
  100% {
    transform: scale(1);
    transform-origin: 50% 50%;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.toast {
  font-size: 1.8rem;
  font-family: 'Montserrat', sans-serif!important;
}

`;

export default GlobalStyle;