'use client';

import { ArrowLeft, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';

export function SettingsStubPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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

      <a href="/settings/display" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Display
      </a>

      <section className="settings-hero">
        <span className="eyebrow">Settings / Display</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <div className="settings-stub">
        <div>In progress -- coming in a later update.</div>
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
