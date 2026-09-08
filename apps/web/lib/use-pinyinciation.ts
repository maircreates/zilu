'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Shared store for the learner's Pinyinciation preference (pinyin on the front
 * of a card versus the back). Kept in one place so the flashcard browser and the
 * guided study session always agree, and the choice survives a page reload.
 */
const STORAGE_KEY = 'zilu:pinyinciation';

// Default matches the original browser behaviour: pinyin shown on the front.
const DEFAULT_ON_FRONT = true;

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
    if (value === 'front') return true;
    if (value === 'back') return false;
  } catch {
    // Storage can be unavailable (private mode, disabled cookies); fall through.
  }
  return DEFAULT_ON_FRONT;
}

function getServerSnapshot(): boolean {
  return DEFAULT_ON_FRONT;
}

export function usePinyinciationPreference(): [
  boolean,
  (next: boolean) => void,
] {
  const showPinyinFront = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const update = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'front' : 'back');
    } catch {
      // Ignore write failures; nothing else we can do here.
    }
    notify();
  }, []);

  return [showPinyinFront, update];
}
