'use client';

import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

import { ClassFlashcards } from './class-flashcards';
import { ClassroomShell } from './classroom-shell';
import { StudyPackSession } from './study-pack-session';
import {
  CH201_EXAMPLES_BY_ID,
  CH201_EXERCISES_BY_ID,
  CH201_GRAMMAR_BY_ID,
  getCh201Unit,
  vocabularyForIds,
} from '@/lib/study-packs/ch201';
import { useStudyPackProgress } from '@/lib/study-packs/progress';

type UnitMode = 'learn' | 'flashcards' | 'sentences' | 'speak' | 'quiz';

export function StudyUnitPage({ unitId, mode }: { unitId: string; mode?: string }) {
  const unit = getCh201Unit(unitId);
  const { state } = useStudyPackProgress();
  const [sessionId] = useState(() => `unit-${unitId}-${Date.now()}`);
  if (!unit) return <ClassroomShell eyebrow="Current Class" title="Unit not found" description="This class unit does not exist." backHref="/classroom/ch201"><p className="class-empty">Return to Chinese Class and choose one of the available units.</p></ClassroomShell>;
  const vocabulary = vocabularyForIds(unit.vocabularyIds);
  const exercises = unit.exerciseIds.map((id) => CH201_EXERCISES_BY_ID.get(id)).filter(Boolean);
  const activeMode = ['learn', 'flashcards', 'sentences', 'speak', 'quiz'].includes(mode ?? '') ? mode as UnitMode : undefined;
  const filtered = activeMode === 'sentences' ? exercises.filter((item) => item?.kind === 'sentence-order') : activeMode === 'speak' ? exercises.filter((item) => item?.kind === 'speaking-recall') : activeMode === 'quiz' ? exercises.filter((item) => item?.kind === 'choice') : exercises;
  const practiced = Object.values(state.skills).filter((progress) => unit.vocabularyIds.some((id) => progress.itemKey === `vocabulary:${id}`) || unit.grammarIds.some((id) => progress.itemKey === `grammar:${id}`)).length;

  return (
    <ClassroomShell eyebrow={`Current Class / ${unit.titlePinyin}`} title={<><span lang="zh-Hant">{unit.titleZh}</span> {unit.titleEn}</>} description={unit.summary} backHref="/classroom/ch201" backLabel="Chinese Class">
      {activeMode === 'flashcards' ? <ClassFlashcards cards={vocabulary} unitId={unit.id} /> : activeMode ? (
        <StudyPackSession title={`${unit.titleEn} · ${activeMode === 'learn' ? 'Guided learning' : activeMode}`} exercises={filtered.filter((item): item is NonNullable<typeof item> => Boolean(item))} sessionId={sessionId} unitId={unit.id} onExitHref={`/classroom/ch201/units/${unit.id}`} />
      ) : (
        <>
          <section className="class-unit-intro">
            <div><span className="eyebrow">What you will practice</span><ul>{unit.learningGoals.map((goal) => <li key={goal}><Check aria-hidden="true" /> {goal}</li>)}</ul></div>
            <div className="class-unit-progress"><strong>{practiced}</strong><span>item-and-skill pairs practiced</span><small>Unattempted skills remain Not Practiced.</small></div>
          </section>
          <a className="study-primary class-start-learning" href={`?mode=learn`}>Start Learning <ArrowRight aria-hidden="true" /></a>
          <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Practice modes</span><h2>Choose a focus</h2></div></div><div className="class-mode-grid">
            <a href="?mode=flashcards"><strong>Flashcards</strong><span>{vocabulary.length} canonical words</span></a>
            <a href="?mode=sentences"><strong>Build Sentences</strong><span>{exercises.filter((item) => item?.kind === 'sentence-order').length} activities</span></a>
            <a href="?mode=speak"><strong>Speak</strong><span>{exercises.filter((item) => item?.kind === 'speaking-recall').length} prompts</span></a>
            <a href="?mode=quiz"><strong>Quick Quiz</strong><span>{exercises.filter((item) => item?.kind === 'choice').length} checks</span></a>
          </div></section>
          <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Class vocabulary</span><h2>{vocabulary.length} resolved words</h2></div></div><div className="class-vocabulary-list">{vocabulary.map((item) => <a key={item.id} href={`/study?pi=2&wi=${item.waypointNumber - 1}&di=${item.deckId === 'a' ? 0 : 1}&ci=${item.cardIndex}`}><strong lang="zh-Hant">{item.hanzi}</strong><span>{item.pinyin}</span><small>{item.meaning}</small></a>)}</div></section>
          <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Useful patterns</span><h2>Grammar in this unit</h2></div></div><div className="class-grammar-list">{unit.grammarIds.map((id) => { const pattern = CH201_GRAMMAR_BY_ID.get(id); if (!pattern) return null; return <article key={id}><h3>{pattern.title}</h3><code>{pattern.pattern}</code><p>{pattern.explanation}</p>{pattern.exampleIds.slice(0, 1).map((exampleId) => { const example = CH201_EXAMPLES_BY_ID.get(exampleId); return example ? <div className="class-example" key={example.id}><strong lang="zh-Hant">{example.traditional}</strong><span>{example.pinyin}</span><small>{example.english}</small></div> : null; })}{pattern.canonicalGrammarHref && <a href={pattern.canonicalGrammarHref}>Open related Grammar reference <ArrowRight aria-hidden="true" /></a>}</article>; })}</div></section>
        </>
      )}
    </ClassroomShell>
  );
}
