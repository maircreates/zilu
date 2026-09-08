'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Check, RefreshCw, RotateCcw, Volume2 } from 'lucide-react';

import type { GuidedStudyDeck } from '@/lib/study-session';

type Phase = 'intro' | 'active' | 'complete';

type StoredProgress = {
  v: 1;
  phase: Phase;
  queue: number[];
  mastered: number[];
  revisited: number[];
  startedAt: number;
};

const STORAGE_PREFIX = 'zilu:study:';

function storageKey(deckKey: string) {
  return `${STORAGE_PREFIX}${deckKey}`;
}

function isIndexList(value: unknown, cardCount: number): value is number[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => Number.isInteger(item) && item >= 0 && item < cardCount,
    )
  );
}

function loadProgress(
  deckKey: string,
  cardCount: number,
): StoredProgress | null {
  try {
    const raw = window.localStorage.getItem(storageKey(deckKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    if (parsed.v !== 1) return null;
    if (
      parsed.phase !== 'intro' &&
      parsed.phase !== 'active' &&
      parsed.phase !== 'complete'
    ) {
      return null;
    }
    if (
      !isIndexList(parsed.queue, cardCount) ||
      !isIndexList(parsed.mastered, cardCount) ||
      !isIndexList(parsed.revisited, cardCount)
    ) {
      return null;
    }
    // Every card must be either mastered or still queued while a run is active.
    if (
      parsed.phase === 'active' &&
      parsed.mastered.length + parsed.queue.length !== cardCount
    ) {
      return null;
    }
    if (parsed.phase === 'complete' && parsed.mastered.length !== cardCount) {
      return null;
    }
    return {
      v: 1,
      phase: parsed.phase,
      queue: parsed.queue,
      mastered: parsed.mastered,
      revisited: parsed.revisited,
      startedAt:
        typeof parsed.startedAt === 'number' ? parsed.startedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

function fullQueue(cardCount: number) {
  return Array.from({ length: cardCount }, (_, index) => index);
}

type StudySessionProps = {
  deck: GuidedStudyDeck;
  showPinyinFront: boolean;
  onShowPinyinFrontChange: (next: boolean) => void;
  onExit: () => void;
};

export function StudySession({
  deck,
  showPinyinFront,
  onShowPinyinFrontChange,
  onExit,
}: StudySessionProps) {
  const { key: deckKey, cards } = deck;
  const cardCount = cards.length;

  // This component only mounts client-side (after the learner opts in), so it is
  // safe to seed state from a saved run in the lazy initialiser.
  const [restored] = useState(() => loadProgress(deckKey, cardCount));
  const [phase, setPhase] = useState<Phase>(restored?.phase ?? 'intro');
  const [queue, setQueue] = useState<number[]>(
    restored?.queue ?? fullQueue(cardCount),
  );
  const [mastered, setMastered] = useState<number[]>(restored?.mastered ?? []);
  const [revisited, setRevisited] = useState<number[]>(
    restored?.revisited ?? [],
  );
  const [startedAt, setStartedAt] = useState(restored?.startedAt ?? 0);
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [soundStatus, setSoundStatus] = useState('');
  const [announcement, setAnnouncement] = useState('');

  // Persist the run after every change so progress survives a reload.
  useEffect(() => {
    const payload: StoredProgress = {
      v: 1,
      phase,
      queue,
      mastered,
      revisited,
      startedAt,
    };
    try {
      window.localStorage.setItem(storageKey(deckKey), JSON.stringify(payload));
    } catch {
      // Ignore write failures; the run still works in memory.
    }
  }, [deckKey, phase, queue, mastered, revisited, startedAt]);

  const currentIndex = queue[0] ?? 0;
  const card = cards[currentIndex];
  const masteredCount = mastered.length;
  const progressPercent =
    cardCount === 0 ? 0 : Math.round((masteredCount / cardCount) * 100);

  const begin = useCallback(() => {
    setPhase('active');
    setFlipped(false);
    setRevealed(false);
    setStartedAt((current) => current || Date.now());
    setAnnouncement(`Guided study started. Card 1 of ${cardCount}.`);
  }, [cardCount]);

  const flip = useCallback(() => {
    setFlipped((value) => !value);
    setRevealed(true);
  }, []);

  const settleNext = useCallback(
    (nextQueue: number[], nextMastered: number[], nextRevisited: number[]) => {
      setQueue(nextQueue);
      setMastered(nextMastered);
      setRevisited(nextRevisited);
      setFlipped(false);
      setRevealed(false);
      if (nextQueue.length === 0) {
        setPhase('complete');
        setAnnouncement(
          `Deck complete. All ${cardCount} cards are marked Got it.`,
        );
      } else {
        setAnnouncement(
          `${nextMastered.length} of ${cardCount} mastered. ${nextQueue.length} still to review.`,
        );
      }
    },
    [cardCount],
  );

  const markStillLearning = useCallback(() => {
    if (phase !== 'active' || queue.length === 0) return;
    const [head, ...rest] = queue;
    // Slot the card a couple of positions back so other cards come first.
    const reinsertAt = Math.min(rest.length, 2);
    const nextQueue = [
      ...rest.slice(0, reinsertAt),
      head,
      ...rest.slice(reinsertAt),
    ];
    const nextRevisited = revisited.includes(head)
      ? revisited
      : [...revisited, head];
    settleNext(nextQueue, mastered, nextRevisited);
  }, [phase, queue, revisited, mastered, settleNext]);

  const markGotIt = useCallback(() => {
    if (phase !== 'active' || queue.length === 0) return;
    const [head, ...rest] = queue;
    const nextMastered = mastered.includes(head)
      ? mastered
      : [...mastered, head];
    settleNext(rest, nextMastered, revisited);
  }, [phase, queue, mastered, revisited, settleNext]);

  const restart = useCallback(() => {
    setQueue(fullQueue(cardCount));
    setMastered([]);
    setRevisited([]);
    setFlipped(false);
    setRevealed(false);
    setStartedAt(Date.now());
    setPhase('active');
    setAnnouncement(`Deck restarted. Card 1 of ${cardCount}.`);
  }, [cardCount]);

  const playCurrentAudio = useCallback(() => {
    if (!card) return;
    if (!('speechSynthesis' in window)) {
      setSoundStatus('Audio is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.hanzi);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.78;
    utterance.onstart = () => setSoundStatus('Playing pronunciation');
    utterance.onend = () => setSoundStatus('');
    window.speechSynthesis.speak(utterance);
  }, [card]);

  // Keyboard shortcuts while a card is on screen.
  useEffect(() => {
    if (phase !== 'active') return;
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;
      const key = event.key.toLowerCase();
      if (key === 'f') {
        event.preventDefault();
        flip();
      } else if (key === 'h') {
        event.preventDefault();
        playCurrentAudio();
      } else if (key === '1' && revealed) {
        event.preventDefault();
        markStillLearning();
      } else if (key === '2' && revealed) {
        event.preventDefault();
        markGotIt();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, revealed, flip, playCurrentAudio, markStillLearning, markGotIt]);

  return (
    <section className="study-session" aria-labelledby="study-session-heading">
      <div className="study-session-bar">
        <div>
          <span className="eyebrow">Guided study</span>
          <h3 id="study-session-heading">
            {deck.deckLabel} · {deck.topic}{' '}
            <span lang="zh-Hant">{deck.topicChinese}</span>
          </h3>
          <small>
            {deck.pathwayLabel} · {deck.waypointLabel}
          </small>
        </div>
        <button type="button" className="study-exit" onClick={onExit}>
          Browse deck instead
        </button>
      </div>

      {phase === 'intro' && (
        <div className="study-intro">
          <p className="study-intro-lead">Before you start</p>
          <ul>
            {deck.intro.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <button type="button" className="study-primary" onClick={begin}>
            Begin studying <ArrowRight aria-hidden="true" />
          </button>
        </div>
      )}

      {phase === 'active' && card && (
        <div className="study-active">
          <div className="study-progress-row">
            <div className="study-progress" aria-hidden="true">
              <span
                className="study-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p>
              {masteredCount} of {cardCount} mastered
            </p>
          </div>

          <div className="card-stage">
            <button
              type="button"
              className={flipped ? 'flashcard flipped' : 'flashcard'}
              onClick={flip}
              aria-label={
                flipped
                  ? `Meaning: ${card.meaning}. Activate to show the Chinese.`
                  : `Chinese: ${card.hanzi}. Activate to show the meaning.`
              }
            >
              <span className="card-face card-front">
                <small>Traditional Chinese</small>
                <strong lang="zh-Hant">{card.hanzi}</strong>
                {showPinyinFront && <span>{card.pinyin}</span>}
                <em>Flip to reveal the meaning</em>
              </span>
              <span className="card-face card-back">
                <small>English meaning</small>
                <strong>{card.meaning}</strong>
                {!showPinyinFront && <span>{card.pinyin}</span>}
                <em>Flip back to the Chinese</em>
              </span>
            </button>
            <button
              type="button"
              className="sound-button"
              onClick={(event) => {
                event.stopPropagation();
                playCurrentAudio();
              }}
              aria-label={`Hear ${card.hanzi} pronounced`}
            >
              <Volume2 aria-hidden="true" />
              <span>Hear it</span>
            </button>
          </div>

          <div className="study-response">
            {!revealed && (
              <button type="button" className="study-flip" onClick={flip}>
                <RefreshCw aria-hidden="true" /> Flip the card
              </button>
            )}
            <div className="study-choices">
              <button
                type="button"
                className="study-choice still"
                onClick={markStillLearning}
                disabled={!revealed}
              >
                <RotateCcw aria-hidden="true" /> Still learning
              </button>
              <button
                type="button"
                className="study-choice got"
                onClick={markGotIt}
                disabled={!revealed}
              >
                <Check aria-hidden="true" /> Got it
              </button>
            </div>
          </div>

          <div className="study-meta">
            <label
              className="pinyin-toggle"
              aria-label="Show Pinyinciation on the front of each card"
            >
              <span>
                <strong>Pinyinciation</strong>
                <small>Show pinyin on the front</small>
              </span>
              <input
                type="checkbox"
                checked={showPinyinFront}
                onChange={(event) =>
                  onShowPinyinFrontChange(event.target.checked)
                }
              />
              <span className="toggle-track" aria-hidden="true">
                <span />
              </span>
            </label>
            <button type="button" className="study-restart" onClick={restart}>
              <RotateCcw aria-hidden="true" /> Restart deck
            </button>
          </div>

          <p className="study-hint">
            Keyboard: F flip · H hear it · 1 still learning · 2 got it
          </p>
          <p className="speech-status" aria-live="polite">
            {soundStatus}
          </p>
        </div>
      )}

      {phase === 'complete' && (
        <div className="study-complete">
          <div className="study-check">
            <Check aria-hidden="true" />
          </div>
          <p className="study-complete-label">Deck complete</p>
          <h4>You finished {deck.deckLabel}</h4>
          <p className="study-complete-topic">
            {deck.topic} <span lang="zh-Hant">{deck.topicChinese}</span>
          </p>
          <ul className="study-summary">
            <li>
              <strong>{cardCount}</strong> cards marked Got it
            </li>
            <li>
              <strong>{revisited.length}</strong>{' '}
              {revisited.length === 1
                ? 'card needed extra practice'
                : 'cards needed extra practice'}
            </li>
          </ul>
          <div className="study-complete-actions">
            <button type="button" className="study-primary" onClick={restart}>
              <RotateCcw aria-hidden="true" /> Study again
            </button>
            <button type="button" className="study-secondary" onClick={onExit}>
              Browse the deck
            </button>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
