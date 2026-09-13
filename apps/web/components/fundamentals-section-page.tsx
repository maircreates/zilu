'use client';

import { useCallback, useState } from 'react';
import { ArrowLeft, Moon, Sun, Volume2 } from 'lucide-react';

import { useTheme } from '@/lib/use-theme';
import { SearchTrigger } from '@/components/search-trigger';
import { SettingsTrigger } from '@/components/settings-trigger';
import { ToneDrill } from '@/components/tone-drill';
import {
  MEASURE_WORDS,
  NUMBER_BUILD,
  NUMBERS,
  PARTICLES,
  PRONOUNS,
  RADICALS,
  SECTIONS,
  SENTENCE_PATTERNS,
  SOUND_CONTRASTS,
  STUDY_TIPS,
  SURVIVAL_PHRASES,
  TIME_WORDS,
  TONES,
} from '@/lib/fundamentals';

type Speak = (hanzi: string) => void;
type SectionProps = { speak: Speak };

function AudioButton({ hanzi, onSpeak }: { hanzi: string; onSpeak: Speak }) {
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

function OrientationContent({ speak }: SectionProps) {
  return (
    <>
      <p>
        &ldquo;Chinese&rdquo; usually means <strong>Mandarin</strong> -- the
        spoken standard of mainland China and Taiwan and the most widely spoken
        language on earth. Other varieties such as Cantonese or Hokkien are
        relatives, not accents; a Mandarin speaker cannot follow them by ear.
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
    </>
  );
}

function CharactersContent({ speak }: SectionProps) {
  return (
    <>
      <p>
        Each character is <strong>one syllable</strong> and usually{' '}
        <strong>one chunk of meaning</strong>. Words are often built from two of
        them, and the pieces frequently make sense together.
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
            媽 (mother), 姐 (older sister), 妹 (younger sister) all contain 女,
            meaning &ldquo;woman&rdquo;.
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
    </>
  );
}

function RadicalsContent({ speak }: SectionProps) {
  return (
    <>
      <p>
        Most characters are built from smaller, reused pieces called radicals.
        Learning a radical is not extra work on top of a character -- it is a
        shortcut that makes the <em>next</em> ten characters with that piece
        easier to guess and remember.
      </p>
      <div className="radical-grid">
        {RADICALS.map((radical) => (
          <article key={radical.hanzi} className="radical-card">
            <div className="radical-head">
              <AudioButton hanzi={radical.hanzi} onSpeak={speak} />
              <div className="radical-head-text">
                <strong>{radical.pinyin}</strong>
                <span>{radical.meaning}</span>
              </div>
              {radical.asComponent && (
                <span className="radical-as" lang="zh-Hant">
                  as {radical.asComponent}
                </span>
              )}
            </div>
            <p className="radical-tip">{radical.tip}</p>
            <ul className="radical-examples">
              {radical.examples.map((example) => (
                <li key={example.hanzi}>
                  <button
                    type="button"
                    onClick={() => speak(example.hanzi)}
                    aria-label={`Hear ${example.hanzi} pronounced`}
                  >
                    <span lang="zh-Hant">{example.hanzi}</span>
                  </button>
                  <small>
                    {example.pinyin} · {example.meaning}
                  </small>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}

function PinyinContent() {
  return (
    <>
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
        English rules. Treat pinyin as its own code and let the audio teach you
        the real sounds.
      </p>
    </>
  );
}

function TonesContent({ speak }: SectionProps) {
  return (
    <>
      <p>
        Mandarin uses pitch to tell words apart. There are four main tones plus
        a light neutral one. The same syllable in a different tone is a
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

      <ToneDrill />

      <p className="fundamentals-note">
        The tone mark sits on the main vowel. In natural speech, tones bend a
        little next to each other -- for example, two third tones in a row and
        the first turns into a rising tone. You do not need to drill that now;
        just expect your ear to hear small shifts.
      </p>
    </>
  );
}

function SoundsContent() {
  return (
    <>
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
    </>
  );
}

function PronounsContent({ speak }: SectionProps) {
  return (
    <>
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
    </>
  );
}

function SentencesContent({ speak }: SectionProps) {
  return (
    <>
      <p>
        Chinese grammar is not English with the words swapped. Here are the four
        ideas that matter most on day one. The full reference, with more
        examples and hide-able pinyin and English, lives on the{' '}
        <a href="/grammar">Grammar page</a>.
      </p>
      <div className="pattern-grid">
        {SENTENCE_PATTERNS.slice(0, 4).map((pattern) => (
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
    </>
  );
}

function ParticlesContent({ speak }: SectionProps) {
  return (
    <>
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
    </>
  );
}

function MeasureWordsContent({ speak }: SectionProps) {
  return (
    <>
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
    </>
  );
}

function NumbersContent({ speak }: SectionProps) {
  return (
    <>
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
        Dates go <strong>big to small</strong>: year, then month, then day, then
        weekday. Months are just a number plus <span lang="zh-Hant">月</span>{' '}
        (一月 = January). Weekdays are <span lang="zh-Hant">星期</span> plus a
        number (星期一 = Monday). For the clock, <span lang="zh-Hant">點</span>{' '}
        is the hour and <span lang="zh-Hant">半</span> is half past.
      </p>
    </>
  );
}

function PhrasesContent({ speak }: SectionProps) {
  return (
    <>
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
    </>
  );
}

function StudyContent() {
  return (
    <>
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
    </>
  );
}

const SECTION_CONTENT: Record<
  string,
  (props: SectionProps) => React.ReactNode
> = {
  orientation: OrientationContent,
  characters: CharactersContent,
  radicals: RadicalsContent,
  pinyin: PinyinContent,
  tones: TonesContent,
  sounds: SoundsContent,
  pronouns: PronounsContent,
  sentences: SentencesContent,
  particles: ParticlesContent,
  'measure-words': MeasureWordsContent,
  numbers: NumbersContent,
  phrases: PhrasesContent,
  study: StudyContent,
};

export function FundamentalsSectionPage({ sectionId }: { sectionId: string }) {
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

  const index = SECTIONS.findIndex((item) => item.id === sectionId);
  const section = SECTIONS[index] ?? SECTIONS[0];
  const prev = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];
  const Content = SECTION_CONTENT[section.id] ?? OrientationContent;

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
          <a href="/grammar">Grammar</a>
          <a href="/study">Study</a>
          <SearchTrigger />
          <SettingsTrigger />
        </nav>
      </header>

      <a href="/fundamentals" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Fundamentals
      </a>

      <section className="fundamentals-hero">
        <span className="eyebrow">
          Fundamentals · {section.num} / {SECTIONS.length}
        </span>
        <h1 id="section-heading">{section.title}</h1>
      </section>

      <section
        className="fundamentals-section"
        aria-labelledby="section-heading"
      >
        <Content speak={speak} />
      </section>

      <nav className="subpage-pager" aria-label="Section navigation">
        {prev ? (
          <a href={`/fundamentals/${prev.id}`} className="pager-prev">
            <small>&larr; {prev.num}</small>
            <strong>{prev.title}</strong>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={`/fundamentals/${next.id}`} className="pager-next">
            <small>{next.num} &rarr;</small>
            <strong>{next.title}</strong>
          </a>
        ) : (
          <a href="/study" className="pager-next">
            <small>Next &rarr;</small>
            <strong>Go to Study</strong>
          </a>
        )}
      </nav>

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
