'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';

import { pathways, type Flashcard } from '@/lib/pathways';
import { useLazyStreak } from '@/lib/use-lazy-streak';
import { DayNightToggle } from '@/components/day-night-toggle';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

const ROUND_SIZE = 5;

const ALL_CARDS: Flashcard[] = pathways.flatMap((pathway) =>
  pathway.waypoints.flatMap((waypoint) => waypoint.decks.flatMap((deck) => deck.cards)),
);

function pickRound(): Flashcard[] {
  const pool = [...ALL_CARDS];
  const picked: Flashcard[] = [];
  for (let i = 0; i < ROUND_SIZE && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool[index]);
    pool.splice(index, 1);
  }
  return picked;
}

export function ZiliFangLazyMode() {
  const { count, completedToday, completeToday } = useLazyStreak();
  const [round, setRound] = useState<Flashcard[] | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState('');

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

  // Speak each new card as soon as it's on screen -- Lazy Mode is
  // audio-first by design, so hearing it shouldn't require a tap. Nested in
  // rAF (matching CyberpunkBoot/TaopunkIntro) since the react-compiler
  // linter flags an impure/setState-capable call made directly as a
  // top-level effect-body statement.
  useEffect(() => {
    if (!round) return;
    const card = round[cardIndex];
    if (!card) return;
    const id = requestAnimationFrame(() => speak(card.hanzi));
    return () => cancelAnimationFrame(id);
  }, [round, cardIndex, speak]);

  function start() {
    setRound(pickRound());
    setCardIndex(0);
    setRevealed(false);
  }

  function next() {
    if (!round) return;
    if (cardIndex + 1 >= round.length) {
      completeToday();
      setRound(null);
      return;
    }
    setCardIndex((i) => i + 1);
    setRevealed(false);
  }

  const card = round?.[cardIndex];

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
        <span className="eyebrow">懶人模式</span>
        <h1>Lazy Mode</h1>
        <p>
          Five cards, out loud, once a day -- deliberately too small to argue with. Say
          each word before you check it; production is what makes a tone stick, not
          recognition.
        </p>
      </section>

      <section className="fundamentals-section">
        <div className="lazy-mode-streak">
          <strong>{count}</strong>
          <span>day{count === 1 ? '' : 's'} in a row</span>
          {completedToday && <small>Already done today -- come back tomorrow.</small>}
        </div>

        {!round && (
          <button
            type="button"
            className="study-primary lazy-mode-start"
            onClick={start}
            disabled={completedToday}
          >
            {completedToday ? "Today's five are done" : "Start today's five"}
          </button>
        )}

        {round && card && (
          <div className="lazy-mode-card">
            <p className="lazy-mode-progress">
              Card {cardIndex + 1} / {round.length}
            </p>
            <div className="lazy-mode-hanzi-row">
              <span lang="zh-Hant" className="lazy-mode-hanzi">
                {card.hanzi}
              </span>
              <button
                type="button"
                className="grammar-speak"
                onClick={() => speak(card.hanzi)}
                aria-label={`Hear ${card.hanzi} pronounced`}
              >
                <Volume2 aria-hidden="true" />
              </button>
            </div>

            {revealed ? (
              <>
                <p className="lazy-mode-pinyin">{card.pinyin}</p>
                <p className="lazy-mode-meaning">{card.meaning}</p>
                <button type="button" className="study-primary" onClick={next}>
                  Next
                </button>
              </>
            ) : (
              <button type="button" className="study-primary" onClick={() => setRevealed(true)}>
                Say it out loud, then reveal
              </button>
            )}
          </div>
        )}
      </section>

      <nav className="subpage-pager" aria-label="Zi Li Fang navigation">
        <a href="/zili-fang/chaizi" className="pager-prev">
          <small>&larr; 拆字</small>
          <strong>Character Deconstruction</strong>
        </a>
        <a href="/zili-fang" className="pager-next">
          <small>Done &rarr;</small>
          <strong>Back to 字力房</strong>
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
