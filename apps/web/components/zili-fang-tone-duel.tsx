'use client';

import { useCallback, useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';

import { TONE_PAIR_SETS, type TonePairItem } from '@/lib/zili-fang-tone-pairs';
import { DayNightToggle } from '@/components/day-night-toggle';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

const TONE_MARKS: Record<TonePairItem['tone'], string> = {
  1: 'ˉ',
  2: 'ˊ',
  3: 'ˇ',
  4: 'ˋ',
  5: '·',
};

type Round = {
  targetIndex: number;
  picked: number | null;
};

export function ZiliFangToneDuel() {
  const [setIndex, setSetIndex] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [status, setStatus] = useState('');

  const set = TONE_PAIR_SETS[setIndex];

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

  const startRound = useCallback(() => {
    const targetIndex = Math.floor(Math.random() * set.items.length);
    setRound({ targetIndex, picked: null });
    speak(set.items[targetIndex].hanzi);
  }, [set, speak]);

  function changeSet(nextIndex: number) {
    setSetIndex(nextIndex);
    setRound(null);
  }

  function pick(index: number) {
    if (!round || round.picked !== null) return;
    const correct = index === round.targetIndex;
    setRound({ ...round, picked: index });
    setScore((prev) => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
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
        <span className="eyebrow">
          調對決 · Set {setIndex + 1} / {TONE_PAIR_SETS.length}
        </span>
        <h1>Tone Duel</h1>
        <p>
          One syllable, said with every tone the book has a word for. Listen, then pick
          which one you heard -- the same test a wrong tone actually fails in real
          conversation.
        </p>
      </section>

      <section className="fundamentals-section">
        <div className="tone-duel-set">
          {set.items.map((item) => (
            <div key={item.hanzi} className="tone-duel-item">
              <button
                type="button"
                className="grammar-speak"
                onClick={() => speak(item.hanzi)}
                aria-label={`Hear ${item.hanzi} pronounced`}
              >
                <Volume2 aria-hidden="true" />
              </button>
              <span lang="zh-Hant" className="tone-duel-hanzi">
                {item.hanzi}
              </span>
              <span className="tone-duel-pinyin">
                {item.pinyin} <span className="tone-duel-mark">{TONE_MARKS[item.tone]}</span>
              </span>
              <span className="tone-duel-meaning">{item.meaning}</span>
            </div>
          ))}
        </div>

        {!round && (
          <button type="button" className="study-primary tone-duel-start" onClick={startRound}>
            Quiz me on this set
          </button>
        )}

        {round && (
          <div className="tone-duel-quiz">
            <div className="tone-duel-quiz-head">
              <p>Which one did you just hear?</p>
              <button
                type="button"
                className="grammar-speak"
                onClick={() => speak(set.items[round.targetIndex].hanzi)}
                aria-label="Play it again"
              >
                <Volume2 aria-hidden="true" />
              </button>
            </div>
            <div className="tone-duel-options">
              {set.items.map((item, index) => {
                const isTarget = index === round.targetIndex;
                const isPicked = index === round.picked;
                const revealed = round.picked !== null;
                let stateClass = '';
                if (revealed && isTarget) stateClass = 'is-correct';
                else if (revealed && isPicked) stateClass = 'is-wrong';
                return (
                  <button
                    key={item.hanzi}
                    type="button"
                    className={`tone-duel-option ${stateClass}`}
                    onClick={() => pick(index)}
                    disabled={revealed}
                    lang="zh-Hant"
                  >
                    {item.hanzi}
                  </button>
                );
              })}
            </div>
            {round.picked !== null && (
              <button type="button" className="study-primary tone-duel-start" onClick={startRound}>
                Next
              </button>
            )}
          </div>
        )}

        <p className="tone-duel-score">
          Score: {score.correct} / {score.total}
        </p>
      </section>

      <nav className="subpage-pager" aria-label="Set navigation">
        {setIndex > 0 ? (
          <button
            type="button"
            className="pager-prev"
            onClick={() => changeSet(setIndex - 1)}
          >
            <small>&larr; Previous</small>
            <strong>{TONE_PAIR_SETS[setIndex - 1].syllable}</strong>
          </button>
        ) : (
          <span />
        )}
        {setIndex < TONE_PAIR_SETS.length - 1 ? (
          <button
            type="button"
            className="pager-next"
            onClick={() => changeSet(setIndex + 1)}
          >
            <small>Next &rarr;</small>
            <strong>{TONE_PAIR_SETS[setIndex + 1].syllable}</strong>
          </button>
        ) : (
          <a href="/zili-fang" className="pager-next">
            <small>Done &rarr;</small>
            <strong>Back to 字力房</strong>
          </a>
        )}
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
