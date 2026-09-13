'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Moon, PenLine, Shuffle, Sparkles, Sun, Volume2 } from 'lucide-react';

import { pathways } from '@/lib/pathways';
import { findGuidedStudyDeck } from '@/lib/study-session';
import { useMirrorPreference } from '@/lib/use-mirror';
import { usePinyinciationPreference } from '@/lib/use-pinyinciation';
import { useTheme } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';
import { SettingsTrigger } from '@/components/settings-trigger';
import { StrokePractice } from '@/components/stroke-practice';
import { StudySession } from '@/components/study-session';

type ExplorerPosition = {
  pathwayIndex: number;
  waypointIndex: number;
  deckIndex: number;
  cardIndex: number;
};

function shuffledIndices(length: number) {
  const result = Array.from({ length }, (_, index) => index);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function FlashcardExplorer({
  initialGuided = false,
  initialPosition,
}: {
  initialGuided?: boolean;
  initialPosition?: ExplorerPosition;
}) {
  const [pathwayIndex, setPathwayIndex] = useState(initialPosition?.pathwayIndex ?? 0);
  const [waypointIndex, setWaypointIndex] = useState(initialPosition?.waypointIndex ?? 0);
  const [deckIndex, setDeckIndex] = useState(initialPosition?.deckIndex ?? 0);
  const [cardIndex, setCardIndex] = useState(initialPosition?.cardIndex ?? 0);
  const [order, setOrder] = useState<number[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [showPinyinFront, setShowPinyinFront] = usePinyinciationPreference();
  const [mirror, setMirror] = useMirrorPreference();
  const [darkMode, setDarkMode] = useTheme();
  const [soundStatus, setSoundStatus] = useState('');
  const [practiceOpen, setPracticeOpen] = useState(false);
  // A "?guided=1" link (used by the home page callout) opens the guided study
  // session immediately, on top of the default Pathway 01 / Waypoint 01 / Deck A
  // selection this explorer already starts on.
  const [guidedActive, setGuidedActive] = useState(initialGuided);

  // A stale deep link (?pi=…) could point past the end of the data; fall back
  // to the first entry at each level rather than crashing.
  const pathway = pathways[pathwayIndex] ?? pathways[0];
  const waypoint = pathway.waypoints[waypointIndex] ?? pathway.waypoints[0];
  const deck = waypoint.decks[deckIndex] ?? waypoint.decks[0];
  const guidedDeck = findGuidedStudyDeck(pathway.number, waypoint.number, deck.id);
  const activeOrder = order.length === deck.cards.length ? order : deck.cards.map((_, index) => index);
  const card = deck.cards[activeOrder[cardIndex] ?? 0];

  const totalCards = useMemo(
    () => pathways.reduce((grandTotal, path) => grandTotal + path.waypoints.reduce((total, stop) => total + stop.decks.reduce((sum, item) => sum + item.cards.length, 0), 0), 0),
    [],
  );

  function resetPathway(nextPathway: number) {
    setPathwayIndex(nextPathway);
    setWaypointIndex(0);
    setDeckIndex(0);
    setCardIndex(0);
    setOrder([]);
    setFlipped(false);
    setSoundStatus('');
    setGuidedActive(false);
    setPracticeOpen(false);
  }

  function resetDeck(nextWaypoint: number, nextDeck: number) {
    setWaypointIndex(nextWaypoint);
    setDeckIndex(nextDeck);
    setCardIndex(0);
    setOrder([]);
    setFlipped(false);
    setSoundStatus('');
    setGuidedActive(false);
    setPracticeOpen(false);
  }

  function move(direction: -1 | 1) {
    setCardIndex((current) => (current + direction + deck.cards.length) % deck.cards.length);
    setFlipped(false);
    setSoundStatus('');
    setPracticeOpen(false);
  }

  function shuffle() {
    setOrder(shuffledIndices(deck.cards.length));
    setCardIndex(0);
    setFlipped(false);
    setSoundStatus('Deck shuffled');
    setPracticeOpen(false);
  }

  function speak(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
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
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (guidedActive) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, button, select, textarea')) return;
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true"><span /><span /><span /></div>
      <header className="topbar">
        <a className="brand" href="/" aria-label="ZiLu home">
          <span className="brand-mark">字</span>
          <span><strong>ZiLu</strong><small>Your path into Chinese</small></span>
        </a>
        <nav className="topbar-nav" aria-label="Primary">
          <a href="/fundamentals">Fundamentals</a>
          <a href="/grammar">Grammar</a>
          <a href="/study" aria-current="page">Study</a>
          <SearchTrigger />
          <SettingsTrigger />
        </nav>
        <div className="path-label"><span>Pathway</span><strong>{pathway.name}</strong><small>{pathway.chinese}</small></div>
      </header>

      <div className="workspace" id="study">
        <aside className="waypoint-panel" aria-label="Waypoints">
          <fieldset className="pathway-switcher">
            <legend className="sr-only">Choose a Pathway</legend>
            {pathways.map((item, index) => (
              <button key={item.id} type="button" className={pathwayIndex === index ? 'active' : ''} onClick={() => resetPathway(index)}>
                <small>Pathway</small>{String(item.number).padStart(2, '0')}
              </button>
            ))}
          </fieldset>
          <div className="panel-heading">
            <span className="eyebrow">Pathway {String(pathway.number).padStart(2, '0')}</span>
            <h1>{pathway.name}</h1>
            <p>{pathway.description}</p>
          </div>
          <nav className="waypoint-list">
            {pathway.waypoints.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === waypointIndex ? 'waypoint active' : 'waypoint'}
                onClick={() => resetDeck(index, 0)}
                aria-current={index === waypointIndex ? 'step' : undefined}
              >
                <span>{String(item.number).padStart(2, '0')}</span>
                <span><strong>{item.name}</strong><small>{item.chinese}</small></span>
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </nav>
        </aside>

        <section className="study-panel" aria-labelledby="waypoint-title">
          <div className="study-heading">
            <div>
              <span className="eyebrow">Waypoint {String(waypoint.number).padStart(2, '0')}</span>
              <h2 id="waypoint-title">{waypoint.name} <span>{waypoint.chinese}</span></h2>
            </div>
            <fieldset className="deck-tabs">
              <legend className="sr-only">Choose a deck</legend>
              {waypoint.decks.map((item, index) => (
                <button key={item.id} type="button" className={deckIndex === index ? 'active' : ''} onClick={() => resetDeck(waypointIndex, index)}>
                  {item.name}<small>{item.cards.length} cards</small>
                </button>
              ))}
            </fieldset>
          </div>

          {guidedActive && guidedDeck ? (
            <StudySession
              deck={guidedDeck}
              showPinyinFront={showPinyinFront}
              onShowPinyinFrontChange={setShowPinyinFront}
              onExit={() => setGuidedActive(false)}
            />
          ) : (
            <>
              <div className="study-toolbar">
                <div className="study-toggles">
                  <label className="pinyin-toggle" aria-label="Show Pinyinciation on the front of each card">
                    <span><strong>Pinyinciation</strong><small>Show pinyin on the front</small></span>
                    <input type="checkbox" checked={showPinyinFront} onChange={(event) => setShowPinyinFront(event.target.checked)} />
                    <span className="toggle-track" aria-hidden="true"><span /></span>
                  </label>
                  <label className="pinyin-toggle" aria-label="Mirror: show the English meaning first and recall the Chinese">
                    <span><strong>Mirror</strong><small>Meaning first, recall the Chinese</small></span>
                    <input type="checkbox" checked={mirror} onChange={(event) => { setMirror(event.target.checked); setFlipped(false); setSoundStatus(''); }} />
                    <span className="toggle-track" aria-hidden="true"><span /></span>
                  </label>
                </div>
                <button type="button" className="shuffle-button" onClick={shuffle}><Shuffle aria-hidden="true" /> Shuffle</button>
              </div>

              {guidedDeck && (
                <div className="guided-invite">
                  <div>
                    <strong>Guided study session</strong>
                    <span>Work through {guidedDeck.deckLabel} one card at a time, with a beginner-friendly loop that repeats what you miss.</span>
                  </div>
                  <button type="button" onClick={() => setGuidedActive(true)}>
                    <Sparkles aria-hidden="true" /> Start
                  </button>
                </div>
              )}

              <div className="card-stage">
                <button
                  type="button"
                  className={`flashcard${flipped ? ' flipped' : ''}${mirror ? ' mirrored' : ''}`}
                  onClick={() => setFlipped((value) => !value)}
                  aria-label={
                    flipped
                      ? mirror
                        ? `Showing ${card.hanzi}. Flip back to the English meaning.`
                        : `Showing meaning: ${card.meaning}. Flip back to the Chinese.`
                      : mirror
                        ? `Showing meaning: ${card.meaning}. Flip to the Chinese.`
                        : `Showing ${card.hanzi}. Flip to the English meaning.`
                  }
                >
                  <span className="card-face card-front">
                    <small>{mirror ? 'English meaning' : 'Traditional Chinese'}</small>
                    {mirror ? <strong>{card.meaning}</strong> : <strong lang="zh-Hant">{card.hanzi}</strong>}
                    {showPinyinFront && <span>{card.pinyin}</span>}
                    <em>{mirror ? 'Tap to reveal the Chinese' : 'Tap to reveal meaning'}</em>
                  </span>
                  <span className="card-face card-back">
                    <small>{mirror ? 'Traditional Chinese' : 'English meaning'}</small>
                    {mirror ? <strong lang="zh-Hant">{card.hanzi}</strong> : <strong>{card.meaning}</strong>}
                    {!showPinyinFront && <span>{card.pinyin}</span>}
                    <em>{mirror ? 'Tap to see the meaning' : 'Tap to see the Chinese'}</em>
                  </span>
                </button>
                <button type="button" className="sound-button" onClick={speak} aria-label={`Hear ${card.hanzi} pronounced`}>
                  <Volume2 aria-hidden="true" /><span>Hear it</span>
                </button>
                <button type="button" className="practice-button" onClick={() => setPracticeOpen(true)} aria-label={`Practice writing ${card.hanzi}`}>
                  <PenLine aria-hidden="true" /><span>Practice writing</span>
                </button>
              </div>

              {practiceOpen && (
                <StrokePractice
                  hanzi={card.hanzi}
                  meaning={card.meaning}
                  onClose={() => setPracticeOpen(false)}
                />
              )}

              <div className="card-controls">
                <button type="button" onClick={() => move(-1)} aria-label="Previous card"><ArrowLeft aria-hidden="true" /><span>Previous</span></button>
                <div><strong>{cardIndex + 1}</strong><span>/</span><span>{deck.cards.length}</span><small>{soundStatus || `${deck.name} · ${waypoint.name}`}</small></div>
                <button type="button" onClick={() => move(1)} aria-label="Next card"><span>Next</span><ArrowRight aria-hidden="true" /></button>
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="footer">
        <p><Check aria-hidden="true" /> {totalCards} cards · Learner-facing Chinese is always Traditional Chinese.</p>
        <label className="theme-control" aria-label="Choose light or dark appearance">
          <Sun aria-hidden="true" /><span>Solarpunk</span>
          <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} aria-label="Use Cyberpunk dark mode" />
          <span className="toggle-track" aria-hidden="true"><span /></span>
          <Moon aria-hidden="true" /><span>Cyberpunk</span>
        </label>
      </footer>
    </main>
  );
}
