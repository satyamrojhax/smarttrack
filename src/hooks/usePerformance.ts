
import { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const usePerformance = () => {
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  const measurePerformance = useCallback((name: string, fn: (...args: any[]) => Promise<any> | any) => {
    return async (...args: any[]) => {
      const startTime = performance.now();
      try {
        const result = await fn(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 1000) {
          console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
        }
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.error(`Operation failed: ${name} after ${duration.toFixed(2)}ms`, error);
        throw error;
      }
    };
  }, []);

  const preloadImages = useCallback((imageSources: string[]) => {
    imageSources.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // Enable performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
            if (loadTime > 3000) {
              console.warn(`Slow page load: ${loadTime}ms`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation', 'paint'] });
      
      return () => observer.disconnect();
    }
  }, []);

  return {
    debounce,
    throttle,
    measurePerformance,
    preloadImages
  };
};
