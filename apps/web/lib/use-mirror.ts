'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Mirror mode swaps the flashcard prompt: the English meaning shows first and
 * the learner recalls the Traditional Chinese. Stored so the choice survives
 * navigation and reload. Defaults to off -- recognition before recall.
 */
const STORAGE_KEY = 'zilu:mirror';
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

export function useMirrorPreference(): [boolean, (next: boolean) => void] {
  const mirrored = useSyncExternalStore(
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

  return [mirrored, update];
}
