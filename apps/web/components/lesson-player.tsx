'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Headphones,
  Lightbulb,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import type { Lesson, ListenStage } from '@/lib/lesson-types';

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [speechStatus, setSpeechStatus] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [recallAnswer, setRecallAnswer] = useState('');
  const [recallResult, setRecallResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);

  const stage = lesson.stages[stageIndex];
  const progress = ((stageIndex + 1) / lesson.stages.length) * 100;
  const selectedChoiceRecord = useMemo(() => {
    if (stage.kind !== 'choice') return undefined;
    return stage.choices.find((choice) => choice.id === selectedChoice);
  }, [selectedChoice, stage]);

  const canContinue =
    stage.kind === 'choice'
      ? selectedChoiceRecord?.correct === true
      : stage.kind === 'recall'
        ? recallResult === 'correct'
        : true;

  const speak = (utterance: ListenStage['utterances'][number]) => {
    if (!('speechSynthesis' in window)) {
      setSpeechStatus('Speech is not available in this browser. You can continue without it.');
      return;
    }

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(utterance.speech);
    speech.lang = 'zh-TW';
    speech.rate = utterance.hanzi.length > 1 ? 0.72 : 0.62;
    speech.onstart = () => setSpeechStatus(`Playing ${utterance.pinyin}`);
    speech.onend = () => setSpeechStatus('');
    speech.onerror = () => setSpeechStatus('No Chinese voice is installed. You can continue without audio.');
    window.speechSynthesis.speak(speech);
  };

  const goToStage = (nextIndex: number) => {
    setStageIndex(nextIndex);
    setSpeechStatus('');
    if (lesson.stages[nextIndex]?.kind === 'recall') {
      setShowPinyin(false);
      setShowMeaning(false);
    }
  };

  const checkRecall = () => {
    if (stage.kind !== 'recall') return;
    const normalized = recallAnswer.trim().toLocaleLowerCase();
    const correct = stage.acceptedAnswers.some((answer) => answer.toLocaleLowerCase() === normalized);
    setRecallResult(correct ? 'correct' : 'incorrect');
  };

  const restart = () => {
    setStageIndex(0);
    setShowPinyin(true);
    setShowMeaning(true);
    setSpeechStatus('');
    setSelectedChoice('');
    setRecallAnswer('');
    setRecallResult('idle');
    setShowHint(false);
  };

  return (
    <section aria-labelledby="lesson-heading" className="lesson-panel relative z-10 overflow-hidden rounded-[2rem]">
      <div className="lesson-panel-header">
        <div>
          <p className="lesson-kicker">{lesson.pathway} · Lesson {String(lesson.number).padStart(2, '0')}</p>
          <p className="lesson-stage-label">{stageIndex + 1}. {stage.label}</p>
        </div>
        <div className="lesson-time">
          <span>{stageIndex + 1} / {lesson.stages.length}</span>
          <span>{lesson.estimatedMinutes} min</span>
        </div>
      </div>

      <Progress value={progress} aria-label={`Lesson progress: ${Math.round(progress)} percent`} className="lesson-progress" />

      <div className="lesson-panel-body">
        <div className="lesson-copy-row">
          <div>
            <h2 id="lesson-heading">{stage.title}</h2>
            <p>{stage.instruction}</p>
          </div>
          <div className="learning-objective">
            <strong>Today’s goal</strong>
            {lesson.objective}
          </div>
        </div>

        <div className="lesson-stage-surface" key={stage.id}>
          {stage.kind === 'meet' && (
            <div className="phrase-focus">
              <p lang="zh-Hant" className="focus-hanzi">{stage.phrase.hanzi}</p>
              <div className="focus-support">
                {showPinyin && <p className="focus-pinyin">{stage.phrase.pinyin}</p>}
                {showMeaning && <p className="focus-meaning">{stage.phrase.meaning}</p>}
              </div>
              <p className="focus-context">{stage.context}</p>
            </div>
          )}

          {stage.kind === 'listen' && (
            <div className="listen-stage">
              <div className="listen-intro"><Headphones aria-hidden="true" /> Tap any row to hear it.</div>
              <div className="utterance-list">
                {stage.utterances.map((utterance) => (
                  <button key={utterance.hanzi} type="button" className="utterance-row" onClick={() => speak(utterance)}>
                    <span lang="zh-Hant" className="utterance-hanzi">{utterance.hanzi}</span>
                    <span className="utterance-details">
                      <strong>{utterance.pinyin}</strong>
                      <span>{utterance.meaning}</span>
                    </span>
                    <span className="utterance-play"><Volume2 aria-hidden="true" /></span>
                  </button>
                ))}
              </div>
              <p className="speech-status" aria-live="polite">{speechStatus}</p>
            </div>
          )}

          {stage.kind === 'notice' && (
            <div className="notice-stage">
              <div className="character-grid">
                {stage.items.map((item) => (
                  <article key={item.hanzi} className="character-card">
                    <p lang="zh-Hant">{item.hanzi}</p>
                    {showPinyin && <strong>{item.pinyin}</strong>}
                    {showMeaning && <span>{item.meaning}</span>}
                  </article>
                ))}
                <span className="character-plus" aria-hidden="true">+</span>
              </div>
              <div className="tone-note"><Lightbulb aria-hidden="true" /><p>{stage.note}</p></div>
            </div>
          )}

          {stage.kind === 'choice' && (
            <fieldset className="choice-stage">
              <legend>{stage.prompt}</legend>
              <div className="choice-grid">
                {stage.choices.map((choice) => {
                  const selected = selectedChoice === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      className="choice-card"
                      data-selected={selected || undefined}
                      data-result={selected ? (choice.correct ? 'correct' : 'incorrect') : undefined}
                      onClick={() => setSelectedChoice(choice.id)}
                      aria-pressed={selected}
                    >
                      <span lang="zh-Hant">{choice.hanzi}</span>
                      <strong>{choice.pinyin}</strong>
                    </button>
                  );
                })}
              </div>
              {selectedChoiceRecord && (
                <div className="answer-feedback" data-result={selectedChoiceRecord.correct ? 'correct' : 'incorrect'} aria-live="polite">
                  {selectedChoiceRecord.correct ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
                  <p>{selectedChoiceRecord.feedback}</p>
                </div>
              )}
            </fieldset>
          )}

          {stage.kind === 'recall' && (
            <div className="recall-stage">
              <div className="recall-prompt">
                <span lang="zh-Hant">你好</span>
                <p>{stage.prompt}</p>
              </div>
              <form onSubmit={(event) => { event.preventDefault(); checkRecall(); }} className="recall-form">
                <label htmlFor="recall-answer">Type the English meaning</label>
                <div className="recall-input-row">
                  <Input
                    id="recall-answer"
                    value={recallAnswer}
                    onChange={(event) => { setRecallAnswer(event.target.value); setRecallResult('idle'); }}
                    placeholder="Your answer"
                    autoComplete="off"
                  />
                  <Button type="submit" disabled={!recallAnswer.trim()}>Check</Button>
                </div>
              </form>
              <Button type="button" variant="ghost" className="hint-button" onClick={() => setShowHint((visible) => !visible)}>
                <Lightbulb aria-hidden="true" /> {showHint ? 'Hide hint' : 'Need a hint?'}
              </Button>
              {showHint && <p className="recall-hint">{stage.hint}</p>}
              {recallResult !== 'idle' && (
                <div className="answer-feedback" data-result={recallResult} aria-live="polite">
                  {recallResult === 'correct' ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
                  <p>{recallResult === 'correct' ? 'That’s it—你好 means “hello” or “hi.”' : 'Not quite. Use the hint, then try again.'}</p>
                </div>
              )}
            </div>
          )}

          {stage.kind === 'review' && (
            <div className="review-stage">
              <div className="completion-mark"><Check aria-hidden="true" /></div>
              <div>
                <p className="completion-label">Lesson complete</p>
                <h3 lang="zh-Hant">你好，初學者！</h3>
                <p className="completion-translation">Hello, beginner!</p>
              </div>
              <ul>
                {stage.learned.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}
              </ul>
              <p className="next-lesson">{stage.next}</p>
            </div>
          )}
        </div>

        {stage.kind !== 'recall' && stage.kind !== 'review' && (
          <div className="support-controls" aria-label="Learning support">
            <label htmlFor="pinyin-support"><Switch id="pinyin-support" checked={showPinyin} onCheckedChange={setShowPinyin} /> Pinyin</label>
            <label htmlFor="meaning-support"><Switch id="meaning-support" checked={showMeaning} onCheckedChange={setShowMeaning} /> Meaning</label>
          </div>
        )}

        <div className="lesson-navigation">
          <Button type="button" variant="ghost" disabled={stageIndex === 0} onClick={() => goToStage(stageIndex - 1)}>
            <ArrowLeft aria-hidden="true" /> Back
          </Button>
          {stageIndex < lesson.stages.length - 1 ? (
            <Button type="button" className="continue-button" disabled={!canContinue} onClick={() => goToStage(stageIndex + 1)}>
              {stage.kind === 'choice' && !canContinue ? 'Choose the greeting' : stage.kind === 'recall' && !canContinue ? 'Recall the meaning' : 'Continue'}
              <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button type="button" className="continue-button" onClick={restart}>
              <RotateCcw aria-hidden="true" /> Practice again
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
