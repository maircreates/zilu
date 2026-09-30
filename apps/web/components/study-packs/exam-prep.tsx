'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, LockKeyhole } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';
import { CH201_EXAMS, getCh201Exam, type ExamBlueprint } from '@/lib/study-packs/exams';
import { getExamAttempt, makeExamAttemptId, saveExamAttempt, type ExamAttempt } from '@/lib/study-packs/exam-progress';

function ExamCard({ exam }: { exam: ExamBlueprint }) {
  return <a className="exam-card" href={`/classroom/ch201/exams/${exam.id}`}><span>{exam.lessons}</span><h2 lang="zh-Hant">{exam.titleZh}</h2><strong>{exam.title}</strong><p>{exam.summary}</p><small>{exam.sections.length} test sections · catch-up path included</small><ChevronRight aria-hidden="true" /></a>;
}

export function ExamsHome() {
  return <ClassroomShell eyebrow="CH201 / Exam Preparation" title={<>考試準備 <span>Exam Preparation</span></>} description="Built for a learner who needs to rebuild the class from the beginning—not just take a review quiz." backHref="/classroom/ch201" backLabel="Chinese Class">
    <section className="exam-starting-point"><div><span className="eyebrow">Start here</span><h2>You do not need to have understood the class already.</h2><p>Choose an exam, then follow the same safe sequence: learn the smallest useful pieces, practise with help, remove the help, and only then simulate the test.</p></div><a className="study-primary" href="/classroom/ch201/exams/unit-1">Start from the basics <ArrowRight aria-hidden="true" /></a></section>
    <section className="exam-path" aria-label="How exam preparation works"><span>1. Learn</span><ArrowRight /><span>2. Guided practice</span><ArrowRight /><span>3. Test yourself</span><ArrowRight /><span>4. Repair mistakes</span></section>
    <StudyPlan />
    <section className="exam-grid">{CH201_EXAMS.map((exam) => <ExamCard key={exam.id} exam={exam} />)}</section>
    <p className="exam-source-note">Review materials are used as private references. No official test date is assumed, and source conflicts are shown instead of silently guessed.</p>
  </ClassroomShell>;
}

function StudyPlan() {
  const [steps, setSteps] = useState<Record<string, boolean>>({});
  useEffect(() => { const timer = window.setTimeout(() => { try { setSteps(JSON.parse(window.localStorage.getItem('zilu.ch201ExamPlan.v1') ?? '{}')); } catch { setSteps({}); } }, 0); return () => window.clearTimeout(timer); }, []);
  function toggle(id: string) { const next = { ...steps, [id]: !steps[id] }; setSteps(next); try { window.localStorage.setItem('zilu.ch201ExamPlan.v1', JSON.stringify(next)); } catch { /* Progress is optional. */ } }
  const tasks = ['Learn Unit 1 foundations', 'Finish one guided-practice session', 'Take one low-stakes practice test', 'Repair the mistakes I missed'];
  return <section className="classroom-section exam-plan"><div className="classroom-section-head"><div><span className="eyebrow">A simple study plan</span><h2>One small win at a time</h2></div></div><p>Check off a step when you finish it. This plan is saved only in this browser; it does not assume an exam date.</p>{tasks.map((task) => <label key={task}><input type="checkbox" checked={Boolean(steps[task])} onChange={() => toggle(task)} /> <span>{task}</span></label>)}</section>;
}

