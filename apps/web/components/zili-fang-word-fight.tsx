'use client';

import { useCallback, useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';

import { WORD_FIGHTS } from '@/lib/zili-fang-near-synonyms';
import { usePinyinciationPreference } from '@/lib/use-pinyinciation';
import { DayNightToggle } from '@/components/day-night-toggle';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

export function ZiliFangWordFight() {
  const [status, setStatus] = useState('');
  const [showPinyin, setShowPinyin] = usePinyinciationPreference();

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
        <span className="eyebrow">字打架</span>
        <h1>Word Fight</h1>
        <p>
          Pairs a bilingual dictionary collapses into one English word, fighting over
          the same meaning. Wrong sentence, right sentence, and why -- side by side is
          how the difference actually sinks in.
        </p>
      </section>

      <div className="grammar-toggles">
        <label className="pinyin-toggle" aria-label="Pinyinciation: Show pinyin under each example">
          <span>
            <strong>Pinyinciation</strong>
            <small>Show pinyin under each example</small>
          </span>
          <input
            type="checkbox"
            checked={showPinyin}
            onChange={(event) => setShowPinyin(event.target.checked)}
          />
          <span className="toggle-track" aria-hidden="true">
            <span />
          </span>
        </label>
      </div>

      <section className="fundamentals-section">
        <div className="grammar-points">
          {WORD_FIGHTS.map((fight) => (
            <article key={fight.id} className="grammar-point">
              <div className="grammar-point-head">
                <h3>{fight.title}</h3>
                <span className="grammar-tag">{fight.words}</span>
              </div>
              <p className="grammar-why">{fight.instinct}</p>
              <p className="grammar-template">{fight.rule}</p>

              {fight.examples.map((example, i) => (
                <div key={i} className="grammar-contrast">
                  <p className="grammar-wrong">
                    <span aria-hidden="true">✗</span>
                    <button
                      type="button"
                      className="grammar-speak"
                      onClick={() => speak(example.wrong)}
                      aria-label={`Hear ${example.wrong} pronounced`}
                    >
                      <Volume2 aria-hidden="true" />
                    </button>
                    <span lang="zh-Hant">{example.wrong}</span>
                    {showPinyin && <small>{example.wrongPinyin}</small>}
                  </p>
                  <p className="grammar-right">
                    <span aria-hidden="true">✓</span>
                    <button
                      type="button"
                      className="grammar-speak"
                      onClick={() => speak(example.right)}
                      aria-label={`Hear ${example.right} pronounced`}
                    >
                      <Volume2 aria-hidden="true" />
                    </button>
                    <span lang="zh-Hant">{example.right}</span>
                    {showPinyin && <small>{example.rightPinyin}</small>}
                  </p>
                  <p className="grammar-contrast-why">{example.why}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <nav className="subpage-pager" aria-label="Zi Li Fang navigation">
        <a href="/zili-fang/tone-duel" className="pager-prev">
          <small>&larr; 調對決</small>
          <strong>Tone Duel</strong>
        </a>
        <a href="/zili-fang/chaizi" className="pager-next">
          <small>拆字 &rarr;</small>
          <strong>Character Deconstruction</strong>
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
