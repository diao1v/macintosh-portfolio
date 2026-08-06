import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PostHogProvider } from 'posthog-js/react';
import './index.css';
import App from './App.tsx';

const options = {
  // Reverse proxy on our own domain; ui_host must stay the real PostHog app
  // so the toolbar and session replay links resolve.
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  ui_host: 'https://eu.posthog.com',
  capture_pageview: true,
  capture_pageleave: true,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
);
