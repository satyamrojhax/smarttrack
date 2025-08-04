
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

// Initialize app immediately
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

// Add smooth scrolling behavior globally
document.documentElement.style.scrollBehavior = 'smooth';

// Optimize touch events for mobile
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove', () => {}, { passive: true });
