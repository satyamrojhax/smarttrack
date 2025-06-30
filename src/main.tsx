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
    if (entry.entryType === 'navigation') {
      console.log('Navigation timing:', entry);
    }
  }
});

performanceObserver.observe({ 
  entryTypes: ['largest-contentful-paint', 'first-input', 'navigation', 'paint'] 
});

// Register service worker for PWA functionality with improved error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });
      
      console.log('SW registered successfully:', registration);
      
      // Faster update checks
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
              // Auto-reload for faster updates
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
    } catch (error) {
      console.warn('SW registration failed:', error);
    }
  });
  
  // Handle service worker messages for faster communication
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Message from SW:', event.data);
    if (event.data.type === 'CACHE_UPDATED') {
      // Handle cache updates for faster loading
      console.log('Cache updated for faster performance');
    }
  });
}

// Optimize root rendering with concurrent features
const container = document.getElementById("root");
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

// Enable concurrent features and optimizations
root.render(<App />);

// Enhanced performance optimizations
if (typeof window !== 'undefined') {
  // Aggressive resource preloading
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'font';
  preloadLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  preloadLink.crossOrigin = 'anonymous';
  document.head.appendChild(preloadLink);
  
  // Enable hardware acceleration globally
  document.documentElement.style.transform = 'translateZ(0)';
  document.documentElement.style.willChange = 'transform';
  
  // Optimize scrolling performance with passive listeners
  let ticking = false;
  function updateScrolling() {
    // Optimized scroll handling
    ticking = false;
  }
  
  document.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrolling);
      ticking = true;
    }
  }, { passive: true });
  
  // Enhanced smooth scrolling
  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  
  // Improved viewport meta for better mobile performance
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover, shrink-to-fit=no');
  }
  
  // Preload critical routes for faster navigation
  const criticalRoutes = ['/', '/questions', '/doubts', '/profile'];
  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
}

// Enhanced online/offline handling
window.addEventListener('online', () => {
  console.log('App is online - enabling full functionality');
  document.body.classList.remove('offline');
  // Sync any pending data
}, { passive: true });

window.addEventListener('offline', () => {
  console.log('App is offline - enabling offline mode');
  document.body.classList.add('offline');
  // Enable offline mode
}, { passive: true });

// Performance monitoring for debugging
if (process.env.NODE_ENV === 'development') {
  // Monitor long tasks
  const longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.warn('Long task detected:', entry.duration, 'ms');
    }
  });
  
  try {
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task API not supported
  }
}
