'use client';

import { useState } from 'react';
import { Check, Moon, Sparkles, Sun } from 'lucide-react';

import { AmbientBackground } from '@/components/ambient-background';
import { LessonPlayer } from '@/components/lesson-player';
import { Switch } from '@/components/ui/switch';
import { helloLesson } from '@/lib/lessons/hello';

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <main className="zilu-shell min-h-screen bg-background text-foreground" data-theme={darkMode ? 'dark' : 'light'}>
      <header className="zilu-header border-b">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a className="flex items-center gap-3" href="#lesson" aria-label="ZiLu lesson home">
            <span className="grid size-10 place-items-center rounded-full bg-[#b9f6c9] font-serif text-xl font-semibold text-[#0b1f25]">字</span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">ZiLu</span>
              <span className="brand-subtitle block text-[10px] uppercase tracking-[0.23em]">Your path into Chinese</span>
            </span>
          </a>
          <div className="header-meta flex items-center gap-2 text-xs">
            <span className="hidden sm:inline">Start Here</span>
            <span aria-hidden="true" className="hidden opacity-40 sm:inline">/</span>
            <span className="theme-pill rounded-full px-3 py-1.5">Lesson 01</span>
          </div>
        </div>
      </header>

      <section id="lesson" className="kinetic-hero relative overflow-hidden">
        <AmbientBackground mode={darkMode ? 'dark' : 'light'} />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-10 sm:px-8 lg:grid-cols-[minmax(0,0.64fr)_minmax(610px,1.36fr)] lg:px-12 lg:pb-20 lg:pt-14">
          <div className="relative z-10 flex flex-col justify-between py-2">
            <div>
              <div className="hero-badge mb-7 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
                <Sparkles className="size-3.5" aria-hidden="true" /> Zero knowledge required
              </div>
              <p className="lesson-overline">Start Here · 01</p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Your first greeting.
              </h1>
              <p className="hero-muted mt-6 max-w-lg text-base leading-7 sm:text-lg">
                Learn one useful phrase through six small steps. Support disappears only when you are ready to recall it.
              </p>
            </div>
            <div className="hero-step-labels mt-10 grid max-w-md grid-cols-3 gap-x-3 gap-y-3 border-t pt-6 text-xs lg:mt-16">
              {helloLesson.stages.map((stage, index) => (
                <span key={stage.id}>{String(index + 1).padStart(2, '0')} · {stage.label}</span>
              ))}
            </div>
          </div>

          <LessonPlayer lesson={helloLesson} />
        </div>
      </section>

      <section className="zilu-summary px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d85b3f]">How ZiLu teaches</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Support first. Recall when ready.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['01', 'Meaning before memory', 'Meet useful language in context before being asked to remember its written form.'],
              ['02', 'Help you control', 'Keep or hide pinyin and English support as your confidence changes.'],
              ['03', 'Feedback that teaches', 'Every check explains the answer and gives you a safe way to try again.'],
            ].map(([number, title, text]) => (
              <article key={number} className="summary-card rounded-2xl border p-5">
                <span className="font-mono text-xs text-[#2d9160]">{number}</span>
                <h3 className="mt-8 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#52686d]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="zilu-footer px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t pt-6">
          <div className="footer-note flex items-center gap-3 text-xs">
            <span className="grid size-6 place-items-center rounded-full bg-[#2dcb78]/15 text-[#1b7f50]"><Check className="size-3.5" aria-hidden="true" /></span>
            Learner-facing Chinese is always Traditional Chinese.
          </div>
          <fieldset className="mode-control">
            <legend className="sr-only">Appearance</legend>
            <Sun className="size-4" aria-hidden="true" />
            <span className="mode-label">Solar</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Use neon dark mode" className="theme-switch" />
            <Moon className="size-4" aria-hidden="true" />
            <span className="mode-label">Neon</span>
          </fieldset>
        </div>
      </footer>
    </main>
  );
}
