'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Two independent choices, stored so they survive navigation and reload:
 * which "punk" color family (Cyberpunk / Silkpunk / Taopunk, picked in
 * Settings > Display > Theme) and day/night mode (the sun/moon toggle in
 * every page's footer). Combined into <html data-theme="family-mode"> -- a
 * small inline script in the root layout sets it before paint so there is
 * no flash of the wrong palette.
 */
const FAMILY_KEY = 'zilu:theme-family';
const MODE_KEY = 'zilu:theme-mode';
/** Pre-family boolean toggle this replaced ('dark' | 'light'), still read as
 * a one-time fallback for a visitor's existing choice. */
const LEGACY_KEY = 'zilu:theme';

export type ThemeFamily = 'cyberpunk' | 'silkpunk' | 'taopunk';
export type ThemeMode = 'day' | 'night';

const DEFAULT_FAMILY: ThemeFamily = 'silkpunk';
const DEFAULT_MODE: ThemeMode = 'day';

function resolveFamily(raw: string | null): ThemeFamily {
  if (raw === 'cyberpunk' || raw === 'silkpunk' || raw === 'taopunk') return raw;
  return DEFAULT_FAMILY;
}

function resolveMode(raw: string | null): ThemeMode {
  if (raw === 'day' || raw === 'night') return raw;
  return DEFAULT_MODE;
}

function readFamily(): ThemeFamily {
  try {
    return resolveFamily(window.localStorage.getItem(FAMILY_KEY));
  } catch {
    return DEFAULT_FAMILY;
  }
}

function readMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(MODE_KEY);
    if (stored) return resolveMode(stored);
    return window.localStorage.getItem(LEGACY_KEY) === 'dark' ? 'night' : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

function getServerFamilySnapshot(): ThemeFamily {
  return DEFAULT_FAMILY;
}

function getServerModeSnapshot(): ThemeMode {
  return DEFAULT_MODE;
}

function applyDom(family: ThemeFamily, mode: ThemeMode) {
  try {
    document.documentElement.setAttribute('data-theme', `${family}-${mode}`);
  } catch {
    // Not in a browser -- nothing to update.
  }
}

type Listener = () => void;
let listeners: Listener[] = [];

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners = [...listeners, listener];
  const onStorage = (event: StorageEvent) => {
    if (event.key === FAMILY_KEY || event.key === MODE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useThemeFamily(): [ThemeFamily, (family: ThemeFamily) => void] {
  const family = useSyncExternalStore(
    subscribe,
    readFamily,
    getServerFamilySnapshot,
  );

  const setFamily = useCallback((next: ThemeFamily) => {
    try {
      window.localStorage.setItem(FAMILY_KEY, next);
    } catch {
      // Ignore storage failures; the DOM update below still applies.
    }
    applyDom(next, readMode());
    notify();
  }, []);

  return [family, setFamily];
}

export function useThemeMode(): [ThemeMode, (mode: ThemeMode) => void] {
  const mode = useSyncExternalStore(subscribe, readMode, getServerModeSnapshot);

  const setMode = useCallback((next: ThemeMode) => {
    try {
      window.localStorage.setItem(MODE_KEY, next);
    } catch {
      // Ignore storage failures; the DOM update below still applies.
    }
    applyDom(readFamily(), next);
    notify();
  }, []);

  return [mode, setMode];
}
