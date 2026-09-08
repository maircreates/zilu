'use client';

import { useCallback, useState } from 'react';
import { Moon, Sun, Volume2 } from 'lucide-react';

import { GRAMMAR_THEMES, type GrammarExample } from '@/lib/grammar';
import { useEnglishPreference } from '@/lib/use-english';
import { usePinyinciationPreference } from '@/lib/use-pinyinciation';
import { useTheme } from '@/lib/use-theme';

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="pinyin-toggle" aria-label={`${label}: ${hint}`}>
      <span>
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true">
        <span />
      </span>
    </label>
  );
}

export function GrammarGuide() {
  const [status, setStatus] = useState('');
  const [darkMode, setDarkMode] = useTheme();
  const [showPinyin, setShowPinyin] = usePinyinciationPreference();
  const [showEnglish, setShowEnglish] = useEnglishPreference();

  const speak = useCallback((hanzi: string) => {
    if (!('speechSynthesis' in window)) {
      setStatus('Audio is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hanzi);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.72;
    utterance.onstart = () => setStatus(`Playing ${hanzi}`);
    utterance.onend = () => setStatus('');
    window.speechSynthesis.speak(utterance);
  }, []);

  const renderExample = (ex: GrammarExample) => (
    <li key={ex.hanzi} className="grammar-example">
      <button
        type="button"
        className="grammar-speak"
        onClick={() => speak(ex.hanzi)}
        aria-label={`Hear ${ex.hanzi} pronounced`}
      >
        <Volume2 aria-hidden="true" />
      </button>
      <div className="grammar-example-body">
        <span lang="zh-Hant" className="grammar-cn">
          {ex.hanzi}
        </span>
        {showPinyin && <span className="grammar-py">{ex.pinyin}</span>}
        {showEnglish && <span className="grammar-en">{ex.english}</span>}
      </div>
    </li>
  );

  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

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
          <a href="/grammar" aria-current="page">
            Grammar
          </a>
          <a href="/study">Study</a>
        </nav>
      </header>

      <section className="fundamentals-hero">
        <span className="eyebrow">Reference</span>
        <h1>Grammar</h1>
        <p>
          The patterns a beginner needs, grouped by what you are trying to do.
          Every example has a speak button. Hide the pinyin or the English with
          the switches below and the page becomes a self-test.
        </p>
      </section>

      <div className="grammar-toggles">
        <Toggle
          label="Pinyinciation"
          hint="Show pinyin under each example"
          checked={showPinyin}
          onChange={setShowPinyin}
        />
        <Toggle
          label="English"
          hint="Show the translation"
          checked={showEnglish}
          onChange={setShowEnglish}
        />
      </div>

      <nav className="fundamentals-toc" aria-label="On this page">
        {GRAMMAR_THEMES.map((theme) => (
          <a key={theme.id} href={`#${theme.id}`}>
            <span>{theme.num}</span>
            {theme.title}
          </a>
        ))}
      </nav>

      {GRAMMAR_THEMES.map((theme) => (
        <section
          key={theme.id}
          id={theme.id}
          className="fundamentals-section"
          aria-labelledby={`${theme.id}-heading`}
        >
          <h2 id={`${theme.id}-heading`}>
            <span className="section-num">{theme.num}</span> {theme.title}
          </h2>
          <p>{theme.intro}</p>

          <div className="grammar-points">
            {theme.points.map((point) => (
              <article key={point.id} className="grammar-point">
                <div className="grammar-point-head">
                  <h3>{point.title}</h3>
                  <span className="grammar-tag">{point.waypoint}</span>
                </div>
                <p className="grammar-template">{point.template}</p>
                <p className="grammar-why">{point.why}</p>

                <ul className="grammar-examples">
                  {point.examples.map(renderExample)}
                </ul>

                {point.contrast && (
                  <div className="grammar-contrast">
                    <p className="grammar-wrong">
                      <span aria-hidden="true">✗</span>
                      <span lang="zh-Hant">{point.contrast.wrong}</span>
                    </p>
                    <p className="grammar-right">
                      <span aria-hidden="true">✓</span>
                      <span lang="zh-Hant">{point.contrast.right}</span>
                    </p>
                    <p className="grammar-contrast-why">{point.contrast.why}</p>
                  </div>
                )}

                {point.watchOut && (
                  <p className="grammar-watch">
                    <strong>Watch out</strong> {point.watchOut}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="fundamentals-cta">
        <div>
          <h2>More coming</h2>
          <p>
            Location, comparison, and joining ideas are next. For now, take
            these patterns into the decks and watch for them.
          </p>
        </div>
        <a href="/study" className="study-primary">
          Go to Study
        </a>
      </section>

      <p className="fundamentals-status" aria-live="polite">
        {status}
      </p>

      <footer className="footer">
        <p>Learner-facing Chinese is always Traditional Chinese.</p>
        <label
          className="theme-control"
          aria-label="Choose light or dark appearance"
        >
          <Sun aria-hidden="true" />
          <span>Solarpunk</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(event) => setDarkMode(event.target.checked)}
            aria-label="Use Cyberpunk dark mode"
          />
          <span className="toggle-track" aria-hidden="true">
            <span />
          </span>
          <Moon aria-hidden="true" />
          <span>Cyberpunk</span>
        </label>
      </footer>
    </main>
  );
}
