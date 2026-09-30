'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Volume2 } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';

type BridgeStep = {
  title: string;
  titleZh: string;
  goal: string;
  explain: string;
  example: string;
  prompt: string;
  choices: string[];
  answer: string;
  feedback: string;
};

const STEPS: BridgeStep[] = [
  { title: 'Hear the shape of a word', titleZh: '先聽字音', goal: 'Chinese is not a stream of unfamiliar symbols. Start by hearing one word as one sound pattern.', explain: 'Pinyin is a pronunciation guide. The tone mark changes the word’s sound. You do not need to master every sound today—just notice, listen, and repeat.', example: 'mā / má / mǎ / mà — the same spelling can have four different tones.', prompt: 'Which pinyin spelling includes the third-tone mark?', choices: ['mā', 'má', 'mǎ'], answer: 'mǎ', feedback: 'The ˇ mark is the third tone. Notice it now; accurate tone production can come with repeated listening.' },
  { title: 'Build one clear sentence', titleZh: '造一個簡單句子', goal: 'Use a reliable order instead of translating English word by word.', explain: 'A useful beginner frame is: person + time + place + action. Chinese often puts time and place before the action.', example: '我 今天 在宿舍 看書。 — I read in the dorm today.', prompt: 'Put the action in the right place: 我今天在宿舍___。', choices: ['看書', '在', '今天'], answer: '看書', feedback: 'The action comes after the time and place in this useful starter pattern.' },
  { title: 'Say “have,” “at,” and “not”', titleZh: '有、在、不、沒', goal: 'Four tiny words unlock many CH201 sentences.', explain: '有 says something exists or someone has something. 在 marks a location before an action. 不 usually negates a present or future action; 沒 is common for not having or not doing something in the past.', example: '宿舍有書。 / 我在宿舍看書。 / 我不去。 / 我沒有書。', prompt: 'Choose the word for “There is a book in the dorm.”', choices: ['有', '不', '沒'], answer: '有', feedback: 'Use 有 for something that exists: 宿舍有一本書。' },
  { title: 'Learn a small useful set', titleZh: '先學六個有用的詞', goal: 'Learn a few words deeply before adding more.', explain: 'Do not try to memorize a whole exam list. First connect a word to a meaning and one usable sentence.', example: '我 = I/me · 在 = at · 有 = have/exist · 學校 = school · 宿舍 = dorm · 看書 = read', prompt: 'What does 宿舍 mean?', choices: ['dormitory', 'classroom', 'restaurant'], answer: 'dormitory', feedback: '宿舍 means dormitory. Say it once, then use it: 我住在宿舍。' },
  { title: 'Connect it to CH201', titleZh: '準備進入CH201', goal: 'Use one pattern without hints, then start the first unit.', explain: 'You are not expected to be fluent. You only need a small base: recognize a few words, notice the sentence order, and be willing to practise in short loops.', example: '我的宿舍離學校不遠。 — My dorm is not far from school.', prompt: 'Which sentence means “My dorm is not far from school”?', choices: ['我的宿舍離學校不遠。', '我的學校在宿舍。', '我不在學校。'], answer: '我的宿舍離學校不遠。', feedback: 'You have used word meaning, order, and one CH201 pattern. You can now start Unit 1 with support.' },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 0.72;
  window.speechSynthesis.speak(utterance);
}

function chineseForSpeech(text: string) {
  return text.match(/[\u3400-\u9fff，。！？、\s]+/g)?.join(' ').trim() ?? '';
}

export function Ch201Bridge() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved: unknown = JSON.parse(window.localStorage.getItem('zilu.ch201Bridge.v1') ?? '[]');
        if (Array.isArray(saved) && saved.every((item) => Number.isInteger(item) && item >= 0 && item < STEPS.length)) setCompleted([...new Set(saved)]);
      } catch { /* Start fresh when browser storage has invalid data. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const step = STEPS[index];
  const answered = selected !== null;
  const correct = selected === step.answer;
  function next() {
    if (!correct) { setSelected(null); return; }
    if (correct && !completed.includes(index)) {
      const nextCompleted = [...completed, index];
      setCompleted(nextCompleted);
      try { window.localStorage.setItem('zilu.ch201Bridge.v1', JSON.stringify(nextCompleted)); } catch { /* The bridge still works without storage. */ }
    }
    if (index < STEPS.length - 1) { setIndex((current) => current + 1); setSelected(null); }
  }
  const done = completed.length === STEPS.length;
  const spokenExample = chineseForSpeech(step.example);
  return <ClassroomShell eyebrow="CH201 / Start from zero" title={<>從零開始 <span>Zero-to-CH201 Bridge</span></>} description="A short, calm on-ramp for learners who need the class rebuilt from the beginning." backHref="/classroom/ch201" backLabel="Chinese Class">
    <section className="bridge-intro"><span className="eyebrow">You are in the right place</span><h2>Start with a few things you can use.</h2><p>This is not a placement test. Work through five tiny lessons. Guessing is allowed; feedback tells you what to do next.</p><progress value={completed.length} max={STEPS.length} aria-label="Bridge progress" /></section>
    {!done ? <section className="bridge-card"><div className="bridge-step"><span>Step {index + 1} of {STEPS.length}</span><strong lang="zh-Hant">{step.titleZh}</strong></div><span className="eyebrow">{step.goal}</span><h2>{step.title}</h2><p>{step.explain}</p><div className="bridge-example"><span lang="zh-Hant">{step.example}</span>{spokenExample && <button type="button" aria-label="Hear the Chinese example" onClick={() => speak(spokenExample)}><Volume2 aria-hidden="true" /></button>}</div><fieldset className="bridge-check"><legend>{step.prompt}</legend>{step.choices.map((choice) => <label key={choice} className={selected === choice ? 'is-selected' : ''}><input type="radio" name={`bridge-${index}`} checked={selected === choice} disabled={answered} onChange={() => setSelected(choice)} /> {choice}</label>)}</fieldset>{answered && <output className={`class-feedback ${correct ? 'is-correct' : 'is-review'}`}><strong>{correct ? 'Good—keep going.' : 'Look at the example, then try the check once more.'}</strong><p>{step.feedback}</p></output>}<div className="class-action-row"><button type="button" className="study-secondary" disabled={index === 0} onClick={() => { setIndex((current) => current - 1); setSelected(null); }}>Previous</button><button type="button" className="study-primary" disabled={!answered} onClick={next}>{correct ? index === STEPS.length - 1 ? 'Finish the bridge' : 'Continue' : 'Try again'} <ArrowRight aria-hidden="true" /></button></div></section> : <section className="bridge-complete"><Check aria-hidden="true" /><span className="eyebrow">Bridge complete</span><h2>You have enough footing to begin.</h2><p>Start Unit 1’s small vocabulary sets and guided activities. Return here any time a sentence feels too hard.</p><a className="study-primary" href="/classroom/ch201/exams/unit-1">Start Unit 1 with support <ArrowRight aria-hidden="true" /></a></section>}
    <section className="classroom-section"><span className="eyebrow">What comes next</span><h2>Do not rush to a practice test.</h2><p>After this bridge: learn one six-word set, build one sentence, complete guided practice, then take a low-stakes test. This sequence gives a beginner multiple ways to meet the same idea before being scored.</p></section>
  </ClassroomShell>;
}
