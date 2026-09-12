'use client';

import { ArrowRight, Moon, Sun } from 'lucide-react';

import { GRAMMAR_THEMES } from '@/lib/grammar';
import { useTheme } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';

export function GrammarHub() {
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
          <a href="/grammar" aria-current="page">
            Grammar
          </a>
          <a href="/study">Study</a>
          <SearchTrigger />
        </nav>
      </header>

      <section className="fundamentals-hero">
        <span className="eyebrow">Reference</span>
        <h1>Grammar</h1>
        <p>
          The patterns a beginner needs, in nine themes grouped by what you are
          trying to do. Every example has a speak button, and each theme page
          has its own Pinyinciation and English switches so it can become a
          self-test.
        </p>
      </section>

      <div className="hub-grid">
        {GRAMMAR_THEMES.map((theme) => (
          <a key={theme.id} href={`/grammar/${theme.id}`} className="hub-card">
            <span className="hub-card-num">{theme.num}</span>
            <h2>{theme.title}</h2>
            <p>{theme.intro}</p>
            <span className="hub-card-link">
              {theme.points.length} points <ArrowRight aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>

      <section className="fundamentals-cta">
        <div>
          <h2>That is the core of it</h2>
          <p>
            These nine themes cover the grammar a beginner meets first. The way
            to lock them in is to keep meeting them -- open a deck, and watch
            for these patterns in every phrase.
          </p>
        </div>
        <a href="/study" className="study-primary">
          Go to Study
        </a>
      </section>

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
