'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, RotateCcw, X } from 'lucide-react';
import HanziWriter, { type CharacterJson } from 'hanzi-writer';

const HAN_CHAR = /\p{Script=Han}/u;

/** ZiLu hosts stroke data for every vocabulary character under
 * /hanzi-data/<char>.json (from the hanzi-writer-data project). Anything not
 * in that set -- a rarer character in a grammar example, say -- falls back to
 * the same dataset's public CDN mirror. */
async function loadCharData(char: string): Promise<CharacterJson> {
  try {
    const local = await fetch(`/hanzi-data/${encodeURIComponent(char)}.json`);
    if (local.ok) return (await local.json()) as CharacterJson;
  } catch {
    // fall through to the CDN mirror
  }
  const cdn = await fetch(
    `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`,
  );
  if (!cdn.ok) throw new Error(`No stroke data for ${char}`);
  return (await cdn.json()) as CharacterJson;
}

type Speed = 'slow' | 'normal' | 'fast';

const SPEED_OPTIONS: { id: Speed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
];

// HanziWriter's own defaults are strokeAnimationSpeed: 1, delayBetweenStrokes:
// 1000 -- that is "normal" here.
const SPEED_SETTINGS: Record<
  Speed,
  { strokeAnimationSpeed: number; delayBetweenStrokes: number }
> = {
  slow: { strokeAnimationSpeed: 0.5, delayBetweenStrokes: 1300 },
  normal: { strokeAnimationSpeed: 1, delayBetweenStrokes: 1000 },
  fast: { strokeAnimationSpeed: 2.5, delayBetweenStrokes: 350 },
};

type CharState = 'active' | 'done' | 'error';

function CharacterPractice({ char, speed }: { char: string; speed: Speed }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [state, setState] = useState<CharState>('active');
  const [mistakes, setMistakes] = useState(0);

  const startQuiz = useCallback(() => {
    const writer = writerRef.current;
    if (!writer) return;
    setMistakes(0);
    setState('active');
    void writer.quiz({
      onMistake: () => setMistakes((count) => count + 1),
      onComplete: () => setState('done'),
    });
  }, []);

  const showMe = useCallback(() => {
    const writer = writerRef.current;
    if (!writer) return;
    writer.cancelQuiz();
    void writer.animateCharacter({ onComplete: startQuiz });
  }, [startQuiz]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    el.innerHTML = '';
    let cancelled = false;

    const writer = HanziWriter.create(el, char, {
      width: 150,
      height: 150,
      padding: 10,
      showOutline: true,
      showCharacter: false,
      strokeColor: '#19302a',
      outlineColor: '#d9d4c3',
      highlightColor: '#ef765d',
      drawingColor: '#bc4938',
      ...SPEED_SETTINGS[speed],
      charDataLoader: loadCharData,
      onLoadCharDataError: () => {
        if (!cancelled) setState('error');
      },
    });
    writerRef.current = writer;
    void writer.quiz({
      onMistake: () => {
        if (!cancelled) setMistakes((count) => count + 1);
      },
      onComplete: () => {
        if (!cancelled) setState('done');
      },
    });

    return () => {
      cancelled = true;
      writer.cancelQuiz();
      writerRef.current = null;
      el.innerHTML = '';
    };
  }, [char, speed]);

  return (
    <div className="stroke-char">
      <div ref={mountRef} className="stroke-canvas" />
      {state === 'error' ? (
        <p className="stroke-char-status">No stroke data for this character.</p>
      ) : (
        <div className="stroke-char-controls">
          <button
            type="button"
            onClick={showMe}
            aria-label={`Show how to write ${char}`}
          >
            <Eye aria-hidden="true" /> Show me
          </button>
          <button
            type="button"
            onClick={startQuiz}
            aria-label={`Try ${char} again`}
          >
            <RotateCcw aria-hidden="true" /> Try again
          </button>
          <span className="stroke-char-status">
            {state === 'done'
              ? mistakes === 0
                ? 'Perfect!'
                : `Done -- ${mistakes} miss${mistakes === 1 ? '' : 'es'}`
              : mistakes > 0
                ? `${mistakes} miss${mistakes === 1 ? '' : 'es'} so far`
                : ''}
          </span>
        </div>
      )}
    </div>
  );
}

export function StrokePractice({
  hanzi,
  meaning,
  onClose,
}: {
  hanzi: string;
  meaning: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [speed, setSpeed] = useState<Speed>('normal');
  // oxlint-disable-next-line typescript/no-misused-spread -- Traditional characters here are single code points, no combining marks
  const chars = [...hanzi].filter((ch) => HAN_CHAR.test(ch));

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="stroke-dialog"
      aria-label={`Practice writing ${hanzi}`}
      onClose={onClose}
    >
      <button
        type="button"
        className="search-backdrop"
        aria-label="Close writing practice"
        onClick={close}
      />
      <div className="stroke-panel">
        <div className="stroke-panel-head">
          <div>
            <strong lang="zh-Hant">{hanzi}</strong>
            <span>{meaning}</span>
          </div>
          <button
            type="button"
            className="search-close"
            onClick={close}
            aria-label="Close"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <p className="stroke-hint">
          Trace each character in its box. Miss a few times and the next stroke
          lights up to help.
        </p>
        <fieldset className="stroke-speed">
          <legend className="sr-only">Demo animation speed</legend>
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === speed ? 'active' : ''}
              onClick={() => setSpeed(option.id)}
              aria-pressed={option.id === speed}
            >
              {option.label}
            </button>
          ))}
        </fieldset>
        <div className="stroke-chars">
          {chars.map((char, index) => (
            <CharacterPractice
              key={`${char}-${index}`}
              char={char}
              speed={speed}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
}
