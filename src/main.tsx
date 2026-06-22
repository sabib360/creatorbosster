import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import { initPerformanceMonitoring } from './lib/perf-monitor';
import './index.css';

// Initialize performance monitoring before render
initPerformanceMonitoring();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
