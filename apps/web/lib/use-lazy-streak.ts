'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * 字力房 -> 懶人模式 (Lazy Mode)'s streak counter. Deliberately dumb: one
 * localStorage record of {count, lastDate}, incremented at most once per
 * calendar day. No backend, no cross-device sync -- matches every other
 * per-viewer preference in the app (theme, homepage-fx, pinyin toggle).
 */
const KEY = 'zilu:lazy-mode-streak';

type StreakState = { count: number; lastDate: string | null };

const DEFAULT_STATE: StreakState = { count: 0, lastDate: null };

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// useSyncExternalStore compares snapshots with Object.is, so read() must
// return the SAME object reference across calls when the underlying value
// hasn't changed -- otherwise every render looks like a new snapshot and
// React loops forever ("Maximum update depth exceeded"). Cache by the raw
// stored string rather than re-parsing into a fresh object each time.
let cachedRaw: string | null | undefined;
let cachedState: StreakState = DEFAULT_STATE;

function read(): StreakState {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedState;

  cachedRaw = raw;
  if (!raw) {
    cachedState = DEFAULT_STATE;
    return cachedState;
  }
  try {
    const parsed = JSON.parse(raw);
    cachedState =
      typeof parsed.count === 'number' && (typeof parsed.lastDate === 'string' || parsed.lastDate === null)
        ? parsed
        : DEFAULT_STATE;
  } catch {
    cachedState = DEFAULT_STATE;
  }
  return cachedState;
}

function getServerSnapshot(): StreakState {
  return DEFAULT_STATE;
}

type Listener = () => void;
let listeners: Listener[] = [];

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((item) => item !== listener);
  };
}

export function useLazyStreak(): {
  count: number;
  completedToday: boolean;
  completeToday: () => void;
} {
  const state = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const completeToday = useCallback(() => {
    const current = read();
    const today = todayString();
    if (current.lastDate === today) return;
    const continuesStreak = current.lastDate === yesterdayString();
    const next: StreakState = {
      count: continuesStreak ? current.count + 1 : 1,
      lastDate: today,
    };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures -- the streak just won't persist.
    }
    notify();
  }, []);

  return {
    count: state.count,
    completedToday: state.lastDate === todayString(),
    completeToday,
  };
}
