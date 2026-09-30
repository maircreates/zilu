'use client';

import { useState } from 'react';
import { PenLine, Volume2 } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';
import { StrokePractice } from '@/components/stroke-practice';
import { CH201_CHARACTERS } from '@/lib/study-packs/ch201';
import { useStudyPackProgress } from '@/lib/study-packs/progress';

export function CharacterCollection() {
  const [writing, setWriting] = useState<(typeof CH201_CHARACTERS)[number] | null>(null);
  const { state } = useStudyPackProgress();
  const practiced = CH201_CHARACTERS.filter((item) => state.skills[`character:${item.character}|recognition`]).length;
  function hear(character: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(character);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.75;
    window.speechSynthesis.speak(utterance);
  }
  return (
    <ClassroomShell eyebrow="Current Class / Character Collection" title={<><span lang="zh-Hant">三十個常用字</span> 30 Useful Characters</>} description="A supplied study order—not a verified frequency ranking. Each character is taught through a useful combination." backHref="/classroom/ch201" backLabel="Chinese Class">
      <section className="character-collection-head"><div><strong>{practiced}</strong><span>of {CH201_CHARACTERS.length} practiced for recognition</span></div><a className="study-primary" href="/classroom/ch201/review?minutes=10&scope=characters">Practice recognition</a></section>
      <div className="character-collection-grid">
        {CH201_CHARACTERS.map((item, index) => <article key={item.id}><span className="character-order">{index + 1}</span><strong lang="zh-Hant">{item.character}</strong><span>{item.pinyin}</span><p>{item.use}</p><small lang="zh-Hant">{item.combination}</small><div><button type="button" onClick={() => hear(item.character)} aria-label={`Hear ${item.character}`}><Volume2 aria-hidden="true" /></button><button type="button" onClick={() => setWriting(item)} aria-label={`Practice writing ${item.character}`}><PenLine aria-hidden="true" /></button></div></article>)}
      </div>
      {writing && <StrokePractice key={writing.id} hanzi={writing.character} meaning={writing.use} onClose={() => setWriting(null)} />}
    </ClassroomShell>
  );
}
