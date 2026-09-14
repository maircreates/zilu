'use client';

import { useEffect, useRef, useState } from 'react';

import { useThemeFamily } from '@/lib/use-theme';

/** Randomized 1500-2000ms each play-through, same budget as CyberpunkBoot
 * and SilkpunkIntro so no one theme's loading moment reads as slower than
 * the others. */
const MIN_MS = 1500;
const MAX_MS = 2000;

export function TaopunkIntro() {
  const [family] = useThemeFamily();
  const [visible, setVisible] = useState(false);
  const [wipeMs, setWipeMs] = useState(MIN_MS);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Plays once per tab lifetime -- see CyberpunkBoot's identical guard
    // for why this is a ref, not sessionStorage.
    if (family !== 'taopunk' || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    // rAF-wrapped for the same reason as CyberpunkBoot: the react-compiler
    // linter flags an impure call (Math.random here, plus setState) made
    // directly as a top-level effect-body statement.
    const startId = requestAnimationFrame(() => {
      const totalMs = MIN_MS + Math.random() * (MAX_MS - MIN_MS);
      setWipeMs(totalMs);
      setVisible(true);
    });

    return () => cancelAnimationFrame(startId);
  }, [family]);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), wipeMs);
    return () => clearTimeout(hideTimer);
  }, [visible, wipeMs]);

  if (!visible) return null;

  return (
    <div
      className="taopunk-intro"
      aria-hidden="true"
      style={{ animationDuration: `${wipeMs}ms` }}
    />
  );
}
