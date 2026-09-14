'use client';

import { useEffect, useState } from 'react';

import { useThemeFamily } from '@/lib/use-theme';

const BOOT_LINES = [
  '> INITIALIZING ZILU NEURAL-LINK...',
  '> LOADING TRADITIONAL CHARACTER SET... OK',
  '> ESTABLISHING PATHWAY CONNECTION... OK',
  '> WELCOME, USER.',
];

const LINE_INTERVAL_MS = 220;
const HOLD_MS = 500;
const SESSION_KEY = 'zilu:cyberpunk-boot-played';

/** A one-time arrival flourish, not ambient decoration -- mounted once in
 * the root layout (same spot as <SearchPalette>/<PwaRegister>), so it plays
 * at most once per browser session regardless of how many pages get
 * visited, and only for Cyberpunk. sessionStorage is the actual guard
 * (layouts persisting across client-side navigation would already prevent
 * replays within one session, but this also survives a hard refresh mid-
 * session without showing twice). */
export function CyberpunkBoot() {
  const [family] = useThemeFamily();
  const [visible, setVisible] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (family !== 'cyberpunk') return;
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // Storage unavailable (private mode, etc.) -- fall through and just
      // play it; not worth blocking the flourish over.
    }
    if (alreadyPlayed) return;

    // rAF-wrapped, matching floating-characters-bg's precedent: the
    // react-compiler linter flags setState called directly as a top-level
    // effect-body statement, so the initial state flip is nested inside a
    // callback instead (same as the per-line timers below already are).
    const startId = requestAnimationFrame(() => {
      setVisible(true);
      setLineCount(0);
    });
    const lineTimers = BOOT_LINES.map((_, i) =>
      setTimeout(() => setLineCount(i + 1), LINE_INTERVAL_MS * (i + 1)),
    );
    const totalMs = LINE_INTERVAL_MS * BOOT_LINES.length + HOLD_MS;
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Nothing to do if storage isn't available.
      }
    }, totalMs);

    return () => {
      cancelAnimationFrame(startId);
      lineTimers.forEach(clearTimeout);
      clearTimeout(hideTimer);
    };
  }, [family]);

  if (!visible) return null;

  return (
    <div className="cyberpunk-boot" aria-hidden="true">
      <pre>{BOOT_LINES.slice(0, lineCount).join('\n')}</pre>
    </div>
  );
}
