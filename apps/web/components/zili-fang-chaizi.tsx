'use client';

import { useCallback, useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';

import { CHAIZI_ENTRIES } from '@/lib/zili-fang-chaizi';
import { DayNightToggle } from '@/components/day-night-toggle';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

export function ZiliFangChaizi() {
  const [status, setStatus] = useState('');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

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

  function toggle(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Topbar />
      <SkillBar />

      <a href="/zili-fang" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> 字力房
      </a>

      <section className="fundamentals-hero">
        <span className="eyebrow">拆字</span>
        <h1>Character Deconstruction</h1>
        <p>
          A character stops being a random shape once it&apos;s a small story built from
          parts you already know. Try to guess the story before you tap to reveal it --
          these are memory aids, not rigorous history.
        </p>
      </section>

      <section className="fundamentals-section">
        <div className="chaizi-grid">
          {CHAIZI_ENTRIES.map((entry) => {
            const isRevealed = revealed.has(entry.hanzi);
            return (
              <div
                key={entry.hanzi}
                className={`chaizi-card ${isRevealed ? 'is-revealed' : ''}`}
              >
                <div className="chaizi-card-head">
                  <span lang="zh-Hant" className="chaizi-hanzi">
                    {entry.hanzi}
                  </span>
                  <button
                    type="button"
                    className="grammar-speak"
                    onClick={() => speak(entry.hanzi)}
                    aria-label={`Hear ${entry.hanzi} pronounced`}
                  >
                    <Volume2 aria-hidden="true" />
                  </button>
                </div>
                <p className="chaizi-pinyin">{entry.pinyin}</p>

                {isRevealed ? (
                  <div className="chaizi-body">
                    <p className="chaizi-meaning">{entry.meaning}</p>
                    <div className="chaizi-parts">
                      {entry.parts.map((part, i) => (
                        <span key={i} className={`chaizi-part chaizi-part-${part.role}`}>
                          <span lang="zh-Hant">{part.hanzi}</span>
                          <small>{part.meaning}</small>
                        </span>
                      ))}
                    </div>
                    <p className="chaizi-story">{entry.story}</p>
                  </div>
                ) : null}

                <button
                  type="button"
                  className="chaizi-reveal"
                  onClick={() => toggle(entry.hanzi)}
                  aria-expanded={isRevealed}
                >
                  {isRevealed ? 'Hide the story' : 'Tap to reveal the story'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <nav className="subpage-pager" aria-label="Zi Li Fang navigation">
        <a href="/zili-fang/word-fight" className="pager-prev">
          <small>&larr; 字打架</small>
          <strong>Word Fight</strong>
        </a>
        <a href="/zili-fang/lazy-mode" className="pager-next">
          <small>懶人模式 &rarr;</small>
          <strong>Lazy Mode</strong>
        </a>
      </nav>

      <p className="fundamentals-status" aria-live="polite">
        {status}
      </p>

      <footer className="footer">
        <p>Learner-facing Chinese is always Traditional Chinese.</p>
        <DayNightToggle />
      </footer>
    </main>
  );
}
