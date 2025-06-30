
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
    if (entry.entryType === 'first-input') {
      // Type guard to ensure we have a PerformanceEventTiming entry
      const eventTiming = entry as PerformanceEventTiming;
      if (eventTiming.processingStart !== undefined) {
        console.log('FID:', eventTiming.processingStart - eventTiming.startTime);
      }
    }
  }
});

performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

// Register service worker for PWA functionality with improved error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('SW registered successfully:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
              // Could show update notification to user here
            }
          });
        }
      });
      
    } catch (error) {
      console.warn('SW registration failed:', error);
    }
  });
  
  // Handle service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Message from SW:', event.data);
  });
}

// Optimize root rendering with error boundary
const container = document.getElementById("root");
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

// Enable concurrent features for better performance
root.render(<App />);

// Performance optimizations
if (typeof window !== 'undefined') {
  // Preload critical resources
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'font';
  preloadLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  preloadLink.crossOrigin = 'anonymous';
  document.head.appendChild(preloadLink);
  
  // Enable GPU acceleration
  document.documentElement.style.transform = 'translateZ(0)';
  
  // Optimize scrolling performance
  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  
  // Add viewport meta for better mobile performance
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
  }
}

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('App is online');
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  document.body.classList.add('offline');
});
