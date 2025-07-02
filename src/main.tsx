
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Performance monitoring
const startTime = performance.now();

// Register service worker for PWA functionality with better error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered successfully:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('New service worker version available');
        });
      })
      .catch((registrationError) => {
        console.warn('SW registration failed:', registrationError);
      });
  });
}

// Performance optimization: Use requestIdleCallback for non-critical tasks
const initializeApp = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  
  // Log performance metrics
  const endTime = performance.now();
  console.log(`App initialization took ${(endTime - startTime).toFixed(2)}ms`);
  
  // Track page visibility for better UX
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('App moved to background');
    } else {
      console.log('App returned to foreground');
    }
  });
};

// Use requestIdleCallback if available, fallback to setTimeout
if ('requestIdleCallback' in window) {
  requestIdleCallback(initializeApp);
} else {
  setTimeout(initializeApp, 0);
}

// Add smooth scrolling behavior globally with hardware acceleration
document.documentElement.style.scrollBehavior = 'smooth';

// Performance optimizations for faster scrolling and movements
const optimizePerformance = () => {
  // Enable hardware acceleration for better performance
  document.body.style.transform = 'translateZ(0)';
  document.body.style.backfaceVisibility = 'hidden';
  
  // Optimize scroll performance
  document.body.style.overflowScrolling = 'touch';
  
  // Reduce layout thrashing
  document.body.style.willChange = 'transform';
  
  // Optimize font rendering
  document.body.style.textRendering = 'optimizeSpeed';
  document.body.style.fontDisplay = 'swap';
  
  // Add CSS for better performance
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
    }
    
    body, html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeSpeed;
    }
    
    /* Optimize animations and transitions */
    * {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    
    /* Smooth scrolling optimization */
    * {
      scroll-behavior: smooth;
    }
    
    /* Optimize image loading */
    img {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
    }
    
    /* Optimize button and interactive elements */
    button, a, [role="button"] {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    
    /* Optimize form elements */
    input, textarea, select {
      -webkit-appearance: none;
      appearance: none;
    }
    
    /* Fast click response */
    .fast-click {
      touch-action: manipulation;
    }
  `;
  document.head.appendChild(style);
};

// Apply performance optimizations
optimizePerformance();

// Optimize touch events for mobile with better performance
const options = { passive: true, capture: false };
document.addEventListener('touchstart', () => {}, options);
document.addEventListener('touchmove', () => {}, options);
document.addEventListener('touchend', () => {}, options);

// Preload critical resources
const preloadCriticalResources = () => {
  // Preload fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.as = 'font';
  fontPreload.type = 'font/woff2';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);
  
  // Prefetch DNS for better performance
  const dnsPreconnect = document.createElement('link');
  dnsPreconnect.rel = 'preconnect';
  dnsPreconnect.href = 'https://fonts.googleapis.com';
  document.head.appendChild(dnsPreconnect);
};

// Apply preloading
if ('requestIdleCallback' in window) {
  requestIdleCallback(preloadCriticalResources);
} else {
  setTimeout(preloadCriticalResources, 100);
}
