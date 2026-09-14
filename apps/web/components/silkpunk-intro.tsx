'use client';

import { useEffect, useRef, useState } from 'react';

import { useThemeFamily } from '@/lib/use-theme';

/** Randomized 1500-2000ms each play-through, matching CyberpunkBoot and
 * TaopunkIntro's budget. A silk curtain -- two panels meeting at a gold
 * seam -- holds for a short beat, then parts to reveal the page underneath,
 * the theatrical "curtains open" reveal Silkpunk doesn't otherwise have an
 * equivalent moment for. */
const MIN_MS = 1500;
const MAX_MS = 2000;
/** Share of the total spent "closed" before the panels start parting. */
const HOLD_SHARE = 0.15;

export function SilkpunkIntro() {
  const [family] = useThemeFamily();
  const [visible, setVisible] = useState(false);
  const [totalMs, setTotalMs] = useState(MIN_MS);
  const [holdMs, setHoldMs] = useState(0);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Plays once per tab lifetime -- see CyberpunkBoot's identical guard
    // for why this is a ref, not sessionStorage.
    if (family !== 'silkpunk' || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    // rAF-wrapped for the same reason as CyberpunkBoot: the react-compiler
    // linter flags an impure call (Math.random here, plus setState) made
    // directly as a top-level effect-body statement.
    const startId = requestAnimationFrame(() => {
      const total = MIN_MS + Math.random() * (MAX_MS - MIN_MS);
      setTotalMs(total);
      setHoldMs(total * HOLD_SHARE);
      setVisible(true);
    });

    return () => cancelAnimationFrame(startId);
  }, [family]);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), totalMs);
    return () => clearTimeout(hideTimer);
  }, [visible, totalMs]);

  if (!visible) return null;

  const partMs = totalMs - holdMs;

  return (
    <div className="silkpunk-intro" aria-hidden="true">
      <span
        className="silkpunk-intro-panel silkpunk-intro-panel-left"
        style={{ animationDuration: `${partMs}ms`, animationDelay: `${holdMs}ms` }}
      />
      <span
        className="silkpunk-intro-panel silkpunk-intro-panel-right"
        style={{ animationDuration: `${partMs}ms`, animationDelay: `${holdMs}ms` }}
      />
    </div>
  );
}
