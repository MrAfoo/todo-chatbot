'use client';

import { useEffect } from 'react';
import { startKeepAlive, stopKeepAlive, setupVisibilityHandler } from '@/lib/keep-alive';

/**
 * Provider component that starts the keep-alive service
 * This prevents the Render backend from spinning down due to inactivity
 */
export function KeepAliveProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Start keep-alive service when component mounts
    startKeepAlive();
    
    // Set up visibility handler
    setupVisibilityHandler();
    
    // Clean up on unmount
    return () => {
      stopKeepAlive();
    };
  }, []);

  return <>{children}</>;
}
