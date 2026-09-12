'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Type It asks the learner to type the pinyin before the card flips, instead
 * of just tapping to reveal it. Stored so the choice survives navigation and
 * reload. Defaults to off.
 */
const STORAGE_KEY = 'zilu:typeit';
const DEFAULT_ON = false;

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

export function useTypeModePreference(): [boolean, (next: boolean) => void] {
  const typeMode = useSyncExternalStore(
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

  return [typeMode, update];
}
