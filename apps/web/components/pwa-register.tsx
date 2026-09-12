'use client';

import { useEffect } from 'react';

/** Registers the offline service worker. Renders nothing. */
export function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is a bonus, not a requirement -- fail silently.
    });
  }, []);

  return null;
}
