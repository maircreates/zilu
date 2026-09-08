'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether English translations are shown next to Chinese examples. Stored so
 * the choice survives navigation and reload. Defaults to on -- beginners need
 * the translation until they can do without it.
 */
const STORAGE_KEY = 'zilu:english';
const DEFAULT_ON = true;

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
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === 'on') return true;
    if (value === 'off') return false;
  } catch {
    // Storage unavailable; fall through to the default.
  }
  return DEFAULT_ON;
}

function getServerSnapshot(): boolean {
  return DEFAULT_ON;
}

export function useEnglishPreference(): [boolean, (next: boolean) => void] {
  const showEnglish = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const update = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {
      // Ignore write failures; the in-memory value still applies.
    }
    notify();
  }, []);

  return [showEnglish, update];
}
