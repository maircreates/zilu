'use client';

import { ArrowLeft } from 'lucide-react';

import { useThemeFamily, type ThemeFamily } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';
import { SegmentedControl } from '@/components/segmented-control';
import { DayNightToggle } from '@/components/day-night-toggle';
import { FloatingCharactersBg } from '@/components/floating-characters-bg';

const FAMILY_OPTIONS: { id: ThemeFamily; label: string }[] = [
  { id: 'silkpunk', label: 'Silkpunk' },
  { id: 'taopunk', label: 'Taopunk' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
];

const FAMILY_BLURBS: Record<ThemeFamily, string> = {
  silkpunk: 'Warm ivory, jade, and lacquer red -- silk and brass.',
  taopunk: 'Muted stone and bamboo greens -- ink-wash calm.',
  cyberpunk: 'High-contrast neon pink and teal -- electric and futuristic.',
};

export function SettingsThemePage() {
  const [family, setFamily] = useThemeFamily();

  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <FloatingCharactersBg />

      <header className="topbar">
        <a className="brand" href="/" aria-label="ZiLu home">
          <span className="brand-mark">字</span>
          <span>
            <strong>ZiLu</strong>
            <small>Your path into Chinese</small>
          </span>
        </a>
        <nav className="topbar-nav" aria-label="Primary">
          <a href="/fundamentals">Fundamentals</a>
          <a href="/grammar">Grammar</a>
          <a href="/study">Study</a>
          <SearchTrigger />
        </nav>
      </header>

      <a href="/settings/display" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Display
      </a>

      <section className="settings-hero">
        <span className="eyebrow">Settings / Display / Theme</span>
        <h1>Theme</h1>
        <p>
          Pick a color family. Each one has its own day and night look --
          switch between those anytime from the sun/moon toggle below.
        </p>
      </section>

      <div className="settings-panel">
        <div className="settings-row">
          <div className="settings-row-head">
            <strong>Color family</strong>
          </div>
          <SegmentedControl
            legend="Theme color family"
            value={family}
            options={FAMILY_OPTIONS}
            onChange={setFamily}
          />
          <p className="settings-row-note">{FAMILY_BLURBS[family]}</p>
        </div>
      </div>

      <footer className="footer">
        <p>Learner-facing Chinese is always Traditional Chinese.</p>
        <DayNightToggle />
      </footer>
    </main>
  );
}
