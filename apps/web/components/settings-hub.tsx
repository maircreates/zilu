'use client';

import { ArrowRight } from 'lucide-react';

import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { DayNightToggle } from '@/components/day-night-toggle';
import { ThemeDivider } from '@/components/theme-divider';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

export function SettingsHub() {
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

      <section className="settings-hero">
        <span className="eyebrow">Settings</span>
        <h1>Settings</h1>
        <p>Control how ZiLu looks and behaves. Nothing here changes what you study.</p>
      </section>

      <ThemeDivider />

      <div className="hub-grid">
        <a href="/settings/display" className="hub-card">
          <span className="hub-card-num">01</span>
          <h2>Display</h2>
          <p>Aesthetics, UI, and Theme -- everything about how the app looks.</p>
          <span className="hub-card-link">
            Open <ArrowRight aria-hidden="true" />
          </span>
        </a>
        <a href="/zili-fang" className="hub-card">
          <span className="hub-card-num">02</span>
          <h2>字力房 -- Experimental</h2>
          <p>
            Small drills aimed at specific learner struggles. Genuinely experimental --
            this may change shape or go away entirely.
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
