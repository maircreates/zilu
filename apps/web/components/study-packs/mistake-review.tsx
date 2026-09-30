'use client';

import { ArrowRight } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';
import { CH201_EXERCISES } from '@/lib/study-packs/ch201';
import { useStudyPackProgress } from '@/lib/study-packs/progress';
import { exerciseNeedsReview } from '@/lib/study-packs/review';

const TAG_LABELS: Record<string, string> = {
  'place-before-action': 'Place before action',
  'place-you': 'Location before 有',
  'want-order': 'Ordering with a measure word',
  'experience-guo': 'Experience with 過',
  'vocabulary-meaning': 'Vocabulary meaning',
  'character-recognition': 'Character recognition',
  'speaking-recall': 'Speaking recall',
};

export function MistakeReview() {
  const { state } = useStudyPackProgress();
  const exercises = CH201_EXERCISES.filter((item) => exerciseNeedsReview(item, state));
  const objective = exercises.filter((item) => Object.values(state.skills).some((progress) => progress.skill === item.skill && item.targetKeys.includes(progress.itemKey) && progress.lastResult === 'incorrect'));
  const selfRated = exercises.filter((item) => !objective.includes(item));
  return (
    <ClassroomShell eyebrow="Current Class / Needs Review" title="Needs Review" description="Objective errors and self-assessed weak responses are shown separately, so the app never turns a self-rating into a test score." backHref="/classroom/ch201" backLabel="Chinese Class">
      {exercises.length === 0 ? <div className="class-empty"><h2>Nothing is waiting yet</h2><p>Items appear here after a wrong answer, “Again,” or “Needed help.”</p><a className="study-primary" href="/classroom/ch201/review?minutes=5">Start a Quick Review <ArrowRight aria-hidden="true" /></a></div> : <>
        <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Objective checks</span><h2>{objective.length} to revisit</h2></div></div><div className="mistake-list">{objective.length === 0 ? <p>No objective errors are waiting.</p> : objective.map((item) => <article key={item.id}><span>{TAG_LABELS[item.mistakeTag ?? ''] ?? 'Review'}</span><h3>{item.title}</h3><p>{item.explanation}</p></article>)}</div></section>
        <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Self-assessed recall</span><h2>{selfRated.length} to practice</h2></div></div><div className="mistake-list">{selfRated.length === 0 ? <p>No self-rated weak responses are waiting.</p> : selfRated.map((item) => <article key={item.id}><span>{TAG_LABELS[item.mistakeTag ?? ''] ?? 'Review'}</span><h3>{item.title}</h3><p>{item.explanation}</p></article>)}</div></section>
        <a className="study-primary" href="/classroom/ch201/review?minutes=10&scope=mistakes">Retry these items <ArrowRight aria-hidden="true" /></a>
      </>}
    </ClassroomShell>
  );
}
