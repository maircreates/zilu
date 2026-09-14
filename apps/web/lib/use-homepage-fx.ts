'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { useThemeFamily, type ThemeFamily } from './use-theme';

/**
 * Settings for the homepage's floating-characters background, reachable from
 * Settings > Display > Aesthetics > Homepage. Each color family remembers
 * its own configuration under its own storage key, so switching families in
 * Settings > Display > Theme recalls that family's own saved setup instead
 * of carrying over whatever was last set for a different one.
 */
const STORAGE_PREFIX = 'zilu:homepage-fx:';

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

/** Deliberately different per family, not just one shared starting point:
 * Cyberpunk favors a dense, slow, moody rain with the full flashcard on
 * click; Taopunk a lighter, quicker lantern drift with a playful
 * pop-and-respawn click; Silkpunk stays closest to the original calm
 * default. */
const FAMILY_DEFAULTS: Record<ThemeFamily, HomepageFxSettings> = {
  cyberpunk: {
    enabled: true,
    density: 'swarm',
    speed: 'normal',
    hover: 'stroke',
    click: 'flashcard',
    drag: 'physics',
    cursorForce: true,
    pathwayColors: false,
    throwEnabled: true,
  },
  taopunk: {
    enabled: true,
    density: 'normal',
    speed: 'fast',
    hover: 'stroke',
    click: 'pop',
    drag: 'physics',
    cursorForce: true,
    pathwayColors: false,
    throwEnabled: true,
  },
  silkpunk: {
    enabled: true,
    density: 'normal',
    speed: 'fast',
    hover: 'glow',
    click: 'flashcard',
    drag: 'physics',
    cursorForce: true,
    pathwayColors: false,
    throwEnabled: true,
  },
};

type Listener = () => void;
let listeners: Listener[] = [];
const cachedRaw = new Map<ThemeFamily, string | null>();
const cachedValue = new Map<ThemeFamily, HomepageFxSettings>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners = [...listeners, listener];
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(STORAGE_PREFIX)) listener();
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

function parse(raw: string | null, family: ThemeFamily): HomepageFxSettings {
  const fallback = FAMILY_DEFAULTS[family];
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<HomepageFxSettings>;
    const density = parsed.density ? LEGACY_DENSITY[parsed.density] : undefined;
    return { ...fallback, ...parsed, density: density ?? fallback.density };
  } catch {
    return fallback;
  }
}

function getSnapshot(family: ThemeFamily): HomepageFxSettings {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_PREFIX + family);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw.get(family)) {
    cachedRaw.set(family, raw);
    cachedValue.set(family, parse(raw, family));
  }
  return cachedValue.get(family) ?? FAMILY_DEFAULTS[family];
}

export function useHomepageFx(): [
  HomepageFxSettings,
  (patch: Partial<HomepageFxSettings>) => void,
] {
  const [family] = useThemeFamily();

  const settings = useSyncExternalStore(
    subscribe,
    useCallback(() => getSnapshot(family), [family]),
    useCallback(() => FAMILY_DEFAULTS[family], [family]),
  );

  const update = useCallback(
    (patch: Partial<HomepageFxSettings>) => {
      const next = { ...getSnapshot(family), ...patch };
      const raw = JSON.stringify(next);
      try {
        window.localStorage.setItem(STORAGE_PREFIX + family, raw);
      } catch {
        // Ignore write failures; the in-memory value still applies this visit.
      }
      cachedRaw.set(family, raw);
      cachedValue.set(family, next);
      notify();
    },
    [family],
  );

  return [settings, update];
}
