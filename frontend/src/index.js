import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DarkModeProvider } from './context/DarkMode';
import { Toaster } from './components/ui/toaster';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <Toaster/>
    <App />
    </DarkModeProvider>
  </React.StrictMode>
);


