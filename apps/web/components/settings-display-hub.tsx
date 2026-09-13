'use client';

import { ArrowLeft, ArrowRight, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';

const CARDS = [
  {
    href: '/settings/display/aesthetics',
    num: '01',
    title: 'Aesthetics',
    teaser: 'Visual flourishes, like the homepage’s floating-characters background.',
  },
  {
    href: '/settings/display/ui',
    num: '02',
    title: 'UI',
    teaser: 'Layout and interface density. In progress.',
  },
  {
    href: '/settings/display/theme',
    num: '03',
    title: 'Theme',
    teaser: 'Solarpunk / Cyberpunk color themes. In progress -- for now, use the toggle in the footer.',
  },
] as const;

export function SettingsDisplayHub() {
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

      <a href="/settings" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Settings
      </a>

      <section className="settings-hero">
        <span className="eyebrow">Settings / Display</span>
        <h1>Display</h1>
        <p>How ZiLu looks: visual effects, interface density, and color theme.</p>
      </section>

      <div className="hub-grid">
        {CARDS.map((card) => (
          <a key={card.href} href={card.href} className="hub-card">
            <span className="hub-card-num">{card.num}</span>
            <h2>{card.title}</h2>
            <p>{card.teaser}</p>
            <span className="hub-card-link">
              Open <ArrowRight aria-hidden="true" />
            </span>
          </a>
        ))}
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
