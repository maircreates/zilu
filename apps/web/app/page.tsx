'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, Moon, RotateCcw, Sparkles, Sun, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AmbientBackground } from '@/components/ambient-background';
import { Switch } from '@/components/ui/switch';

const steps = [
  {
    eyebrow: 'Step 1 · Meet it',
    title: 'This means “hello.”',
    body: 'You do not need to memorize anything yet. First, get comfortable seeing the phrase.',
  },
  {
    eyebrow: 'Step 2 · Hear it',
    title: 'Listen for two syllables.',
    body: 'Tap the sound button. Say it once, slowly: nǐ · hǎo. Your browser supplies the voice.',
  },
  {
    eyebrow: 'Step 3 · Notice it',
    title: 'Tone marks guide your voice.',
    body: 'The marks show two third tones. In natural speech, the first syllable rises—more like ní hǎo. That change is normal.',
  },
  {
    eyebrow: 'Step 4 · Recall it',
    title: 'Can you remember the meaning?',
    body: 'Hide the help, look at the Chinese, and say the meaning to yourself. Then check your answer.',
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [speechStatus, setSpeechStatus] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechStatus('Speech is not available in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('你好');
    utterance.lang = 'zh-TW';
    utterance.rate = 0.72;
    utterance.onstart = () => setSpeechStatus('Playing: nǐ hǎo');
    utterance.onend = () => setSpeechStatus('');
    utterance.onerror = () => setSpeechStatus('A Chinese voice is not installed on this device.');
    window.speechSynthesis.speak(utterance);
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    setSpeechStatus('');
    if (nextStep === 3) {
      setShowMeaning(false);
      setShowPinyin(false);
    } else if (nextStep === 0) {
      setShowMeaning(true);
      setShowPinyin(true);
    }
  };

  return (
    <main className="zilu-shell min-h-screen bg-background text-foreground" data-theme={darkMode ? 'dark' : 'light'}>
      <header className="zilu-header border-b">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a className="flex items-center gap-3" href="#top" aria-label="ZiLu home">
            <span className="grid size-10 place-items-center rounded-full bg-[#b9f6c9] font-serif text-xl font-semibold text-[#0b1f25]">字</span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">ZiLu</span>
              <span className="brand-subtitle block text-[10px] uppercase tracking-[0.23em]">Your path into Chinese</span>
            </span>
          </a>
          <div className="header-meta flex items-center gap-2 text-xs">
            <span className="hidden sm:inline">Foundation path</span>
            <span aria-hidden="true" className="hidden text-white/25 sm:inline">/</span>
            <span className="theme-pill rounded-full px-3 py-1.5">Lesson 01</span>
          </div>
        </div>
      </header>

      <section id="top" className="kinetic-hero relative overflow-hidden">
        <AmbientBackground mode={darkMode ? 'dark' : 'light'} />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-12 sm:px-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(560px,1.25fr)] lg:px-12 lg:pb-20 lg:pt-16">
          <div className="relative z-10 flex flex-col justify-between py-2">
            <div>
              <div className="hero-badge mb-7 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
                <Sparkles className="size-3.5" /> Start with zero Chinese
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Your first Chinese phrase, one calm step at a time.
              </h1>
              <p className="hero-muted mt-6 max-w-lg text-base leading-7 sm:text-lg">
                No characters to memorize. No grammar terms. Just one useful greeting—and the help you need exactly when you need it.
              </p>
            </div>
            <div className="hero-step-labels mt-10 grid max-w-md grid-cols-3 gap-3 border-t pt-6 text-xs lg:mt-16">
              <span>See it</span><span>Hear it</span><span>Remember it</span>
            </div>
          </div>

          <section aria-labelledby="lesson-heading" className="lesson-panel relative z-10 overflow-hidden rounded-[2rem] bg-[#f7f3e8] text-[#10292f] shadow-[0_32px_80px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between border-b border-[#10292f]/10 px-5 py-4 sm:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#52686d]">Your progress</p>
                <p className="mt-1 text-sm font-medium">{steps[step].eyebrow}</p>
              </div>
              <span className="font-mono text-xs text-[#52686d]">{step + 1} / {steps.length}</span>
            </div>
            <div className="h-1 bg-[#10292f]/8">
              <div className="h-full bg-[#2dcb78] transition-[width] duration-500 ease-out" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </div>

            <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8">
              <div className="grid gap-7 sm:grid-cols-[1fr_180px] sm:items-start">
                <div>
                  <h2 id="lesson-heading" className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{steps[step].title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#52686d] sm:text-base">{steps[step].body}</p>
                </div>
                <div className="rounded-2xl bg-[#10292f]/[0.055] px-4 py-3 text-xs leading-5 text-[#52686d]">
                  <strong className="block font-semibold text-[#10292f]">Good to know</strong>
                  Chinese characters carry meaning. Pinyin shows their pronunciation with the Latin alphabet.
                </div>
              </div>

              <div className="lesson-focus" aria-label="Traditional Chinese greeting 你好, pronounced nǐ hǎo, meaning hello">
                <p lang="zh-Hant" className="lesson-characters">你好</p>
                <div className="lesson-aids">
                  {showPinyin && <p className="lesson-pinyin">nǐ hǎo</p>}
                  {showMeaning && <p className="lesson-meaning">hello · hi</p>}
                </div>
                {step >= 2 && (
                  <p className="natural-speech-note">
                    <span>Natural speech</span>
                    The first syllable rises: <strong>ní hǎo</strong>
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button type="button" onClick={speak} className="h-11 rounded-full bg-[#10292f] px-5 text-[#f7f3e8] hover:bg-[#1d3b42]">
                  <Volume2 className="size-4" /> Hear it
                </Button>
                <Button type="button" variant="outline" aria-pressed={showPinyin} onClick={() => setShowPinyin((visible) => !visible)} className="h-11 rounded-full border-[#10292f]/15 bg-transparent px-4 hover:bg-[#10292f]/5">
                  <Eye className="size-4" /> {showPinyin ? 'Hide' : 'Show'} pinyin
                </Button>
                <Button type="button" variant="outline" aria-pressed={showMeaning} onClick={() => setShowMeaning((visible) => !visible)} className="h-11 rounded-full border-[#10292f]/15 bg-transparent px-4 hover:bg-[#10292f]/5">
                  <Eye className="size-4" /> {showMeaning ? 'Hide' : 'Show'} meaning
                </Button>
                <span aria-live="polite" className="ml-1 text-xs text-[#52686d]">{speechStatus}</span>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-[#10292f]/10 pt-5">
                <Button type="button" variant="ghost" disabled={step === 0} onClick={() => goToStep(step - 1)} className="h-11 rounded-full px-3 text-[#52686d] hover:bg-[#10292f]/5">
                  <ArrowLeft className="size-4" /> Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={() => goToStep(step + 1)} className="h-11 rounded-full bg-[#2dcb78] px-5 text-[#082219] hover:bg-[#59db91]">
                    Next small step <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={() => goToStep(0)} className="h-11 rounded-full bg-[#2dcb78] px-5 text-[#082219] hover:bg-[#59db91]">
                    <RotateCcw className="size-4" /> Practice again
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="zilu-summary px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d85b3f]">What you just learned</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">One phrase. Three kinds of understanding.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['01', 'Meaning', '你好 is a friendly greeting: hello or hi.'],
              ['02', 'Sound', 'Pinyin nǐ hǎo gives you a readable pronunciation guide.'],
              ['03', 'Writing', 'You recognized your first two Traditional Chinese characters.'],
            ].map(([number, title, text]) => (
              <article key={number} className="summary-card rounded-2xl border p-5">
                <span className="font-mono text-xs text-[#2d9160]">{number}</span>
                <h3 className="mt-8 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#52686d]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="zilu-footer px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t pt-6">
          <div className="footer-note flex items-center gap-3 text-xs">
            <span className="grid size-6 place-items-center rounded-full bg-[#2dcb78]/15 text-[#1b7f50]"><Check className="size-3.5" /></span>
            ZiLu keeps every learner-facing Chinese example in Traditional Chinese.
          </div>
          <fieldset className="mode-control">
            <legend className="sr-only">Appearance</legend>
            <Sun className="size-4" aria-hidden="true" />
            <span className="mode-label">Solar</span>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              aria-label="Use dark mode"
              className="theme-switch"
            />
            <Moon className="size-4" aria-hidden="true" />
            <span className="mode-label">Neon</span>
          </fieldset>
        </div>
      </footer>
    </main>
  );
}
