'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { SearchTrigger } from '@/components/search-trigger';
import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { DayNightToggle } from '@/components/day-night-toggle';

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
    teaser: 'Cyberpunk, Silkpunk, or Taopunk -- each with its own day and night look.',
  },
] as const;

export function SettingsDisplayHub() {

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
        <DayNightToggle />
      </footer>
    </main>
  );
}
