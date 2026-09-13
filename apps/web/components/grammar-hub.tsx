'use client';

import { ArrowRight } from 'lucide-react';

import { GRAMMAR_THEMES } from '@/lib/grammar';
import { SearchTrigger } from '@/components/search-trigger';
import { SettingsTrigger } from '@/components/settings-trigger';
import { DayNightToggle } from '@/components/day-night-toggle';
import { ThemeDivider } from '@/components/theme-divider';

export function GrammarHub() {
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
          <SettingsTrigger />
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

      <ThemeDivider />

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
        <DayNightToggle />
      </footer>
    </main>
  );
}
