'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Light / dark appearance, stored so the choice survives navigation and
 * reload. The theme is applied to <html data-theme> -- a small inline script
 * in the root layout sets it before paint so there is no flash.
 */
const STORAGE_KEY = 'zilu:theme';

type Listener = () => void;
let listeners: Listener[] = [];

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners = [...listeners, listener];
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function useTheme(): [boolean, (dark: boolean) => void] {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setDark = useCallback((dark: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // Ignore storage failures; the DOM update below still applies.
    }
    try {
      document.documentElement.setAttribute(
        'data-theme',
        dark ? 'dark' : 'light',
      );
    } catch {
      // Not in a browser -- nothing to update.
    }
    notify();
  }, []);

  return [isDark, setDark];
}
