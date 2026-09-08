'use client';

import { useCallback, useState } from 'react';
import { ArrowRight, Moon, Sun, Volume2 } from 'lucide-react';
import Link from 'next/link';

import {
  NUMBERS,
  SENTENCE_PATTERNS,
  SOUND_CONTRASTS,
  SURVIVAL_PHRASES,
  TONES,
} from '@/lib/fundamentals';

function AudioButton({
  hanzi,
  onSpeak,
}: {
  hanzi: string;
  onSpeak: (hanzi: string) => void;
}) {
  return (
    <button
      type="button"
      className="fundamentals-audio"
      onClick={() => onSpeak(hanzi)}
      aria-label={`Hear ${hanzi} pronounced`}
    >
      <span lang="zh-Hant" className="fundamentals-hanzi">
        {hanzi}
      </span>
      <Volume2 aria-hidden="true" />
    </button>
  );
}

export function FundamentalsGuide() {
  const [status, setStatus] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const speak = useCallback((hanzi: string) => {
    if (!('speechSynthesis' in window)) {
      setStatus('Audio is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hanzi);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.75;
    utterance.onstart = () => setStatus(`Playing ${hanzi}`);
    utterance.onend = () => setStatus('');
    window.speechSynthesis.speak(utterance);
  }, []);

  return (
    <main className="app-shell" data-theme={darkMode ? 'dark' : 'light'}>
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="topbar">
        <Link className="brand" href="/" aria-label="ZiLu home">
          <span className="brand-mark">字</span>
          <span>
            <strong>ZiLu</strong>
            <small>Your path into Chinese</small>
          </span>
        </Link>
        <nav className="topbar-nav" aria-label="Primary">
          <Link href="/fundamentals" aria-current="page">
            Fundamentals
          </Link>
          <Link href="/study">Study</Link>
        </nav>
      </header>

      <section className="fundamentals-hero">
        <span className="eyebrow">Start Here</span>
        <h1>Chinese fundamentals</h1>
        <p>
          An original bridge for learners with zero prior Chinese knowledge.
          Everything on this page is meant to be understood before Pathway 02.
        </p>
      </section>

      <section
        className="fundamentals-section"
        aria-labelledby="writing-heading"
      >
        <h2 id="writing-heading">How Chinese is written and read</h2>
        <p>
          Every word here is shown three ways:{' '}
          <strong>Traditional Chinese characters</strong> (what native readers
          use), <strong>pinyin</strong> (a spelling system that shows
          pronunciation and tone), and an
          <strong> English meaning</strong>. Pinyin is a learning support -- it
          is never the canonical, stored form of the word.
        </p>
        <div className="fundamentals-card">
          <AudioButton hanzi="你好" onSpeak={speak} />
          <p>
            <strong>nǐ hǎo</strong> · hello
          </p>
        </div>
      </section>

      <section className="fundamentals-section" aria-labelledby="tones-heading">
        <h2 id="tones-heading">The four tones, and a neutral one</h2>
        <p>
          Mandarin uses pitch to tell words apart. The same syllable, said with
          a different tone, becomes a different word -- so tone is part of
          pronunciation, not decoration.
        </p>
        <div className="tone-grid">
          {TONES.map((tone) => (
            <article key={tone.id} className="tone-card">
              <span className="tone-index">
                {tone.toneNumber === 0
                  ? 'Neutral tone'
                  : `Tone ${tone.toneNumber}`}
              </span>
              <AudioButton hanzi={tone.hanzi} onSpeak={speak} />
              <strong>{tone.pinyin}</strong>
              <span className="tone-meaning">{tone.meaning}</span>
              <p>{tone.contour}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="fundamentals-section"
        aria-labelledby="sounds-heading"
      >
        <h2 id="sounds-heading">Pinyin is not English spelling</h2>
        <p>
          Some pinyin letters represent sounds English does not have, and some
          familiar-looking letters are pronounced differently. These pairs are
          worth noticing early.
        </p>
        <ul className="contrast-list">
          {SOUND_CONTRASTS.map((item) => (
            <li key={item.pair}>
              <strong>{item.pair}</strong>
              <span>{item.example}</span>
              <p>{item.tip}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="fundamentals-section"
        aria-labelledby="patterns-heading"
      >
        <h2 id="patterns-heading">Core sentence structures</h2>
        <p>
          Chinese grammar is not English with the words swapped out. These
          patterns cover the structures you will meet constantly, starting with
          Pathway 02.
        </p>
        <div className="pattern-grid">
          {SENTENCE_PATTERNS.map((pattern) => (
            <article key={pattern.id} className="pattern-card">
              <h3>{pattern.title}</h3>
              <p className="pattern-template">{pattern.template}</p>
              <p className="pattern-explanation">{pattern.explanation}</p>
              <div className="pattern-example">
                <AudioButton hanzi={pattern.example.hanzi} onSpeak={speak} />
                <p>
                  <strong>{pattern.example.pinyin}</strong> ·{' '}
                  {pattern.example.meaning}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="fundamentals-section"
        aria-labelledby="numbers-heading"
      >
        <h2 id="numbers-heading">Numbers that unlock daily life</h2>
        <p>
          Once you know zero through ten, you can build phone numbers, prices,
          ages, dates, and times.
        </p>
        <div className="number-row">
          {NUMBERS.map((item) => (
            <button
              key={item.hanzi}
              type="button"
              className="number-chip"
              onClick={() => speak(item.hanzi)}
              aria-label={`Hear ${item.hanzi}, ${item.meaning}, pronounced`}
            >
              <span lang="zh-Hant">{item.hanzi}</span>
              <small>{item.pinyin}</small>
            </button>
          ))}
        </div>
      </section>

      <section
        className="fundamentals-section"
        aria-labelledby="phrases-heading"
      >
        <h2 id="phrases-heading">Essential survival phrases</h2>
        <p>
          Choose the phrase that fits the situation -- do not translate word by
          word.
        </p>
        <div className="phrase-grid">
          {SURVIVAL_PHRASES.map((item) => (
            <article key={item.hanzi} className="phrase-card">
              <AudioButton hanzi={item.hanzi} onSpeak={speak} />
              <strong>{item.pinyin}</strong>
              <span>{item.meaning}</span>
              <small>{item.situation}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="fundamentals-cta">
        <div>
          <h2>Ready for Pathway 02</h2>
          <p>
            Pathway 02 begins mid-story, with weather, dining, and everyday
            plans. These fundamentals are the bridge that gets you there.
          </p>
        </div>
        <Link href="/study" className="study-primary">
          Go to Study <ArrowRight aria-hidden="true" />
        </Link>
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
            aria-label="Use Chinese Cyberpunk dark mode"
          />
          <span className="toggle-track" aria-hidden="true">
            <span />
          </span>
          <Moon aria-hidden="true" />
          <span>Chinese Cyberpunk</span>
        </label>
      </footer>
    </main>
  );
}
