'use client';

import { ArrowRight } from 'lucide-react';

import { SECTIONS } from '@/lib/fundamentals';
import { SearchTrigger } from '@/components/search-trigger';
import { SettingsTrigger } from '@/components/settings-trigger';
import { DayNightToggle } from '@/components/day-night-toggle';
import { ThemeDivider } from '@/components/theme-divider';

export function FundamentalsHub() {
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
          <SettingsTrigger />
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

      <ThemeDivider />

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
        <DayNightToggle />
      </footer>
    </main>
  );
}
