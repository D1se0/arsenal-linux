import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/jetbrains-mono';
import './styles/base.css';
import './styles/explorer.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