function VocabularyStarter({ exam }: { exam: ExamBlueprint }) {
  const [setIndex, setSetIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [answer, setAnswer] = useState<string | null>(null);
  const sets = Array.from({ length: Math.ceil(exam.vocabulary.length / 6) }, (_, index) => exam.vocabulary.slice(index * 6, index * 6 + 6));
  const words = sets[setIndex];
  const target = words[0];
  const options = [target, words[1], words[2]].filter(Boolean);
  return <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Small-set vocabulary</span><h2>Learn six, then retrieve one</h2></div><span className="exam-set-count">Set {setIndex + 1} of {sets.length}</span></div><p className="exam-small-note">Say each word, reveal the meaning only after a guess, then complete the short retrieval check. Small sets reduce overload and make revisiting practical.</p><div className="exam-vocab">{words.map((word) => <button key={word.hanzi} type="button" onClick={() => setRevealed((current) => ({ ...current, [word.hanzi]: !current[word.hanzi] }))}><strong lang="zh-Hant">{word.hanzi}</strong><span>{word.pinyin}</span><small>{revealed[word.hanzi] ? word.meaning : 'Say it, then reveal'}</small></button>)}</div><div className="exam-retrieval"><strong>Without looking: what does <span lang="zh-Hant">{target.hanzi}</span> mean?</strong><div>{options.map((word) => <button type="button" className={answer === word.hanzi ? 'is-selected' : ''} key={word.hanzi} onClick={() => setAnswer(word.hanzi)}>{word.meaning}</button>)}</div>{answer && <output className={`class-feedback ${answer === target.hanzi ? 'is-correct' : 'is-review'}`}><strong>{answer === target.hanzi ? 'Retrieved it' : 'Look once, then retry'}</strong><p>{target.hanzi} means “{target.meaning}.”</p></output>}</div><div className="class-action-row"><button type="button" className="study-secondary" disabled={setIndex === 0} onClick={() => { setSetIndex((current) => current - 1); setAnswer(null); }}>Previous set</button><button type="button" className="study-primary" disabled={setIndex === sets.length - 1} onClick={() => { setSetIndex((current) => current + 1); setAnswer(null); }}>Next set <ArrowRight aria-hidden="true" /></button></div></section>;
}

function SentenceBuilder({ exam }: { exam: ExamBlueprint }) {
  const pattern = exam.id === 'unit-2' ? ['我', '打算', '明年', '畢業'] : exam.id === 'unit-3' ? ['很多大學生', '一邊上課', '一邊打工'] : exam.id === 'final' ? ['為了', '期末考試', '我', '每天', '學習'] : ['我的宿舍', '離', '學校', '不遠'];
  const [chosen, setChosen] = useState<string[]>([]);
  const complete = chosen.length === pattern.length;
  const correct = chosen.join('|') === pattern.join('|');
  return <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Guided sentence building</span><h2>Build the pattern, not a translation word-for-word</h2></div></div><p>Tap a chunk to place it. If it is wrong, clear it and use the grammar explanation above.</p><div className="sentence-build">{chosen.length === 0 ? <span>Build your sentence here.</span> : chosen.map((word, index) => <button type="button" key={`${word}-${index}`} onClick={() => setChosen((current) => current.filter((_, itemIndex) => itemIndex !== index))}>{word}</button>)}</div><div className="sentence-tokens">{pattern.map((word, index) => <button type="button" disabled={chosen.includes(word)} key={`${word}-${index}`} onClick={() => setChosen((current) => [...current, word])}>{word}</button>)}</div>{complete && <output className={`class-feedback ${correct ? 'is-correct' : 'is-review'}`}><strong>{correct ? 'That pattern works' : 'Try the order again'}</strong><p lang="zh-Hant">{correct ? pattern.join('') : `Model: ${pattern.join('')}`}</p></output>}<button type="button" className="study-secondary" disabled={chosen.length === 0} onClick={() => setChosen([])}>Clear and rebuild</button></section>;
}

function LearnView({ exam }: { exam: ExamBlueprint }) {
  return <>
    <section className="exam-callout"><span className="eyebrow">Catch-up first</span><h2>Learn the pieces before you practise the format.</h2><p>Read each pattern, say the example aloud, then reveal the vocabulary meaning. There is no score here.</p></section>
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">What the review says</span><h2>Test sections</h2></div></div><div className="exam-sections">{exam.sections.map((section) => <div key={section.name}><strong>{section.name}</strong><span>{section.points} pts</span></div>)}</div></section>
    <section className="classroom-section exam-listening"><span className="eyebrow">Listening preparation</span><h2>Use the review’s topics, not invented recordings.</h2><p>No original playable listening audio was supplied with these review files, so ZiLu does not pretend to reproduce it. Practise the listed conversation topics with vocabulary and short answers; add official course audio later if it becomes available.</p></section>
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Build the foundation</span><h2>Plain-language grammar</h2></div></div><div className="class-grammar-list">{exam.foundations.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.explanation}</p><div className="exam-example" lang="zh-Hant">{item.example}</div></article>)}</div></section>
    <VocabularyStarter exam={exam} />
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Writing support</span><h2>Words you can use</h2></div></div><div className="exam-writing-words" lang="zh-Hant">{exam.writingWords.map((word) => <span key={word}>{word}</span>)}</div><p>{exam.writingPrompt}</p></section>
  </>;
}

