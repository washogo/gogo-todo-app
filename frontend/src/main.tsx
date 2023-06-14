import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ResetStyle } from './ResetStyle.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ResetStyle />
    <App />
  </React.StrictMode>
);
