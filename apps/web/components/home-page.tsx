'use client';

import {
  ArrowRight,
  BookOpenText,
  Layers,
  Sparkles,
} from 'lucide-react';

import { SearchTrigger } from '@/components/search-trigger';
import { SettingsTrigger } from '@/components/settings-trigger';
import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { DayNightToggle } from '@/components/day-night-toggle';

export function HomePage() {
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
          <SettingsTrigger />
        </nav>
      </header>

      <section className="home-hero">
        <h1>Your path into Chinese, one Waypoint at a time.</h1>
        <p>
          ZiLu is built for people who are starting with zero Chinese knowledge.
          Every learner-facing word is Traditional Chinese, paired with pinyin
          and audio support you control.
        </p>
        <div className="home-hero-actions">
          <a href="/fundamentals" className="study-primary">
            Start with the fundamentals <ArrowRight aria-hidden="true" />
          </a>
          <a href="/study" className="study-secondary">
            Browse the flashcard pathways
          </a>
        </div>
      </section>

      <section className="home-cards" aria-label="Where to go next">
        <a href="/fundamentals" className="home-card">
          <BookOpenText aria-hidden="true" />
          <h2>Start Here: Fundamentals</h2>
          <p>
            New to Chinese? Learn how Traditional characters, pinyin, and tones
            fit together, plus the core sentence patterns you will meet
            constantly.
          </p>
          <span className="home-card-link">
            Learn the basics <ArrowRight aria-hidden="true" />
          </span>
        </a>

        <a href="/study" className="home-card">
          <Layers aria-hidden="true" />
          <h2>Study Pathways</h2>
          <p>
            Flip through Traditional Chinese vocabulary across Pathway 02 and
            Pathway 03, organized into Waypoints with Deck A and Deck B for each
            topic.
          </p>
          <span className="home-card-link">
            Open the deck browser <ArrowRight aria-hidden="true" />
          </span>
        </a>

        <a href="/study?guided=1" className="home-card home-card-pilot">
          <Sparkles aria-hidden="true" />
          <h2>Guided study loop</h2>
          <p>
            Work through any Deck one card at a time: flip, mark Still learning
            or Got it, and cards you miss come right back around until every one
            sticks. Opens on Pathway 01, Waypoint 01, Deck A first -- switch
            decks anytime from there.
          </p>
          <span className="home-card-link">
            Try the guided loop <ArrowRight aria-hidden="true" />
          </span>
        </a>
      </section>

      <footer className="footer">
        <p>
          Only the flashcard experience and this fundamentals bridge are in
          scope right now. Traditional Chinese stays canonical throughout.
        </p>
        <DayNightToggle />
      </footer>
    </main>
  );
}