function PracticeView({ exam }: { exam: ExamBlueprint }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const question = exam.id === 'unit-2' ? { prompt: 'Choose the correct particle: 她中文說___很清楚。', options: ['的', '地', '得'], answer: '得', explain: '得 comes after 說 to describe how clearly the action is done.' } : exam.id === 'final' ? { prompt: 'Choose the best word: ___期末考試，我每天複習。', options: ['因為', '為了', '得'], answer: '為了', explain: '為了 introduces a goal or purpose: studying every day for the final.' } : { prompt: 'Choose the best word: 這個宿舍___新。', options: ['比較', '得', '地'], answer: '比較', explain: '比較 goes immediately before the adjective 新 when it means relatively.' };
  return <>
    <section className="exam-callout"><span className="eyebrow">Guided practice</span><h2>Try one thing at a time.</h2><p>Hints and model answers are available here. A wrong answer is information for your next study step, not a grade.</p></section>
    <section className="exam-practice-card"><span className="eyebrow">Grammar check</span><h2 lang="zh-Hant">{question.prompt}</h2><div className="exam-answer-options">{question.options.map((option) => <button key={option} type="button" disabled={checked} className={selected === option ? 'is-selected' : ''} onClick={() => setSelected(option)}>{option}</button>)}</div>{!checked ? <button className="study-primary" type="button" disabled={!selected} onClick={() => setChecked(true)}>Check with explanation</button> : <output className={`class-feedback ${selected === question.answer ? 'is-correct' : 'is-review'}`}><strong>{selected === question.answer ? 'Correct' : 'Try this pattern again'}</strong><p>{question.explain}</p></output>}</section>
    <SentenceBuilder exam={exam} />
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Translation with models</span><h2>Build, then compare</h2></div></div><div className="exam-model-list">{exam.translations.map((item) => <details key={item.prompt}><summary>{item.prompt}</summary><p lang="zh-Hant">{item.answer}</p></details>)}</div></section>
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Reading</span><h2>Read for one clear answer</h2></div></div><article className="exam-reading"><p lang="zh-Hant">{exam.reading.passage}</p><strong>{exam.reading.question}</strong><details><summary>Reveal supported answer</summary><p>{exam.reading.answer}</p></details></article></section>
    <section className="classroom-section"><span className="eyebrow">Writing rehearsal</span><h2>Make a private draft</h2><p>{exam.writingPrompt}</p><textarea className="exam-draft" aria-label="Private writing practice draft" placeholder="Write here. This draft stays in this browser tab and is not submitted or graded." /><small className="exam-small-note">Do not add sensitive personal or financial information. Your text is not sent anywhere by this feature.</small></section>
  </>;
}

function TestView({ exam }: { exam: ExamBlueprint }) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const grammar = exam.id === 'unit-2' ? { id: 'grammar', prompt: '她中文說___很清楚。', choices: ['的', '地', '得'], correct: '得', repair: 'Review 的 / 地 / 得: 得 follows the verb to describe how it is done.' } : exam.id === 'final' ? { id: 'grammar', prompt: '___期末考試，我每天複習。', choices: ['因為', '為了', '得'], correct: '為了', repair: 'Review 因為 vs 為了: 為了 introduces a purpose.' } : { id: 'grammar', prompt: '這個宿舍___新。', choices: ['比較', '得', '地'], correct: '比較', repair: 'Review 比較: place it immediately before the adjective.' };
  const vocab = { id: 'vocabulary', prompt: `${exam.vocabulary[0].hanzi} means:`, choices: [exam.vocabulary[0].meaning, exam.vocabulary[1].meaning, exam.vocabulary[2].meaning], correct: exam.vocabulary[0].meaning, repair: `Review the vocabulary card for ${exam.vocabulary[0].hanzi}.` };
  const reading = { id: 'reading', prompt: exam.reading.question, choices: [exam.reading.answer, 'The speaker does not say.', 'The opposite is true.'], correct: exam.reading.answer, repair: 'Read the passage again and underline the sentence that answers the question.' };
  const questions = [grammar, vocab, reading];
  function finish() {
    const correctIds = questions.filter((question) => answers[question.id] === question.correct).map((question) => question.id);
    const id = makeExamAttemptId(exam.id);
    const saved = saveExamAttempt({ id, examId: exam.id, completedAt: new Date().toISOString(), answers, correctIds, total: questions.length });
    if (saved) window.location.assign(`/classroom/ch201/exams/${exam.id}/results/${id}`);
  }
  return <section className="exam-test-card">{!started ? <><LockKeyhole aria-hidden="true" /><span className="eyebrow">Practice test</span><h2>Answers stay hidden until you finish.</h2><p>Answer three short questions without hints. Your score and the items to repair are stored only in this browser.</p><button type="button" className="study-primary" onClick={() => setStarted(true)}>Begin practice test</button></> : <>{questions.map((question, index) => <fieldset className="exam-test-question" key={question.id}><legend>{index + 1}. <span lang="zh-Hant">{question.prompt}</span></legend>{question.choices.map((choice) => <label key={choice}><input type="radio" name={question.id} checked={answers[question.id] === choice} onChange={() => setAnswers((current) => ({ ...current, [question.id]: choice }))} /> {choice}</label>)}</fieldset>)}<button type="button" className="study-primary" disabled={Object.keys(answers).length !== questions.length} onClick={finish}>Finish and see results</button></>}</section>;
}

