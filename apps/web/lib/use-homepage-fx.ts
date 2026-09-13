'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Settings for the homepage's floating-characters background, reachable from
 * Settings > Display > Aesthetics > Homepage. Stored as one JSON blob so the
 * choice survives navigation and reload, same as the mirror/theme toggles.
 */
const STORAGE_KEY = 'zilu:homepage-fx';

export type HoverMode = 'glow' | 'stroke';
export type ClickMode = 'pop' | 'flashcard';
export type DragMode = 'physics' | 'combine';
export type Density = 'normal' | 'many' | 'swarm';
export type Speed = 'slow' | 'normal' | 'fast';

export type HomepageFxSettings = {
  enabled: boolean;
  density: Density;
  speed: Speed;
  hover: HoverMode;
  click: ClickMode;
  drag: DragMode;
  /** Characters curve away as the cursor nears, before you're even hovering. */
  cursorForce: boolean;
  /** A small tinted dot per character showing which pathway teaches it. */
  pathwayColors: boolean;
  /** A fast-enough drag release flings the character; otherwise it always
   * settles gently into normal drift no matter how quickly you let go. */
  throwEnabled: boolean;
};

export const DEFAULT_HOMEPAGE_FX: HomepageFxSettings = {
  enabled: true,
  density: 'normal',
  speed: 'normal',
  hover: 'glow',
  click: 'flashcard',
  drag: 'physics',
  cursorForce: true,
  pathwayColors: true,
  throwEnabled: true,
};

type Listener = () => void;
let listeners: Listener[] = [];
let cachedRaw: string | null = null;
let cachedValue: HomepageFxSettings = DEFAULT_HOMEPAGE_FX;

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

/** Density used to have five tiers (few/some/many/crowded/swarm); carries an
 * older visitor's stored choice over to the nearest of the current three by
 * relative position, rather than leaving it as an unrecognized value. */
const LEGACY_DENSITY: Record<string, Density> = {
  few: 'normal',
  some: 'normal',
  many: 'many',
  crowded: 'swarm',
  swarm: 'swarm',
};

function parse(raw: string | null): HomepageFxSettings {
  if (!raw) return DEFAULT_HOMEPAGE_FX;
  try {
    const parsed = JSON.parse(raw) as Partial<HomepageFxSettings>;
    const density = parsed.density ? LEGACY_DENSITY[parsed.density] : undefined;
    return { ...DEFAULT_HOMEPAGE_FX, ...parsed, density: density ?? DEFAULT_HOMEPAGE_FX.density };
  } catch {
    return DEFAULT_HOMEPAGE_FX;
  }
}

function getSnapshot(): HomepageFxSettings {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

function getServerSnapshot(): HomepageFxSettings {
  return DEFAULT_HOMEPAGE_FX;
}

export function useHomepageFx(): [
  HomepageFxSettings,
  (patch: Partial<HomepageFxSettings>) => void,
] {
  const settings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const update = useCallback((patch: Partial<HomepageFxSettings>) => {
    const next = { ...getSnapshot(), ...patch };
    const raw = JSON.stringify(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, raw);
    } catch {
      // Ignore write failures; the in-memory value still applies this visit.
    }
    cachedRaw = raw;
    cachedValue = next;
    notify();
  }, []);

  return [settings, update];
}
