'use client';

import { useCallback, useState } from 'react';
import { ArrowRight, Moon, Sun, Volume2 } from 'lucide-react';

import { useTheme } from '@/lib/use-theme';
import {
  MEASURE_WORDS,
  NUMBER_BUILD,
  NUMBERS,
  PARTICLES,
  PRONOUNS,
  SECTIONS,
  SENTENCE_PATTERNS,
  SOUND_CONTRASTS,
  STUDY_TIPS,
  SURVIVAL_PHRASES,
  TIME_WORDS,
  TONES,
} from '@/lib/fundamentals';

function AudioButton({
  hanzi,
  onSpeak,
}: {
  hanzi: string;
  onSpeak: (hanzi: string) => void;
}) {
  return (
    <button
      type="button"
      className="fundamentals-audio"
      onClick={() => onSpeak(hanzi)}
      aria-label={`Hear ${hanzi} pronounced`}
    >
      <span lang="zh-Hant" className="fundamentals-hanzi">
        {hanzi}
      </span>
      <Volume2 aria-hidden="true" />
    </button>
  );
}

function SectionHeading({
  id,
  num,
  children,
}: {
  id: string;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={`${id}-heading`}>
      <span className="section-num">{num}</span> {children}
    </h2>
  );
}

export function FundamentalsGuide() {
  const [status, setStatus] = useState('');
  const [darkMode, setDarkMode] = useTheme();

  const speak = useCallback((hanzi: string) => {
    if (!('speechSynthesis' in window)) {
      setStatus('Audio is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hanzi);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.75;
    utterance.onstart = () => setStatus(`Playing ${hanzi}`);
    utterance.onend = () => setStatus('');
    window.speechSynthesis.speak(utterance);
  }, []);

  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="topbar">
        <a className="brand" href="/" aria-label="ZiLu home">
          <span className="brand-mark">字</span>
          <span>
            <strong>ZiLu</strong>
            <small>Your path into Chinese</small>
          </span>
        </a>
        <nav className="topbar-nav" aria-label="Primary">
          <a href="/fundamentals" aria-current="page">
            Fundamentals
          </a>
          <a href="/study">Study</a>
        </nav>
      </header>

      <section className="fundamentals-hero">
        <span className="eyebrow">Start Here</span>
        <h1>Chinese fundamentals</h1>
        <p>
          A one-page orientation for anyone starting from zero. Read it once
          before the pathways, then come back whenever something in a lesson
          feels unexplained. Everything here is original, and every Chinese word
          has a button that speaks it aloud.
        </p>
      </section>

      <nav className="fundamentals-toc" aria-label="On this page">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            <span>{section.num}</span>
            {section.title}
          </a>
        ))}
      </nav>

      <section
        id="orientation"
        className="fundamentals-section"
        aria-labelledby="orientation-heading"
      >
        <SectionHeading id="orientation" num="01">
          What you are learning
        </SectionHeading>
        <p>
          &ldquo;Chinese&rdquo; usually means <strong>Mandarin</strong> -- the
          spoken standard of mainland China and Taiwan and the most widely
          spoken language on earth. Other varieties such as Cantonese or Hokkien
          are relatives, not accents; a Mandarin speaker cannot follow them by
          ear.
        </p>
        <p>
          ZiLu teaches Mandarin, written in{' '}
          <strong>Traditional characters</strong> (the form used in Taiwan, Hong
          Kong, and Macau). Mainland China uses a simplified set -- you do not
          need to learn both.
        </p>
        <p>
          Every card shows three things: the <strong>character(s)</strong>, the{' '}
          <strong>pinyin</strong> (a pronunciation guide), and the{' '}
          <strong>meaning</strong>. Pinyin and English are training wheels. The
          characters are the actual language.
        </p>
        <div className="fundamentals-card">
          <AudioButton hanzi="你好" onSpeak={speak} />
          <p>
            <strong>nǐ hǎo</strong> · hello
          </p>
        </div>
      </section>

      <section
        id="characters"
        className="fundamentals-section"
        aria-labelledby="characters-heading"
      >
        <SectionHeading id="characters" num="02">
          How characters work
        </SectionHeading>
        <p>
          Each character is <strong>one syllable</strong> and usually{' '}
          <strong>one chunk of meaning</strong>. Words are often built from two
          of them, and the pieces frequently make sense together.
        </p>
        <div className="pattern-grid">
          <article className="pattern-card">
            <h3>One character, one syllable</h3>
            <div className="pattern-example">
              <AudioButton hanzi="貓" onSpeak={speak} />
              <p>
                <strong>māo</strong> · cat
              </p>
            </div>
          </article>
          <article className="pattern-card">
            <h3>Two characters, one word</h3>
            <p className="pattern-explanation">
              熊 (bear) + 貓 (cat) = panda. The parts hint at the whole.
            </p>
            <div className="pattern-example">
              <AudioButton hanzi="熊貓" onSpeak={speak} />
              <p>
                <strong>xióng māo</strong> · panda
              </p>
            </div>
          </article>
          <article className="pattern-card">
            <h3>Shared components carry a hint</h3>
            <p className="pattern-explanation">
              媽 (mother), 姐 (older sister), 妹 (younger sister) all contain
              女, meaning &ldquo;woman&rdquo;.
            </p>
          </article>
          <article className="pattern-card">
            <h3>No spaces</h3>
            <p className="pattern-explanation">
              Sentences run the characters together. Part of learning is seeing
              where one word ends and the next begins.
            </p>
          </article>
        </div>
      </section>

      <section
        id="pinyin"
        className="fundamentals-section"
        aria-labelledby="pinyin-heading"
      >
        <SectionHeading id="pinyin" num="03">
          Pinyin, the sound system
        </SectionHeading>
        <p>
          Pinyin spells the <em>sound</em> of a syllable, not its English
          look-alike. Every Mandarin syllable is an optional starting consonant
          (the <strong>initial</strong>), then the rest of the syllable (the{' '}
          <strong>final</strong>), then a <strong>tone</strong>.
        </p>
        <ul className="build-list">
          <li>
            <span lang="zh-Hant">好</span> = h + ao + tone 3 -&gt;{' '}
            <strong>hǎo</strong>
          </li>
          <li>
            <span lang="zh-Hant">中</span> = zh + ong + tone 1 -&gt;{' '}
            <strong>zhōng</strong>
          </li>
          <li>
            <span lang="zh-Hant">我</span> = (no initial) + wo + tone 3 -&gt;{' '}
            <strong>wǒ</strong>
          </li>
        </ul>
        <p>
          The letters are borrowed from the Latin alphabet but do not follow
          English rules. Treat pinyin as its own code and let the audio teach
          you the real sounds.
        </p>
      </section>

      <section
        id="tones"
        className="fundamentals-section"
        aria-labelledby="tones-heading"
      >
        <SectionHeading id="tones" num="04">
          The tones
        </SectionHeading>
        <p>
          Mandarin uses pitch to tell words apart. There are four main tones
          plus a light neutral one. The same syllable in a different tone is a
          different word, so tone is part of pronunciation, not decoration.
        </p>
        <div className="tone-grid">
          {TONES.map((tone) => (
            <article key={tone.id} className="tone-card">
              <span className="tone-index">
                {tone.toneNumber === 0
                  ? `Neutral · ${tone.mark}`
                  : `Tone ${tone.toneNumber} · ${tone.mark}`}
              </span>
              <AudioButton hanzi={tone.hanzi} onSpeak={speak} />
              <strong>{tone.pinyin}</strong>
              <span className="tone-meaning">{tone.meaning}</span>
              <p>{tone.contour}</p>
            </article>
          ))}
        </div>
        <p className="fundamentals-note">
          The tone mark sits on the main vowel. In natural speech, tones bend a
          little next to each other -- for example, two third tones in a row and
          the first turns into a rising tone. You do not need to drill that now;
          just expect your ear to hear small shifts.
        </p>
      </section>

      <section
        id="sounds"
        className="fundamentals-section"
        aria-labelledby="sounds-heading"
      >
        <SectionHeading id="sounds" num="05">
          Sounds that trip up English speakers
        </SectionHeading>
        <p>
          A few groups of sounds cause most of the early trouble. Hear each
          example and copy it rather than trusting the spelling.
        </p>
        <ul className="contrast-list">
          {SOUND_CONTRASTS.map((item) => (
            <li key={item.pair}>
              <strong>{item.pair}</strong>
              <span lang="zh-Hant">{item.example}</span>
              <p>{item.tip}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="pronouns"
        className="fundamentals-section"
        aria-labelledby="pronouns-heading"
      >
        <SectionHeading id="pronouns" num="06">
          People words
        </SectionHeading>
        <p>
          Add <span lang="zh-Hant">們</span> (men) to make any of these plural.
          Note that <span lang="zh-Hant">他</span> and{' '}
          <span lang="zh-Hant">她</span> sound <strong>exactly the same</strong>{' '}
          -- you only tell &ldquo;he&rdquo; from &ldquo;she&rdquo; in writing.
        </p>
        <div className="chip-grid">
          {PRONOUNS.map((item) => (
            <button
              key={item.meaning}
              type="button"
              className="chip-card"
              onClick={() => speak(item.hanzi)}
              aria-label={`Hear ${item.hanzi} pronounced`}
            >
              <span lang="zh-Hant">{item.hanzi}</span>
              <small>{item.pinyin}</small>
              <em>{item.meaning}</em>
            </button>
          ))}
        </div>
      </section>

      <section
        id="sentences"
        className="fundamentals-section"
        aria-labelledby="sentences-heading"
      >
        <SectionHeading id="sentences" num="07">
          Building a sentence
        </SectionHeading>
        <p>
          Chinese grammar is not English with the words swapped. These patterns
          cover most of what a beginner needs to start making sentences.
        </p>
        <div className="pattern-grid">
          {SENTENCE_PATTERNS.map((pattern) => (
            <article key={pattern.id} className="pattern-card">
              <h3>{pattern.title}</h3>
              <p className="pattern-template">{pattern.template}</p>
              <p className="pattern-explanation">{pattern.explanation}</p>
              <div className="pattern-example">
                <AudioButton hanzi={pattern.example.hanzi} onSpeak={speak} />
                <p>
                  <strong>{pattern.example.pinyin}</strong> ·{' '}
                  {pattern.example.meaning}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="particles"
        className="fundamentals-section"
        aria-labelledby="particles-heading"
      >
        <SectionHeading id="particles" num="08">
          Little words that do a lot
        </SectionHeading>
        <p>
          These short words have no real English translation on their own. They
          attach to a sentence and change what it does.
        </p>
        <ul className="particle-list">
          {PARTICLES.map((item) => (
            <li key={item.hanzi}>
              <div className="particle-head">
                <AudioButton hanzi={item.hanzi} onSpeak={speak} />
                <strong>{item.pinyin}</strong>
              </div>
              <p className="particle-role">{item.role}</p>
              <p className="particle-example">
                <span lang="zh-Hant">{item.example.hanzi}</span> ·{' '}
                {item.example.pinyin} · {item.example.meaning}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="measure-words"
        className="fundamentals-section"
        aria-labelledby="measure-words-heading"
      >
        <SectionHeading id="measure-words" num="09">
          Measure words
        </SectionHeading>
        <p>
          English says &ldquo;three books&rdquo;. Chinese needs a small counting
          word between the number and the noun: number -&gt; measure word -&gt;
          noun. English speakers forget these constantly, so build the habit
          early.
        </p>
        <ul className="particle-list">
          {MEASURE_WORDS.map((item) => (
            <li key={item.hanzi}>
              <div className="particle-head">
                <AudioButton hanzi={item.hanzi} onSpeak={speak} />
                <strong>{item.pinyin}</strong>
              </div>
              <p className="particle-role">{item.use}</p>
              <p className="particle-example">
                <span lang="zh-Hant">{item.example.hanzi}</span> ·{' '}
                {item.example.pinyin} · {item.example.meaning}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="numbers"
        className="fundamentals-section"
        aria-labelledby="numbers-heading"
      >
        <SectionHeading id="numbers" num="10">
          Numbers, dates, and time
        </SectionHeading>
        <p>Learn zero through ten and the rest is mostly assembly.</p>
        <div className="number-row">
          {NUMBERS.map((item) => (
            <button
              key={item.hanzi}
              type="button"
              className="number-chip"
              onClick={() => speak(item.hanzi)}
              aria-label={`Hear ${item.hanzi}, ${item.meaning}, pronounced`}
            >
              <span lang="zh-Hant">{item.hanzi}</span>
              <small>{item.pinyin}</small>
            </button>
          ))}
        </div>
        <ul className="build-list">
          {NUMBER_BUILD.map((item) => (
            <li key={item.hanzi}>
              <span lang="zh-Hant">{item.hanzi}</span> · {item.pinyin} ·{' '}
              {item.meaning}
            </li>
          ))}
        </ul>
        <p className="fundamentals-subhead">Words for when</p>
        <div className="number-row">
          {TIME_WORDS.map((item) => (
            <button
              key={item.hanzi}
              type="button"
              className="number-chip wide"
              onClick={() => speak(item.hanzi)}
              aria-label={`Hear ${item.hanzi}, ${item.meaning}, pronounced`}
            >
              <span lang="zh-Hant">{item.hanzi}</span>
              <small>{item.meaning}</small>
            </button>
          ))}
        </div>
        <p className="fundamentals-note">
          Dates go <strong>big to small</strong>: year, then month, then day,
          then weekday. Months are just a number plus{' '}
          <span lang="zh-Hant">月</span> (一月 = January). Weekdays are{' '}
          <span lang="zh-Hant">星期</span> plus a number (星期一 = Monday). For
          the clock, <span lang="zh-Hant">點</span> is the hour and{' '}
          <span lang="zh-Hant">半</span> is half past.
        </p>
      </section>

      <section
        id="phrases"
        className="fundamentals-section"
        aria-labelledby="phrases-heading"
      >
        <SectionHeading id="phrases" num="11">
          Survival phrases
        </SectionHeading>
        <p>
          Enough to be polite, ask for help, and slow a conversation down. Pick
          the phrase that fits the moment rather than translating word by word.
        </p>
        <div className="phrase-grid">
          {SURVIVAL_PHRASES.map((item) => (
            <article key={item.hanzi} className="phrase-card">
              <AudioButton hanzi={item.hanzi} onSpeak={speak} />
              <strong>{item.pinyin}</strong>
              <span>{item.meaning}</span>
              <small>{item.situation}</small>
            </article>
          ))}
        </div>
      </section>

      <section
        id="study"
        className="fundamentals-section"
        aria-labelledby="study-heading"
      >
        <SectionHeading id="study" num="12">
          How to study with ZiLu
        </SectionHeading>
        <p>
          The pathways are flashcard decks grouped by topic. A few habits make
          them work far better.
        </p>
        <ol className="study-tips">
          {STUDY_TIPS.map((tip) => (
            <li key={tip.title}>
              <strong>{tip.title}</strong>
              <span>{tip.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="fundamentals-cta">
        <div>
          <h2>Ready for Pathway 01</h2>
          <p>
            Pathway 01 &mdash; First Steps starts with greetings and family and
            builds up from there. These fundamentals are the ground it stands
            on.
          </p>
        </div>
        <a href="/study" className="study-primary">
          Go to Study <ArrowRight aria-hidden="true" />
        </a>
      </section>

      <p className="fundamentals-status" aria-live="polite">
        {status}
      </p>

      <footer className="footer">
        <p>Learner-facing Chinese is always Traditional Chinese.</p>
        <label
          className="theme-control"
          aria-label="Choose light or dark appearance"
        >
          <Sun aria-hidden="true" />
          <span>Solarpunk</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(event) => setDarkMode(event.target.checked)}
            aria-label="Use Cyberpunk dark mode"
          />
          <span className="toggle-track" aria-hidden="true">
            <span />
          </span>
          <Moon aria-hidden="true" />
          <span>Cyberpunk</span>
        </label>
      </footer>
    </main>
  );
}
