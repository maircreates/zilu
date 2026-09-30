'use client';

import { useState } from 'react';
import { ArrowRight, ChevronRight, LockKeyhole } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';
import { CH201_EXAMS, getCh201Exam, type ExamBlueprint } from '@/lib/study-packs/exams';

function ExamCard({ exam }: { exam: ExamBlueprint }) {
  return <a className="exam-card" href={`/classroom/ch201/exams/${exam.id}`}><span>{exam.lessons}</span><h2 lang="zh-Hant">{exam.titleZh}</h2><strong>{exam.title}</strong><p>{exam.summary}</p><small>{exam.sections.length} test sections · catch-up path included</small><ChevronRight aria-hidden="true" /></a>;
}

export function ExamsHome() {
  return <ClassroomShell eyebrow="CH201 / Exam Preparation" title={<>考試準備 <span>Exam Preparation</span></>} description="Built for a learner who needs to rebuild the class from the beginning—not just take a review quiz." backHref="/classroom/ch201" backLabel="Chinese Class">
    <section className="exam-starting-point"><div><span className="eyebrow">Start here</span><h2>You do not need to have understood the class already.</h2><p>Choose an exam, then follow the same safe sequence: learn the smallest useful pieces, practise with help, remove the help, and only then simulate the test.</p></div><a className="study-primary" href="/classroom/ch201/exams/unit-1">Start from the basics <ArrowRight aria-hidden="true" /></a></section>
    <section className="exam-path" aria-label="How exam preparation works"><span>1. Learn</span><ArrowRight /><span>2. Guided practice</span><ArrowRight /><span>3. Test yourself</span><ArrowRight /><span>4. Repair mistakes</span></section>
    <section className="exam-grid">{CH201_EXAMS.map((exam) => <ExamCard key={exam.id} exam={exam} />)}</section>
    <p className="exam-source-note">Review materials are used as private references. No official test date is assumed, and source conflicts are shown instead of silently guessed.</p>
  </ClassroomShell>;
}

function LearnView({ exam }: { exam: ExamBlueprint }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return <>
    <section className="exam-callout"><span className="eyebrow">Catch-up first</span><h2>Learn the pieces before you practise the format.</h2><p>Read each pattern, say the example aloud, then reveal the vocabulary meaning. There is no score here.</p></section>
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">What the review says</span><h2>Test sections</h2></div></div><div className="exam-sections">{exam.sections.map((section) => <div key={section.name}><strong>{section.name}</strong><span>{section.points} pts</span></div>)}</div></section>
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Build the foundation</span><h2>Plain-language grammar</h2></div></div><div className="class-grammar-list">{exam.foundations.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.explanation}</p><div className="exam-example" lang="zh-Hant">{item.example}</div></article>)}</div></section>
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Start small</span><h2>Vocabulary to know first</h2></div></div><div className="exam-vocab">{exam.vocabulary.map((word) => <button key={word.hanzi} type="button" onClick={() => setRevealed((current) => ({ ...current, [word.hanzi]: !current[word.hanzi] }))}><strong lang="zh-Hant">{word.hanzi}</strong><span>{word.pinyin}</span><small>{revealed[word.hanzi] ? word.meaning : 'Reveal meaning'}</small></button>)}</div><p className="exam-small-note">This is the first teaching set, not a claim to reproduce the entire private review deck.</p></section>
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
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Translation with models</span><h2>Build, then compare</h2></div></div><div className="exam-model-list">{exam.translations.map((item) => <details key={item.prompt}><summary>{item.prompt}</summary><p lang="zh-Hant">{item.answer}</p></details>)}</div></section>
    <section className="classroom-section"><div className="classroom-section-head"><div><span className="eyebrow">Reading</span><h2>Read for one clear answer</h2></div></div><article className="exam-reading"><p lang="zh-Hant">{exam.reading.passage}</p><strong>{exam.reading.question}</strong><details><summary>Reveal supported answer</summary><p>{exam.reading.answer}</p></details></article></section>
    <section className="classroom-section"><span className="eyebrow">Writing rehearsal</span><h2>Make a private draft</h2><p>{exam.writingPrompt}</p><textarea className="exam-draft" aria-label="Private writing practice draft" placeholder="Write here. This draft stays in this browser tab and is not submitted or graded." /><small className="exam-small-note">Do not add sensitive personal or financial information. Your text is not sent anywhere by this feature.</small></section>
  </>;
}

function TestView({ exam }: { exam: ExamBlueprint }) {
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  return <section className="exam-test-card">{!started ? <><LockKeyhole aria-hidden="true" /><span className="eyebrow">Practice test</span><h2>Answers stay hidden until you finish.</h2><p>This is a low-stakes rehearsal. It uses the same kinds of sections as the review but does not claim to be the official test.</p><button type="button" className="study-primary" onClick={() => setStarted(true)}>Begin practice test</button></> : <><span className="eyebrow">Practice test / {exam.lessons}</span><h2 lang="zh-Hant">{exam.translations[0].prompt}</h2><textarea className="exam-draft" placeholder="Write your answer before revealing the model." aria-label="Practice test answer" /><button type="button" className="study-primary" onClick={() => setRevealed(true)}>Finish and reveal</button>{revealed && <output className="class-feedback is-review"><strong>Model answer</strong><p lang="zh-Hant">{exam.translations[0].answer}</p><p>Record what you missed in your own words, then return to Guided Practice. Full scored attempts are the next expansion of this feature.</p></output>}</>}</section>;
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
