'use client';

import { ArrowRight, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/lib/use-theme';
import { SECTIONS } from '@/lib/fundamentals';
import { SearchTrigger } from '@/components/search-trigger';

export function FundamentalsHub() {
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
          <a href="/fundamentals" aria-current="page">
            Fundamentals
          </a>
          <a href="/grammar">Grammar</a>
          <a href="/study">Study</a>
          <SearchTrigger />
        </nav>
      </header>

      <section className="fundamentals-hero">
        <span className="eyebrow">Start Here</span>
        <h1>Chinese fundamentals</h1>
        <p>
          A ground-up orientation for anyone starting from zero, in thirteen
          short pages. Read them in order once, then come back whenever
          something in a lesson feels unexplained. Everything here is original,
          and every Chinese word has a button that speaks it aloud.
        </p>
      </section>

      <div className="hub-grid">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`/fundamentals/${section.id}`}
            className="hub-card"
          >
            <span className="hub-card-num">{section.num}</span>
            <h2>{section.title}</h2>
            <p>{section.teaser}</p>
            <span className="hub-card-link">
              Read it <ArrowRight aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>

      <section className="fundamentals-cta">
        <div>
          <h2>Ready for Pathway 01</h2>
          <p>
            Pathway 01 &mdash; First Steps starts with greetings and family and
            builds up from there. These fundamentals are the ground it stands
            on.
          </p>
        </div>
        <a href="/study" className="study-primary">
          Go to Study <ArrowRight aria-hidden="true" />
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
