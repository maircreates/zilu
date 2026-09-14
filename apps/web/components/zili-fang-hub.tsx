'use client';

import { ArrowRight } from 'lucide-react';

import { DayNightToggle } from '@/components/day-night-toggle';
import { ThemeDivider } from '@/components/theme-divider';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

const WORKOUTS = [
  {
    id: 'tone-duel',
    glyph: '調',
    title: '調對決 -- Tone Duel',
    description:
      'The #1 beginner wall: the same syllable, four different tones, four different words. Listen and pick the one you heard.',
  },
  {
    id: 'word-fight',
    glyph: '打',
    title: '字打架 -- Word Fight',
    description:
      '就/才, 還/再, 的/得/地, 為了/因為 -- words English collapses into one, fighting over the same meaning. Wrong vs. right, side by side.',
  },
  {
    id: 'chaizi',
    glyph: '拆',
    title: '拆字 -- Character Deconstruction',
    description:
      'A character stops being a random shape once you see it as a small story built from familiar parts.',
  },
  {
    id: 'lazy-mode',
    glyph: '懶',
    title: '懶人模式 -- Lazy Mode',
    description:
      'Five cards, out loud, once a day. No willpower required -- just remove the choice of whether to open the app.',
  },
];

export function ZiliFangHub() {
  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Topbar />
      <SkillBar />

      <section className="fundamentals-hero">
        <span className="eyebrow">Experimental</span>
        <h1>字力房 -- The Gym</h1>
        <p>
          Not another reference page -- a set of small, focused drills, each aimed at
          one specific thing learners get stuck on. This section is genuinely
          experimental: it might change shape or disappear entirely as we figure out
          what actually helps.
        </p>
      </section>

      <ThemeDivider />

      <div className="hub-grid">
        {WORKOUTS.map((workout) => (
          <a key={workout.id} href={`/zili-fang/${workout.id}`} className="hub-card">
            <span className="zili-fang-hub-glyph" lang="zh-Hant" aria-hidden="true">
              {workout.glyph}
            </span>
            <h2>{workout.title}</h2>
            <p>{workout.description}</p>
            <span className="hub-card-link">
              Train <ArrowRight aria-hidden="true" />
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
