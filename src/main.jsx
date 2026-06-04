import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import './index.css';

// Register the service worker for PWA install + offline shell.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2600,
        style: {
          background: '#1e1e32',
          color: '#f1f5f9',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        },
        success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
      }}
    />
    </LanguageProvider>
  </React.StrictMode>
);
