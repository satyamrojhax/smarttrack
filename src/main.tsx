
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

// Performance optimization functions
const optimizePerformance = () => {
  // Enable hardware acceleration
  document.documentElement.style.transform = 'translateZ(0)';
  
  // Optimize scrolling
  if (CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  
  // Enable momentum scrolling on iOS
  (document.body.style as any).webkitOverflowScrolling = 'touch';
  
  // Optimize font rendering
  document.body.style.textRendering = 'optimizeSpeed';
  (document.body.style as any).webkitFontSmoothing = 'antialiased';
  (document.body.style as any).mozOsxFontSmoothing = 'grayscale';
};

// Performance optimization: Use requestIdleCallback for non-critical tasks
const initializeApp = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  
  // Log performance metrics
  const endTime = performance.now();
  console.log(`App initialization took ${(endTime - startTime).toFixed(2)}ms`);
  
  // Apply performance optimizations
  optimizePerformance();
  
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

// Optimize touch events for mobile
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove', () => {}, { passive: true });
