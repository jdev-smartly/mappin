// Custom hooks for the application
import { useState, useEffect } from 'react';

/**
 * Hook for managing viewport type
 */
export function useViewport() {
  const [viewport, setViewport] = useState<'desktop' | 'mobile-landscape' | 'mobile-portrait'>('desktop');

  useEffect(() => {
    const updateViewport = () => {
      const { innerWidth, innerHeight } = window;
      
      if (innerWidth >= 1024) {
        setViewport('desktop');
      } else if (innerWidth > innerHeight) {
        setViewport('mobile-landscape');
      } else {
        setViewport('mobile-portrait');
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}
