'use client';

import { useCallback, useState } from 'react';
import { ArrowLeft, Moon, Sun, Volume2 } from 'lucide-react';

import { GRAMMAR_THEMES, type GrammarExample } from '@/lib/grammar';
import { useEnglishPreference } from '@/lib/use-english';
import { usePinyinciationPreference } from '@/lib/use-pinyinciation';
import { useTheme } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';

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

export function GrammarThemePage({ themeId }: { themeId: string }) {
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

  const index = GRAMMAR_THEMES.findIndex((item) => item.id === themeId);
  const theme = GRAMMAR_THEMES[index] ?? GRAMMAR_THEMES[0];
  const prev = GRAMMAR_THEMES[index - 1];
  const next = GRAMMAR_THEMES[index + 1];

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
          <SearchTrigger />
        </nav>
      </header>

      <a href="/grammar" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Grammar
      </a>

      <section className="fundamentals-hero">
        <span className="eyebrow">
          Grammar · {theme.num} / {GRAMMAR_THEMES.length}
        </span>
        <h1 id="theme-heading">{theme.title}</h1>
        <p>{theme.intro}</p>
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

      <section className="fundamentals-section" aria-labelledby="theme-heading">
        <div className="grammar-points">
          {theme.points.map((point) => (
            <article
              key={point.id}
              id={`point-${point.id}`}
              className="grammar-point"
            >
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

      <nav className="subpage-pager" aria-label="Theme navigation">
        {prev ? (
          <a href={`/grammar/${prev.id}`} className="pager-prev">
            <small>&larr; {prev.num}</small>
            <strong>{prev.title}</strong>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={`/grammar/${next.id}`} className="pager-next">
            <small>{next.num} &rarr;</small>
            <strong>{next.title}</strong>
          </a>
        ) : (
          <a href="/study" className="pager-next">
            <small>Next &rarr;</small>
            <strong>Go to Study</strong>
          </a>
        )}
      </nav>

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
