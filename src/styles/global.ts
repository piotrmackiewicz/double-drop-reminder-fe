import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
   *{
       margin: 0;
       padding: 0;
       outline: 0;
       box-sizing: border-box;
       font-family: 'Open Sans', sans-serif; 
   }
   
   #root{
       margin: 0 auto;
       height: 100vh;
       position: relative;
   }

   html, body {
    height: 100vh;
   }

   a {
    color: inherit;
    text-decoration: none;
   }
`;
