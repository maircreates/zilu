'use client';

import { ArrowLeft } from 'lucide-react';

import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { DayNightToggle } from '@/components/day-night-toggle';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

export function SettingsStubPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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
        <span className="eyebrow">Settings / Display</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <div className="settings-stub">
        <div>In progress -- coming in a later update.</div>
      </div>

      <footer className="footer">
        <p>Learner-facing Chinese is always Traditional Chinese.</p>
        <DayNightToggle />
      </footer>
    </main>
  );
}
