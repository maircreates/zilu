'use client';

import { useThemeMode } from '@/lib/use-theme';

/** The footer's quick day/night switch -- independent of which "punk" color
 * family is active (that lives in Settings > Display > Theme). Uses 日/月
 * themselves as the icons rather than sun/moon glyphs, no text labels. */
export function DayNightToggle() {
  const [mode, setMode] = useThemeMode();
  const isNight = mode === 'night';

  return (
    <label className="theme-control" aria-label="Choose day or night mode">
      <span className="theme-control-glyph" lang="zh-Hant" aria-hidden="true">
        日
      </span>
      <input
        type="checkbox"
        checked={isNight}
        onChange={(event) => setMode(event.target.checked ? 'night' : 'day')}
        aria-label="Use night mode"
      />
      <span className="toggle-track" aria-hidden="true">
        <span />
      </span>
      <span className="theme-control-glyph" lang="zh-Hant" aria-hidden="true">
        月
      </span>
    </label>
  );
}
