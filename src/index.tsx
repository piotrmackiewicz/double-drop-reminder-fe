import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { GlobalStyle } from 'styles/global';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModeProvider } from 'context/modeContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <ModeProvider>
      <RouterProvider router={router} />
    </ModeProvider>
    <ToastContainer />
  </React.StrictMode>
);
