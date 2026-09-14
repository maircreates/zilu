'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { DayNightToggle } from '@/components/day-night-toggle';
import { ThemeDivider } from '@/components/theme-divider';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

export function SettingsAestheticsHub() {
  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <FloatingCharactersBg />

      <Topbar />
      <SkillBar active="settings" />

      <a href="/settings/display" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Display
      </a>

      <section className="settings-hero">
        <span className="eyebrow">Settings / Display / Aesthetics</span>
        <h1>Aesthetics</h1>
        <p>Visual flourishes layered on top of the core experience.</p>
      </section>

      <ThemeDivider />

      <div className="hub-grid">
        <a href="/settings/display/aesthetics/homepage" className="hub-card">
          <span className="hub-card-num">01</span>
          <h2>Floating Characters</h2>
          <p>
            The floating Chinese characters drifting in the background --
            turn it on or off, and choose what hovering, clicking, and
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
