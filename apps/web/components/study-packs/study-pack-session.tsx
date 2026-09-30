'use client';

import { useCallback, useMemo, useState } from 'react';
import { ArrowRight, Check, RotateCcw, Volume2 } from 'lucide-react';

import { useEnglishPreference } from '@/lib/use-english';
import { usePinyinciationPreference } from '@/lib/use-pinyinciation';
import {
  CH201_EXAMPLES_BY_ID,
  CH201_SPEAKING_BY_ID,
} from '@/lib/study-packs/ch201';
import {
  clearStudySession,
  makeAttemptId,
  recordStudyAttempt,
  saveStudySession,
  useStudyPackProgress,
} from '@/lib/study-packs/progress';
import type {
  AttemptResult,
  ChoiceExercise,
  SentenceOrderExercise,
  SessionSnapshot,
  SpeakingExercise,
  StudyExercise,
} from '@/lib/study-packs/types';

function hash(value: string) {
  // oxlint-disable-next-line typescript/no-misused-spread -- IDs contain only simple ASCII characters
  return [...value].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
}

function stableOptions(exercise: ChoiceExercise) {
  return [...exercise.options].sort((a, b) => hash(`${exercise.id}:${a.id}`) - hash(`${exercise.id}:${b.id}`));
}

function speak(text: string, onStatus: (message: string) => void) {
  if (!('speechSynthesis' in window)) {
    onStatus('Audio is not available in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 0.78;
  utterance.onstart = () => onStatus('Playing pronunciation');
  utterance.onend = () => onStatus('');
  window.speechSynthesis.speak(utterance);
}

function ChoiceActivity({ exercise, onResult }: { exercise: ChoiceExercise; onResult: (result: AttemptResult) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selected ? exercise.correctOptionIds.includes(selected) : false;
  function submit() {
    if (!selected || submitted) return;
    setSubmitted(true);
    onResult(correct ? 'correct' : 'incorrect');
  }
  return (
    <div className="class-activity">
      <p className="class-prompt">{exercise.prompt}</p>
      <fieldset className="class-choice-list">
        <legend className="sr-only">Answer choices</legend>
        {stableOptions(exercise).map((option) => (
          <label
            className={selected === option.id ? 'is-selected' : ''}
            key={option.id}
          >
            <input type="radio" name={`choice-${exercise.id}`} value={option.id} checked={selected === option.id} disabled={submitted} onChange={() => setSelected(option.id)} />
            <span>{option.text}</span>
          </label>
        ))}
      </fieldset>
      {!submitted ? (
        <button type="button" className="study-primary" disabled={!selected} onClick={submit}>Check answer</button>
      ) : (
        <output className={`class-feedback ${correct ? 'is-correct' : 'is-review'}`}>
          <strong>{correct ? 'Correct' : 'Needs review'}</strong>
          <p>{exercise.explanation}</p>
        </output>
      )}
    </div>
  );
}

function SentenceOrderActivity({ exercise, onResult }: { exercise: SentenceOrderExercise; onResult: (result: AttemptResult) => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const chosenSet = new Set(chosen);
  const isCorrect = exercise.acceptedOrders.some((order) => order.join('|') === chosen.join('|'));
  function submit() {
    if (chosen.length !== exercise.tokens.length || submitted) return;
    setSubmitted(true);
    onResult(isCorrect ? 'correct' : 'incorrect');
  }
  return (
    <div className="class-activity">
      <p className="class-prompt">{exercise.prompt}</p>
      <div className="sentence-build" aria-label="Your sentence">
        {chosen.length === 0 ? <span>Tap words below to build the sentence.</span> : chosen.map((id) => {
          const token = exercise.tokens.find((item) => item.id === id);
          return <button type="button" disabled={submitted} key={id} onClick={() => setChosen((current) => current.filter((item) => item !== id))}>{token?.text}</button>;
        })}
      </div>
      <div className="sentence-tokens" aria-label="Available words">
        {exercise.tokens.map((token) => (
          <button type="button" disabled={submitted || chosenSet.has(token.id)} key={token.id} onClick={() => setChosen((current) => [...current, token.id])}>{token.text}</button>
        ))}
      </div>
      {!submitted ? (
        <div className="class-action-row">
          <button type="button" className="study-secondary" disabled={chosen.length === 0} onClick={() => setChosen([])}><RotateCcw aria-hidden="true" /> Clear</button>
          <button type="button" className="study-primary" disabled={chosen.length !== exercise.tokens.length} onClick={submit}>Check sentence</button>
        </div>
      ) : (
        <output className={`class-feedback ${isCorrect ? 'is-correct' : 'is-review'}`}>
          <strong>{isCorrect ? 'Correct' : 'Review the pattern'}</strong>
          {!isCorrect && <p lang="zh-Hant" className="class-answer">{exercise.answer}</p>}
          <p>{exercise.explanation}</p>
        </output>
      )}
    </div>
  );
}

function SpeakingActivity({ exercise, onResult }: { exercise: SpeakingExercise; onResult: (result: AttemptResult) => void }) {
  const prompt = CH201_SPEAKING_BY_ID.get(exercise.promptId);
  const [showPinyin] = usePinyinciationPreference();
  const [showEnglish] = useEnglishPreference();
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState(false);
  const [soundStatus, setSoundStatus] = useState('');
  if (!prompt) return null;
  const answers = prompt.suggestedAnswerIds.map((id) => CH201_EXAMPLES_BY_ID.get(id)).filter(Boolean);
  function rate(result: AttemptResult) {
    if (rated) return;
    setRated(true);
    onResult(result);
  }
  return (
    <div className="class-activity speaking-activity">
      <p className="class-prompt" lang="zh-Hant">{prompt.promptZh}</p>
      {showPinyin && <p className="class-pinyin">{prompt.promptPinyin}</p>}
      {showEnglish && <p className="class-english">{prompt.promptEn}</p>}
      <p>Answer aloud. When you are ready, reveal a suggested response.</p>
      {!revealed ? (
        <button type="button" className="study-primary" onClick={() => setRevealed(true)}>Reveal answer</button>
      ) : (
        <>
          <div className="speaking-model">
            {answers.map((answer) => answer && (
              <div key={answer.id}>
                <div className="speaking-model-head">
                  <strong lang="zh-Hant">{answer.traditional}</strong>
                  <button type="button" onClick={() => speak(answer.traditional, setSoundStatus)} aria-label={`Hear ${answer.traditional}`}><Volume2 aria-hidden="true" /></button>
                </div>
                {showPinyin && <span>{answer.pinyin}</span>}
                {showEnglish && <small>{answer.english}</small>}
              </div>
            ))}
          </div>
          {!rated ? (
            <div className="class-rating" aria-label="Rate your speaking recall">
              <button type="button" onClick={() => rate('again')}>Practice again</button>
              <button type="button" onClick={() => rate('assisted')}>Needed help</button>
              <button type="button" onClick={() => rate('independent')}>Said it independently</button>
            </div>
          ) : <output className="class-feedback is-correct"><strong>Speaking practice recorded</strong><p>This is a self-assessment, not a pronunciation score.</p></output>}
        </>
      )}
      <span className="sr-only" aria-live="polite">{soundStatus}</span>
    </div>
  );
}

export function StudyPackSession({
  title,
  exercises,
  sessionId,
  targetMinutes,
  unitId,
  initialIndex = 0,
  initialAnswered = [],
  startedAt: initialStartedAt,
  onExitHref,
}: {
  title: string;
  exercises: StudyExercise[];
  sessionId: string;
  targetMinutes?: 5 | 10 | 20;
  unitId?: string;
  initialIndex?: number;
  initialAnswered?: string[];
  startedAt?: string;
  onExitHref: string;
}) {
  const [index, setIndex] = useState(Math.min(initialIndex, Math.max(0, exercises.length - 1)));
  const [answered, setAnswered] = useState<string[]>(initialAnswered);
  const [results, setResults] = useState<Record<string, AttemptResult>>({});
  const [startedAt] = useState(() => initialStartedAt ?? new Date().toISOString());
  const { state: progressState } = useStudyPackProgress();
  const exercise = exercises[index];
  const answeredCurrent = exercise ? answered.includes(exercise.id) : false;
  const complete = exercises.length === 0 || index >= exercises.length;

  const saveSnapshot = useCallback((nextIndex: number, nextAnswered: string[]) => {
    if (!targetMinutes) return;
    const now = new Date().toISOString();
    const snapshot: SessionSnapshot = {
      id: sessionId,
      packId: 'ch201',
      contentVersion: 1,
      targetMinutes,
      unitId,
      exerciseIds: exercises.map((item) => item.id),
      currentIndex: nextIndex,
      answeredExerciseIds: nextAnswered,
      startedAt,
      updatedAt: now,
    };
    saveStudySession(snapshot);
  }, [exercises, sessionId, startedAt, targetMinutes, unitId]);

  function record(result: AttemptResult) {
    if (!exercise || answeredCurrent) return;
    recordStudyAttempt({
      id: makeAttemptId(sessionId, exercise.id),
      packId: 'ch201',
      unitId: exercise.unitId,
      exerciseId: exercise.id,
      itemKeys: exercise.targetKeys,
      skill: exercise.skill,
      result,
      mistakeTag: result === 'incorrect' || result === 'again' || result === 'assisted' ? exercise.mistakeTag : undefined,
    });
    const nextAnswered = [...answered, exercise.id];
    setAnswered(nextAnswered);
    setResults((current) => ({ ...current, [exercise.id]: result }));
    saveSnapshot(index, nextAnswered);
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= exercises.length) {
      setIndex(exercises.length);
      if (targetMinutes) clearStudySession('ch201');
    } else {
      setIndex(nextIndex);
      saveSnapshot(nextIndex, answered);
    }
  }

  const summary = useMemo(() => {
    const persistedResults = progressState.attempts.filter((attempt) => attempt.id.startsWith(`${sessionId}:`)).map((attempt) => attempt.result);
    const values = persistedResults.length > 0 ? persistedResults : Object.values(results);
    return {
      correct: values.filter((result) => result === 'correct').length,
      incorrect: values.filter((result) => result === 'incorrect').length,
      independent: values.filter((result) => result === 'independent').length,
      weak: values.filter((result) => result === 'assisted' || result === 'again').length,
    };
  }, [progressState.attempts, results, sessionId]);

  if (complete) {
    return (
      <section className="class-session class-session-complete">
        <Check aria-hidden="true" />
        <h2>Session complete</h2>
        <p>You practiced {answered.length} item{answered.length === 1 ? '' : 's'}.</p>
        <div className="class-summary-grid">
          <span><strong>{summary.correct}</strong> objective answers correct</span>
          <span><strong>{summary.incorrect}</strong> objective answers to review</span>
          <span><strong>{summary.independent}</strong> independent speaking recalls</span>
          <span><strong>{summary.weak}</strong> self-rated weak responses</span>
        </div>
        <div className="class-action-row">
          <a className="study-secondary" href="/classroom/ch201/mistakes">Review weak items</a>
          <a className="study-primary" href={onExitHref}>Done <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>
    );
  }

  if (!exercise) return <p className="class-empty">No exercises are available for this selection yet.</p>;

  return (
    <section className="class-session" aria-labelledby="class-session-title">
      <div className="class-session-head">
        <div>
          <span className="eyebrow">{index + 1} of {exercises.length}</span>
          <h2 id="class-session-title">{title}</h2>
        </div>
        <a href={onExitHref}>Pause and exit</a>
      </div>
      <progress className="class-progress-track" max={exercises.length} value={index + 1}>Activity {index + 1} of {exercises.length}</progress>
      <h3>{exercise.title}</h3>
      {exercise.kind === 'choice' && <ChoiceActivity key={exercise.id} exercise={exercise} onResult={record} />}
      {exercise.kind === 'sentence-order' && <SentenceOrderActivity key={exercise.id} exercise={exercise} onResult={record} />}
      {exercise.kind === 'speaking-recall' && <SpeakingActivity key={exercise.id} exercise={exercise} onResult={record} />}
      {answeredCurrent && <button type="button" className="study-primary class-next" onClick={next}>Next <ArrowRight aria-hidden="true" /></button>}
    </section>
  );
}
