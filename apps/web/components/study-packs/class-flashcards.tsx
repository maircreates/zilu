'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, Volume2 } from 'lucide-react';

import { useMirrorPreference } from '@/lib/use-mirror';
import { usePinyinciationPreference } from '@/lib/use-pinyinciation';
import { makeAttemptId, recordStudyAttempt } from '@/lib/study-packs/progress';
import type { CanonicalVocabulary } from '@/lib/study-packs/types';

function shuffled(length: number) {
  const values = Array.from({ length }, (_, index) => index);
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [values[index], values[swap]] = [values[swap], values[index]];
  }
  return values;
}

export function ClassFlashcards({ cards, unitId }: { cards: CanonicalVocabulary[]; unitId: string }) {
  const [sessionId] = useState(() => `class-flashcards-${unitId}-${Date.now()}`);
  const [order, setOrder] = useState(() => cards.map((_, index) => index));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showPinyinFront, setShowPinyinFront] = usePinyinciationPreference();
  const [mirror, setMirror] = useMirrorPreference();
  const [rated, setRated] = useState(false);
  const card = cards[order[index]];
  if (!card) return <p className="class-empty">No vocabulary is available for this unit.</p>;
  function move(amount: number) {
    setIndex((current) => (current + amount + cards.length) % cards.length);
    setFlipped(false);
    setRated(false);
  }
  function rate(result: 'again' | 'assisted' | 'independent') {
    if (rated) return;
    setRated(true);
    recordStudyAttempt({ id: makeAttemptId(sessionId, `${card.id}-${index}`), packId: 'ch201', unitId, exerciseId: `flashcard-${card.id}`, itemKeys: [`vocabulary:${card.id}`], skill: 'recognition', result });
  }
  function hear() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.hanzi);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }
  return (
    <section className="class-flashcards">
      <div className="study-toggles">
        <label className="pinyin-toggle" aria-label="Show pinyin on the front"><span><strong>Pinyinciation</strong><small>Show pinyin first</small></span><input type="checkbox" checked={showPinyinFront} onChange={(event) => setShowPinyinFront(event.target.checked)} /><span className="toggle-track" aria-hidden="true"><span /></span></label>
        <label className="pinyin-toggle" aria-label="Show English meaning first"><span><strong>Mirror</strong><small>Meaning first</small></span><input type="checkbox" checked={mirror} onChange={(event) => { setMirror(event.target.checked); setFlipped(false); }} /><span className="toggle-track" aria-hidden="true"><span /></span></label>
      </div>
      <div className="class-card-count">Card {index + 1} of {cards.length}</div>
      <button type="button" className={`class-flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((value) => !value)}>
        {!flipped ? (
          <><small>{mirror ? 'English meaning' : 'Traditional Chinese'}</small><strong lang={mirror ? 'en' : 'zh-Hant'}>{mirror ? card.meaning : card.hanzi}</strong>{showPinyinFront && <span>{card.pinyin}</span>}<em>Tap to reveal</em></>
        ) : (
          <><small>{mirror ? 'Traditional Chinese' : 'English meaning'}</small><strong lang={mirror ? 'zh-Hant' : 'en'}>{mirror ? card.hanzi : card.meaning}</strong>{!showPinyinFront && <span>{card.pinyin}</span>}<em>Tap to hide</em></>
        )}
      </button>
      <button type="button" className="class-hear" onClick={hear}><Volume2 aria-hidden="true" /> Hear it</button>
      {flipped && !rated && <div className="class-rating"><button type="button" onClick={() => rate('again')}>Again</button><button type="button" onClick={() => rate('assisted')}>Getting there</button><button type="button" onClick={() => rate('independent')}>Got it</button></div>}
      {rated && <output className="class-recorded">Practice recorded.</output>}
      <div className="class-card-controls">
        <button type="button" onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /> Previous</button>
        <button type="button" onClick={() => { setOrder(shuffled(cards.length)); setIndex(0); setFlipped(false); setRated(false); }}><Shuffle aria-hidden="true" /> Shuffle</button>
        <button type="button" onClick={() => move(1)}>Next <ArrowRight aria-hidden="true" /></button>
      </div>
    </section>
  );
}
