'use client';

import { ArrowRight } from 'lucide-react';

import { GRAMMAR_THEMES } from '@/lib/grammar';
import { DayNightToggle } from '@/components/day-night-toggle';
import { ThemeDivider } from '@/components/theme-divider';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

export function GrammarHub() {
  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Topbar />
      <SkillBar active="grammar" />

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
