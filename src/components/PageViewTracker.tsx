import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { incrementPageViews } from '@/lib/analytics';

export function PageViewTracker() {
  const location = useLocation();

  const trackPageView = useCallback(async () => {
    try {
      await incrementPageViews();
    } catch (error) {
      // Log error but don't disrupt the user experience
      console.error('Failed to track page view:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  useEffect(() => {
    // Use requestIdleCallback to track page views when the browser is idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => trackPageView());
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(trackPageView, 0);
    }
  }, [location.pathname, trackPageView]);

  return null;
}