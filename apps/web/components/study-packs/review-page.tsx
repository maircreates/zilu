'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';
import { StudyPackSession } from './study-pack-session';
import {
  CH201_EXERCISES,
  CH201_EXERCISES_BY_ID,
  CH201_PACK,
} from '@/lib/study-packs/ch201';
import { saveStudySession, useStudyPackProgress } from '@/lib/study-packs/progress';
import { buildReviewExerciseIds, exerciseNeedsReview } from '@/lib/study-packs/review';
import type { SessionSnapshot, StudyExercise } from '@/lib/study-packs/types';

function validMinutes(value?: string): 5 | 10 | 20 | undefined {
  if (value === '5' || value === '10' || value === '20') return Number(value) as 5 | 10 | 20;
  return undefined;
}

export function ReviewPage({ minutes: rawMinutes, unitId, collectionId, scope, resume }: { minutes?: string; unitId?: string; collectionId?: string; scope?: string; resume?: boolean }) {
  const minutes = validMinutes(rawMinutes);
  const { state } = useStudyPackProgress();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<SessionSnapshot | null>(null);
  const context = unitId ?? collectionId ?? scope;

  const pool = useMemo(() => {
    if (scope === 'characters') return CH201_EXERCISES.filter((item) => item.targetKeys.some((key) => key.startsWith('character:')));
    if (scope === 'speaking') return CH201_EXERCISES.filter((item) => item.kind === 'speaking-recall');
    if (scope === 'mistakes') return CH201_EXERCISES.filter((item) => exerciseNeedsReview(item, state));
    return CH201_EXERCISES.filter((item) => !item.targetKeys.some((key) => key.startsWith('character:')));
  }, [scope, state]);

  useEffect(() => {
    // oxlint-disable-next-line react/react-compiler -- client readiness intentionally changes after hydration
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted || !minutes || session) return;
    const existing = state.sessions.ch201;
    if (resume && existing && existing.contentVersion === 1) {
      // oxlint-disable-next-line react/react-compiler -- restore the external browser session after hydration
      setSession(existing);
      return;
    }
    const collection = CH201_PACK.collections.find((item) => item.id === collectionId);
    const exerciseIds = buildReviewExerciseIds({ exercises: pool, state, targetMinutes: minutes, unitId, allowedVocabularyIds: collection?.vocabularyIds });
    const now = new Date().toISOString();
    const next: SessionSnapshot = { id: `ch201-review-${Date.now()}`, packId: 'ch201', contentVersion: 1, targetMinutes: minutes, unitId: context, exerciseIds, currentIndex: 0, answeredExerciseIds: [], startedAt: now, updatedAt: now };
    // oxlint-disable-next-line react/react-compiler -- create one persisted session after browser state is available
    setSession(next);
    saveStudySession(next);
  }, [collectionId, context, minutes, mounted, pool, resume, session, state, unitId]);

  if (!minutes) {
    return (
      <ClassroomShell eyebrow="Current Class / Quick Review" title="Quick Review" description="Choose a short session. ZiLu prioritizes weak, due, and unpracticed material without padding a small pool with endless repeats." backHref="/classroom/ch201" backLabel="Chinese Class">
        <section className="review-setup">
          <h2>How much time do you have?</h2>
          <div className="quick-review-options">{[5, 10, 20].map((value) => <a key={value} href={`?minutes=${value}`}><strong>{value}</strong><span>minutes</span></a>)}</div>
          <fieldset><legend>Optional topic filter</legend><a href="?minutes=5">All current material</a>{CH201_PACK.units.map((unit) => <a key={unit.id} href={`?minutes=5&unit=${unit.id}`}><span lang="zh-Hant">{unit.titleZh}</span> {unit.titleEn}</a>)}</fieldset>
        </section>
      </ClassroomShell>
    );
  }

  const exercises = session?.exerciseIds.map((id) => CH201_EXERCISES_BY_ID.get(id)).filter((item): item is StudyExercise => Boolean(item)) ?? [];
  return (
    <ClassroomShell eyebrow={`Current Class / ${minutes}-minute review`} title="Quick Review" description="Objective answers and self-assessed speaking recall are tracked separately." backHref="/classroom/ch201" backLabel="Chinese Class">
      {!mounted || !session ? <p className="class-empty">Preparing your review…</p> : exercises.length === 0 ? <div className="class-empty"><h2>No matching review items</h2><p>{scope === 'mistakes' ? 'Nothing currently needs review. Complete some practice first.' : 'This filter has no activities yet.'}</p><a className="study-primary" href="/classroom/ch201/review">Choose another review <ArrowRight aria-hidden="true" /></a></div> : <StudyPackSession title={`${minutes}-minute Quick Review`} exercises={exercises} sessionId={session.id} targetMinutes={minutes} unitId={session.unitId} initialIndex={session.currentIndex} initialAnswered={session.answeredExerciseIds} startedAt={session.startedAt} onExitHref="/classroom/ch201" />}
    </ClassroomShell>
  );
}
