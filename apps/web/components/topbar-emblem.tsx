'use client';

import { useEffect, useState } from 'react';

import { useThemeMode } from '@/lib/use-theme';

/** The actual reference frames the Silkpunk theme is being designed from --
 * not a hand-coded scene. Near-duplicate shots per mode (the cloak, maple
 * leaves, and fireflies shift between them), played back and forth so the
 * motion reads as continuous wind rather than a hard cut. */
const SILKPUNK_DAY_FRAMES = Array.from({ length: 10 }, (_, i) => `/silkpunk/day-${i + 1}.webp`);
const SILKPUNK_NIGHT_FRAMES = Array.from({ length: 10 }, (_, i) => `/silkpunk/night-${i + 1}.webp`);

/** Cross-fades through the frame set for the active mode, ping-ponging
 * 0,1,2,...,n,...,1,0,... instead of looping n->0, so there's never a jump
 * cut. */
function SilkpunkScene() {
  const [mode] = useThemeMode();
  const frames = mode === 'night' ? SILKPUNK_NIGHT_FRAMES : SILKPUNK_DAY_FRAMES;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (frames.length < 2) return;
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [frames.length]);

  const period = (frames.length - 1) * 2;
  const pos = period > 0 ? tick % period : 0;
  const index = pos < frames.length ? pos : period - pos;

  return (
    <div className="topbar-emblem-silkpunk" aria-hidden="true">
      {frames.map((src, i) => (
        // oxlint-disable-next-line next/no-img-element -- decorative reference frames, not app content; no next/image loader in this build
        <img key={src} src={src} alt="" className={i === index ? 'is-active' : undefined} />
      ))}
    </div>
  );
}

/** A pool of real Traditional Chinese characters (not a hand-picked "looks
 * cool" set -- pulled loosely from the app's own vocabulary flavor) for the
 * Cyberpunk digital-rain columns. Decorative only, not a learning surface,
 * so accuracy/coverage doesn't matter here the way it does for the floating
 * characters background. */
const RAIN_CHARS = [
  '字', '路', '學', '中', '文', '語', '心', '道', '風', '光',
  '雨', '雲', '山', '水', '火', '電', '夢', '影', '流', '聲',
];

/** Deterministic, not Math.random() -- the same (seed, index) always picks
 * the same character. A column's character sequence has to render exactly
 * alike on the server and during client hydration; Math.random() would give
 * each side a different value for the same slot and trigger a hydration
 * mismatch (confirmed live: server picked 字, client picked 路 for the same
 * span). The multipliers are just two co-prime-ish numbers to spread the
 * picks out rather than any meaningful values. */
function pickChar(seed: number, index: number) {
  return RAIN_CHARS[(seed * 7 + index * 13) % RAIN_CHARS.length];
}

/** One falling column: a sequence of characters duplicated back-to-back and
 * animated from translateY(-50%) to translateY(0) -- since the duplicate
 * makes the inner block exactly 2x one sequence's height, that shift is
 * exactly one sequence, so the loop point is seamless. An infinite CSS loop
 * like this has no "stuck" failure mode the way a one-time transition
 * competing with a per-frame property could -- every point in the cycle is
 * a valid, complete-looking frame, so a paused/resumed compositor just
 * picks the loop back up wherever it left off. */
function RainColumn({ seed, length = 7 }: { seed: number; length?: number }) {
  const chars = Array.from({ length }, (_, index) => pickChar(seed, index));
  return (
    <div className="topbar-emblem-rain-col">
      <div
        className="topbar-emblem-rain-inner"
        style={{
          animationDuration: `${2.2 + (seed % 5) * 0.5}s`,
          animationDelay: `${-(seed % 7) * 0.4}s`,
        }}
      >
        {chars.map((ch, i) => (
          <span key={`a${i}`}>{ch}</span>
        ))}
        {chars.map((ch, i) => (
          <span key={`b${i}`}>{ch}</span>
        ))}
      </div>
    </div>
  );
}

/** Fills the empty gap in the topbar's center (brand sits left, nav sits
 * right, leaving open space between on any reasonably wide viewport) with a
 * small family-specific emblem. Taopunk gets a yin-yang flanked by two
 * hand-drawn-style ensō circles; Cyberpunk gets a small digital-rain console
 * of falling characters. Real inline SVG/DOM (not a CSS mask/background-
 * image data URI), so colors can reference the theme's own custom
 * properties directly and stay correct across day/night without hardcoding
 * hex values per combo. */
export function TopbarEmblem() {
  return (
    <div className="topbar-emblem" aria-hidden="true">
      <svg
        className="topbar-emblem-taopunk"
        viewBox="0 0 220 56"
        width="220"
        height="56"
      >
        <path
          className="topbar-emblem-enso"
          d="M40,14 C48,13 54,19 53,27 C52,35 45,41 37,40 C30,39 24,34 25,26 C25.6,20 30,15 36,14.5"
        />
        <g transform="translate(88,6)">
          <circle cx="22" cy="22" r="19" className="topbar-emblem-yy-light" />
          <path
            d="M22,3 A9.5,9.5 0 0,1 22,22 A9.5,9.5 0 0,0 22,41 A19,19 0 0,1 22,3 Z"
            className="topbar-emblem-yy-dark"
          />
          <circle cx="22" cy="12.5" r="3" className="topbar-emblem-yy-dark" />
          <circle cx="22" cy="31.5" r="3" className="topbar-emblem-yy-light" />
        </g>
        <path
          className="topbar-emblem-enso"
          d="M180,14 C172,13 166,19 167,27 C168,35 175,41 183,40 C190,39 196,34 195,26 C194.4,20 190,15 184,14.5"
        />
      </svg>

      <div className="topbar-emblem-cyberpunk">
        {[0, 1, 2, 3, 4, 5].map((seed) => (
          <RainColumn key={seed} seed={seed} />
        ))}
      </div>

      <SilkpunkScene />
    </div>
  );
}
