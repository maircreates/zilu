'use client';

import { ArrowRight, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';

export function SettingsHub() {
  const [darkMode, setDarkMode] = useTheme();

  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

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
        <label
          className="theme-control"
          aria-label="Choose light or dark appearance"
        >
          <Sun aria-hidden="true" />
          <span>Solarpunk</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(event) => setDarkMode(event.target.checked)}
            aria-label="Use Cyberpunk dark mode"
          />
          <span className="toggle-track" aria-hidden="true">
            <span />
          </span>
          <Moon aria-hidden="true" />
          <span>Cyberpunk</span>
        </label>
      </footer>
    </main>
  );
}
