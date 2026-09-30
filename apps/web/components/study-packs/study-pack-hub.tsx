'use client';

import { ArrowRight, BookOpen, History, RotateCcw, Sparkles } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';
import { CH201_PACK } from '@/lib/study-packs/ch201';
import { resetStudyPackProgress, useStudyPackProgress } from '@/lib/study-packs/progress';

export function StudyPackHub() {
  const { state, persistenceAvailable } = useStudyPackProgress();
  const snapshot = state.sessions.ch201;
  const weakCount = Object.values(state.skills).filter((item) => item.lastResult === 'incorrect' || item.lastResult === 'again' || item.lastResult === 'assisted').length;
  const practicedCount = Object.keys(state.skills).length;
  function reset() {
    if (window.confirm('Reset Current Class progress and unfinished sessions on this browser? Other ZiLu progress will not be changed.')) resetStudyPackProgress('ch201');
  }
  return (
    <ClassroomShell eyebrow="Current Class / CH201 Learning" title={<><span lang="zh-Hant">中文課</span> Chinese Class</>} description={CH201_PACK.description} backHref="/classroom" backLabel="Current Class">
      {!persistenceAvailable && <output className="class-storage-warning">Browser storage is unavailable. You can still study, but progress may not survive a reload.</output>}

      <section className="classroom-dashboard">
        <div className="class-continue-card">
          <span className="eyebrow">Continue</span>
          <h2>{snapshot ? 'Resume your Quick Review' : 'Start a focused session'}</h2>
          <p>{snapshot ? `${snapshot.answeredExerciseIds.length} of ${snapshot.exerciseIds.length} activities completed.` : 'Choose a short review or begin with the latest supplied class material.'}</p>
          <a className="study-primary" href={snapshot ? `/classroom/ch201/review?minutes=${snapshot.targetMinutes}&resume=1` : '/classroom/ch201/units/restaurant'}>{snapshot ? 'Resume review' : 'Open recent material'} <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="class-progress-card">
          <span className="eyebrow">Progress on this browser</span>
          <strong>{practicedCount}</strong><span>item-and-skill pairs practiced</span>
          <a href="/classroom/ch201/mistakes">{weakCount} need review <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className="classroom-section" aria-labelledby="quick-review-heading">
        <div className="classroom-section-head"><div><span className="eyebrow">Quick Review</span><h2 id="quick-review-heading">How much time do you have?</h2></div><Sparkles aria-hidden="true" /></div>
        <div className="quick-review-options">
          {[5, 10, 20].map((minutes) => <a key={minutes} href={`/classroom/ch201/review?minutes=${minutes}`}><strong>{minutes}</strong><span>minutes</span></a>)}
        </div>
      </section>

      <section className="classroom-section exam-entry" aria-labelledby="exam-prep-heading">
        <div className="classroom-section-head"><div><span className="eyebrow">Catch up before you test</span><h2 id="exam-prep-heading">考試準備 · Exam Preparation</h2></div></div>
        <p>Behind in class? Start with short explanations and guided practice, then work toward the real test formats. Four CH201 review guides are ready.</p>
        <a className="study-primary" href="/classroom/ch201/tests">Open Tests <ArrowRight aria-hidden="true" /></a>
      </section>

      <section className="classroom-section exam-entry" aria-labelledby="bridge-heading">
        <div className="classroom-section-head"><div><span className="eyebrow">Need to rebuild the basics?</span><h2 id="bridge-heading">從零開始 · Zero-to-CH201 Bridge</h2></div></div>
        <p>Five short lessons on pinyin awareness, word order, core words, and safe first recall—before the CH201 review material.</p>
        <a className="study-primary" href="/classroom/ch201/bridge">Open the beginner bridge <ArrowRight aria-hidden="true" /></a>
      </section>

      <section className="classroom-section" aria-labelledby="recent-heading">
        <div className="classroom-section-head"><div><span className="eyebrow">Recent supplied material</span><h2 id="recent-heading">Week 3</h2></div><History aria-hidden="true" /></div>
        <p className="classroom-section-note">No encounter dates were supplied, so this reflects the latest labeled collection—not fabricated activity history.</p>
        <div className="class-recent-links"><a href="/classroom/ch201/units/dorm-life">宿舍生活 · Dorm Life</a><a href="/classroom/ch201/units/restaurant">在飯館兒 · At a Restaurant</a></div>
      </section>

      <section className="classroom-section" aria-labelledby="units-heading">
        <div className="classroom-section-head"><div><span className="eyebrow">Topic units</span><h2 id="units-heading">Study by class topic</h2></div><BookOpen aria-hidden="true" /></div>
        <div className="class-unit-grid">
          {CH201_PACK.units.map((unit, index) => <a href={`/classroom/ch201/units/${unit.id}`} key={unit.id}><span className="hub-card-num">0{index + 1}</span><h3 lang="zh-Hant">{unit.titleZh}</h3><strong>{unit.titleEn}</strong><p>{unit.summary}</p><small>{unit.vocabularyIds.length} class words · {unit.exerciseIds.length} activities</small></a>)}
        </div>
      </section>

      <section className="classroom-section" aria-labelledby="collections-heading">
        <div className="classroom-section-head"><div><span className="eyebrow">Collections</span><h2 id="collections-heading">Study another way</h2></div></div>
        <div className="class-collection-grid">
          {CH201_PACK.collections.filter((item) => item.vocabularyIds).map((collection) => <a key={collection.id} href={`/classroom/ch201/review?minutes=5&collection=${collection.id}`}><h3>{collection.title}</h3><span lang="zh-Hant">{collection.titleZh}</span><p>{collection.description}</p><small>{collection.vocabularyIds?.length} unique words</small></a>)}
          <a href="/classroom/ch201/review?minutes=10&scope=speaking"><h3>Speaking Practice</h3><span lang="zh-Hant">口語練習</span><p>Answer eight short prompts, then compare with a model.</p><small>Self-assessed recall</small></a>
          <a href="/classroom/ch201/characters"><h3>30 Useful Characters</h3><span lang="zh-Hant">三十個常用字</span><p>Learn the supplied study order through useful combinations.</p><small>No unverified frequency ranking</small></a>
        </div>
      </section>

      <section className="classroom-section class-review-status">
        <div><span className="eyebrow">Needs Review</span><h2>{weakCount === 0 ? 'Nothing is waiting yet' : `${weakCount} skill ${weakCount === 1 ? 'item needs' : 'items need'} attention`}</h2><p>{weakCount === 0 ? 'Complete a quiz, sentence, flashcard, or speaking prompt. Items you miss or mark as difficult will appear here.' : 'Objective errors and self-assessed weak responses stay distinct in your history.'}</p></div>
        {weakCount > 0 && <a className="study-primary" href="/classroom/ch201/mistakes">Review now <ArrowRight aria-hidden="true" /></a>}
      </section>

      <section className="classroom-reset"><button type="button" onClick={reset}><RotateCcw aria-hidden="true" /> Reset Current Class progress</button><p>This does not erase pathway or settings data.</p></section>
    </ClassroomShell>
  );
}
