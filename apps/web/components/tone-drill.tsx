'use client';

import { useCallback, useState } from 'react';
import { ArrowRight, Volume2 } from 'lucide-react';

import { TONE_DRILLS, type ToneDrillItem } from '@/lib/fundamentals';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function pickQuestion() {
  const set = TONE_DRILLS[Math.floor(Math.random() * TONE_DRILLS.length)];
  const target = set.items[Math.floor(Math.random() * set.items.length)];
  return { target, options: shuffle(set.items) };
}

export function ToneDrill() {
  const [question, setQuestion] = useState(() => pickQuestion());
  const [picked, setPicked] = useState<ToneDrillItem | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const speak = useCallback((hanzi: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hanzi);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  }, []);

  function choose(item: ToneDrillItem) {
    if (picked) return;
    setPicked(item);
    const isCorrect = item.hanzi === question.target.hanzi;
    setScore((current) => ({
      correct: current.correct + (isCorrect ? 1 : 0),
      total: current.total + 1,
    }));
  }

  function next() {
    setQuestion(pickQuestion());
    setPicked(null);
  }

  return (
    <div className="tone-drill">
      <div className="tone-drill-head">
        <div>
          <strong>Tone listening drill</strong>
          <span>Hear a syllable, pick the tone you heard.</span>
        </div>
        {score.total > 0 && (
          <span className="tone-drill-score">
            {score.correct} / {score.total}
          </span>
        )}
      </div>

      <button
        type="button"
        className="tone-drill-play"
        onClick={() => speak(question.target.hanzi)}
      >
        <Volume2 aria-hidden="true" /> Play the syllable
      </button>

      <div className="tone-drill-options">
        {question.options.map((item) => {
          const isTarget = item.hanzi === question.target.hanzi;
          const state = !picked
            ? ''
            : isTarget
              ? 'correct'
              : item.hanzi === picked.hanzi
                ? 'wrong'
                : '';
          return (
            <button
              key={item.hanzi}
              type="button"
              className={`tone-drill-option ${state}`.trim()}
              onClick={() => choose(item)}
              disabled={!!picked}
            >
              <span lang="zh-Hant">{item.hanzi}</span>
              <small>{item.pinyin}</small>
              {picked && <em>{item.meaning}</em>}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="tone-drill-feedback">
          <p>
            {picked.hanzi === question.target.hanzi
              ? 'Correct!'
              : `That was ${question.target.hanzi} (${question.target.pinyin}).`}
          </p>
          <button type="button" onClick={next}>
            Next <ArrowRight aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
