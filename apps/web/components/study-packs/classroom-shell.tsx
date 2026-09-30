'use client';

import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

import { DayNightToggle } from '@/components/day-night-toggle';
import { SkillBar } from '@/components/skill-bar';
import { ThemeDivider } from '@/components/theme-divider';
import { Topbar } from '@/components/topbar';

export function ClassroomShell({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}) {
  return (
    <main className="app-shell classroom-shell">
      <div className="ambient" aria-hidden="true"><span /><span /><span /></div>
      <Topbar />
      <SkillBar active="classroom" />
      {backHref && (
        <a href={backHref} className="subpage-back">
          <ArrowLeft aria-hidden="true" /> {backLabel ?? 'Back'}
        </a>
      )}
      <section className="classroom-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <ThemeDivider />
      <div className="classroom-content">{children}</div>
      <footer className="footer">
        <p>Progress stays in this browser. Learner-facing Chinese remains Traditional Chinese.</p>
        <DayNightToggle />
      </footer>
    </main>
  );
}
