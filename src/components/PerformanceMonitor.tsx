
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const PerformanceMonitor = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Monitor page load performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
          
          // Log slow loads (over 3 seconds)
          if (loadTime > 3000) {
            console.warn(`Slow page load detected: ${loadTime}ms`);
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          const lcp = entry.startTime;
          if (lcp > 2500) {
            console.warn(`Poor LCP detected: ${lcp}ms`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const usedMemory = memoryInfo.usedJSHeapSize / 1048576; // Convert to MB
      
      if (usedMemory > 100) { // Over 100MB
        console.warn(`High memory usage detected: ${usedMemory.toFixed(2)}MB`);
      }
    }

    // Monitor app crashes
    window.addEventListener('error', (event) => {
      console.error('App error:', event.error);
      toast({
        title: "Something went wrong",
        description: "The app encountered an error. Please try refreshing.",
        variant: "destructive",
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    return () => {
      observer.disconnect();
    };
  }, [toast]);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
