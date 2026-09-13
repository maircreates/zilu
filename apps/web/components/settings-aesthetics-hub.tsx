'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { SearchTrigger } from '@/components/search-trigger';
import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { DayNightToggle } from '@/components/day-night-toggle';

export function SettingsAestheticsHub() {
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

      <a href="/settings/display" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Display
      </a>

      <section className="settings-hero">
        <span className="eyebrow">Settings / Display / Aesthetics</span>
        <h1>Aesthetics</h1>
        <p>Visual flourishes layered on top of the core experience.</p>
      </section>

      <div className="hub-grid">
        <a href="/settings/display/aesthetics/homepage" className="hub-card">
          <span className="hub-card-num">01</span>
          <h2>Homepage</h2>
          <p>
            The floating Chinese characters drifting behind the homepage hero
            -- turn it on or off, and choose what hovering, clicking, and
            dragging a character does.
          </p>
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
