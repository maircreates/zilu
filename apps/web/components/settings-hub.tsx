'use client';

import { ArrowRight } from 'lucide-react';

import { SearchTrigger } from '@/components/search-trigger';
import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { DayNightToggle } from '@/components/day-night-toggle';
import { ThemeDivider } from '@/components/theme-divider';

export function SettingsHub() {
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

      <section className="settings-hero">
        <span className="eyebrow">Settings</span>
        <h1>Settings</h1>
        <p>Control how ZiLu looks and behaves. Nothing here changes what you study.</p>
      </section>

      <ThemeDivider />

      <div className="hub-grid">
        <a href="/settings/display" className="hub-card">
          <span className="hub-card-num">01</span>
          <h2>Display</h2>
          <p>Aesthetics, UI, and Theme -- everything about how the app looks.</p>
          <span className="hub-card-link">
            Open <ArrowRight aria-hidden="true" />
          </span>
        </a>
      </div>

      <footer className="footer">
        <p>Learner-facing Chinese is always Traditional Chinese.</p>
        <DayNightToggle />
      </footer>
    </main>
  );
}