export function ExamResults({ examId, attemptId }: { examId: string; attemptId: string }) {
  const exam = getCh201Exam(examId);
  const [attempt, setAttempt] = useState<ExamAttempt | null | undefined>(undefined);
  useEffect(() => { const timer = window.setTimeout(() => setAttempt(getExamAttempt(attemptId) ?? null), 0); return () => window.clearTimeout(timer); }, [attemptId]);
  if (!exam) return <ExamPage examId={examId} />;
  const questions = [
    { id: 'grammar', label: 'Grammar', repair: exam.id === 'unit-2' ? 'Review 的 / 地 / 得 in Guided Practice.' : exam.id === 'final' ? 'Review 因為 and 為了 in Guided Practice.' : 'Review 比較 and sentence order in Guided Practice.' },
    { id: 'vocabulary', label: 'Vocabulary', repair: `Return to ${exam.vocabulary[0].hanzi} and the first vocabulary set.` },
    { id: 'reading', label: 'Reading', repair: 'Read slowly, then find the exact sentence that answers the question.' },
  ];
  return <ClassroomShell eyebrow={`CH201 / ${exam.lessons}`} title={<>Practice-test results <span lang="zh-Hant">練習結果</span></>} description="Use the result to decide what to repair next—not as a judgment about your ability." backHref={`/classroom/ch201/exams/${exam.id}`} backLabel={exam.title}>
    {attempt === undefined ? <p className="class-empty">Loading this browser’s saved result…</p> : attempt === null ? <section className="class-empty"><p>This result is not available in this browser. Practice attempts stay local and are not synced.</p><a className="study-primary" href={`/classroom/ch201/exams/${exam.id}/test`}>Take a practice test</a></section> : <><section className="exam-result-score"><span className="eyebrow">Your result</span><strong>{attempt.correctIds.length} / {attempt.total}</strong><p>{attempt.correctIds.length === attempt.total ? 'You got every scored item this time. Try another guide or practise writing next.' : 'Here is exactly what to repair before you retest.'}</p></section><section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Mistake review</span><h2>Repair the missed pieces</h2></div></div><div className="exam-repairs">{questions.map((question) => <article key={question.id} className={attempt.correctIds.includes(question.id) ? 'is-correct' : 'is-missed'}><strong>{attempt.correctIds.includes(question.id) ? 'Ready' : 'Review'} · {question.label}</strong><p>{attempt.correctIds.includes(question.id) ? 'This item was correct.' : question.repair}</p></article>)}</div><a className="study-primary" href={`/classroom/ch201/exams/${exam.id}/practice`}>Return to guided practice <ArrowRight aria-hidden="true" /></a></section></>}
  </ClassroomShell>;
}

export function ExamPage({ examId, mode = 'learn' }: { examId: string; mode?: 'learn' | 'practice' | 'test' }) {
  const exam = getCh201Exam(examId);
  if (!exam) return <ClassroomShell eyebrow="CH201 / Exam Preparation" title="Exam not found" description="Choose one of the available CH201 exam guides." backHref="/classroom/ch201/exams" backLabel="Exam Preparation"><p className="class-empty">That exam guide is not available.</p></ClassroomShell>;
  const nav = [{ id: 'learn', label: '1. Learn it', href: `/classroom/ch201/exams/${exam.id}` }, { id: 'practice', label: '2. Guided practice', href: `/classroom/ch201/exams/${exam.id}/practice` }, { id: 'test', label: '3. Practice test', href: `/classroom/ch201/exams/${exam.id}/test` }];
  return <ClassroomShell eyebrow={`CH201 / ${exam.lessons}`} title={<><span lang="zh-Hant">{exam.titleZh}</span> {exam.title}</>} description={exam.summary} backHref="/classroom/ch201/exams" backLabel="Exam Preparation">
    {exam.sourceNote && <output className="class-storage-warning">{exam.sourceNote}</output>}
    <nav className="exam-mode-nav" aria-label="Exam preparation steps">{nav.map((item) => <a key={item.id} href={item.href} aria-current={mode === item.id ? 'page' : undefined}>{item.label}</a>)}</nav>
    {mode === 'learn' && <LearnView exam={exam} />}{mode === 'practice' && <PracticeView exam={exam} />}{mode === 'test' && <TestView exam={exam} />}
  </ClassroomShell>;
}
