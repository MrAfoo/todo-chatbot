/**
 * Keep-alive service to prevent Render backend from spinning down
 * Pings the backend health endpoint periodically
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (Render spins down after 15 min)
const HEALTH_ENDPOINT = `${BACKEND_URL}/health`;

let keepAliveInterval: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Ping the backend health endpoint
 */
async function pingBackend(): Promise<void> {
  try {
    const response = await fetch(HEALTH_ENDPOINT, {
      method: 'HEAD', // Use HEAD to minimize bandwidth
      cache: 'no-store',
    });
    
    if (response.ok) {
      console.log('[KeepAlive] Backend pinged successfully');
    } else {
      console.warn('[KeepAlive] Backend ping failed:', response.status);
    }
  } catch (error) {
    console.error('[KeepAlive] Error pinging backend:', error);
  }
}

/**
 * Start the keep-alive service
 */
export function startKeepAlive(): void {
  if (isRunning) {
    console.log('[KeepAlive] Already running');
    return;
  }

  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  console.log('[KeepAlive] Starting keep-alive service');
  
  // Ping immediately on start
  pingBackend();
  
  // Set up interval for periodic pings
  keepAliveInterval = setInterval(() => {
    pingBackend();
  }, PING_INTERVAL);
  
  isRunning = true;
}

/**
 * Stop the keep-alive service
 */
export function stopKeepAlive(): void {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
  isRunning = false;
  console.log('[KeepAlive] Keep-alive service stopped');
}

/**
 * Check if keep-alive is running
 */
export function isKeepAliveRunning(): boolean {
  return isRunning;
}

/**
 * Handle visibility changes to pause/resume when tab is hidden
 * This saves bandwidth when user is not actively using the app
 */
export function setupVisibilityHandler(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('[KeepAlive] Tab hidden, but keeping service running');
      // Keep running even when hidden - this ensures backend stays alive
      // even if user switches tabs
    } else {
      console.log('[KeepAlive] Tab visible again');
      // Ping immediately when tab becomes visible
      if (isRunning) {
        pingBackend();
      }
    }
  });
}
