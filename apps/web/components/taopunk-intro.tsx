'use client';

import { useEffect, useState } from 'react';

import { useThemeFamily } from '@/lib/use-theme';

const WIPE_MS = 1100;
const SESSION_KEY = 'zilu:taopunk-intro-played';

/** A one-time arrival flourish for Taopunk, mirroring <CyberpunkBoot> --
 * an ink-colored panel wipes off to reveal the page underneath (a CSS
 * clip-path animation; the actual page renders normally the whole time,
 * just covered until the wipe clears), playing at most once per session.
 * Mounted once in the root layout alongside the other one-time effects. */
export function TaopunkIntro() {
  const [family] = useThemeFamily();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (family !== 'taopunk') return;
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // Storage unavailable -- just play it rather than block the flourish.
    }
    if (alreadyPlayed) return;

    // rAF-wrapped for the same reason as CyberpunkBoot: the react-compiler
    // linter flags setState called directly as a top-level effect-body
    // statement.
    const startId = requestAnimationFrame(() => setVisible(true));
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Nothing to do if storage isn't available.
      }
    }, WIPE_MS);

    return () => {
      cancelAnimationFrame(startId);
      clearTimeout(hideTimer);
    };
  }, [family]);

  if (!visible) return null;

  return <div className="taopunk-intro" aria-hidden="true" />;
}
