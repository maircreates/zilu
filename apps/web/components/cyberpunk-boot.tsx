'use client';

import { useEffect, useRef, useState } from 'react';

import { useThemeFamily } from '@/lib/use-theme';

const BOOT_LINES = [
  '> INITIALIZING ZILU NEURAL-LINK...',
  '> LOADING TRADITIONAL CHARACTER SET... OK',
  '> ESTABLISHING PATHWAY CONNECTION... OK',
  '> WELCOME, USER.',
];

/** Total time budget is randomized (1500-2000ms) each play-through; lines
 * reveal across the first 80% of it, the last 20% is the fade-to-clear
 * handled by .cyberpunk-boot.is-fading in CSS. */
const MIN_MS = 1500;
const MAX_MS = 2000;
const LINE_SHARE = 0.8;
const SESSION_KEY = 'zilu:cyberpunk-boot-played';

/** Cyberpunk's only arrival flourish -- Taopunk and Silkpunk don't have
 * one. Plays once per browser session (sessionStorage, so it survives a
 * reload but resets in a fresh tab): either on the initial load if
 * Cyberpunk is already the active theme, or the first time someone
 * switches to Cyberpunk from Settings, whichever happens first. Reloading
 * the page afterward -- or switching away and back to Cyberpunk again --
 * does not replay it. */
export function CyberpunkBoot() {
  const [family] = useThemeFamily();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
    // react-compiler linter flags an impure call (Math.random here, plus
    // the setState calls) made directly as a top-level effect-body
    // statement, so everything is nested inside a callback instead.
    const startId = requestAnimationFrame(() => {
      setVisible(true);
      setFading(false);
      setLineCount(0);

      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Nothing to do if storage isn't available.
      }

      const totalMs = MIN_MS + Math.random() * (MAX_MS - MIN_MS);
      const lineWindow = totalMs * LINE_SHARE;
      const lineInterval = lineWindow / BOOT_LINES.length;
      const timers = BOOT_LINES.map((_, i) =>
        setTimeout(() => setLineCount(i + 1), lineInterval * (i + 1)),
      );
      timers.push(setTimeout(() => setFading(true), lineWindow));
      timers.push(setTimeout(() => setVisible(false), totalMs));
      timersRef.current = timers;
    });

    return () => {
      cancelAnimationFrame(startId);
      timersRef.current.forEach(clearTimeout);
    };
  }, [family]);

  if (!visible) return null;

  return (
    <div className={`cyberpunk-boot ${fading ? 'is-fading' : ''}`} aria-hidden="true">
      <pre>{BOOT_LINES.slice(0, lineCount).join('\n')}</pre>
    </div>
  );
}
