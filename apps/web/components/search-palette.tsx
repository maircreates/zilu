'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CornerDownLeft, Search, Volume2, X } from 'lucide-react';

import { searchEntries, type SearchResult } from '@/lib/search-index';

function emphasise(text: string, needle: string | undefined) {
  if (!needle) return text;
  const at = text.toLowerCase().indexOf(needle.toLowerCase());
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark className="search-mark">{text.slice(at, at + needle.length)}</mark>
      {text.slice(at + needle.length)}
    </>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  );
}

function ResultPreview({
  hit,
  onSpeak,
  onNavigate,
}: {
  hit: SearchResult;
  onSpeak: (text: string) => void;
  onNavigate: () => void;
}) {
  if (hit.kind === 'grammar') {
    return (
      <div className="search-preview">
        {hit.template && (
          <p className="search-preview-template">{hit.template}</p>
        )}
        {hit.why && <p className="search-preview-note">{hit.why}</p>}
        {hit.example && (
          <div className="search-preview-example">
            <button
              type="button"
              className="search-speak-icon"
              onClick={() => onSpeak(hit.example!.hanzi)}
              aria-label={`Hear ${hit.example.hanzi} pronounced`}
            >
              <Volume2 aria-hidden="true" />
            </button>
            <span lang="zh-Hant" className="search-preview-ex-hanzi">
              {hit.example.hanzi}
            </span>
            <span className="search-py">{hit.example.pinyin}</span>
            <span className="search-preview-ex-en">{hit.example.english}</span>
          </div>
        )}
        <a href={hit.href} className="search-open" onClick={onNavigate}>
          Open in Grammar <ArrowRight aria-hidden="true" />
        </a>
      </div>
    );
  }

  if (hit.primaryIsHanzi) {
    return (
      <div className="search-preview">
        <div className="search-preview-card">
          <span lang="zh-Hant" className="search-preview-hanzi">
            {hit.primary}
          </span>
          {hit.secondary && (
            <span className="search-preview-py">{hit.secondary}</span>
          )}
          <span className="search-preview-meaning">{hit.tertiary}</span>
        </div>
        <div className="search-preview-actions">
          <button
            type="button"
            className="search-speak"
            onClick={() => onSpeak(hit.primary)}
          >
            <Volume2 aria-hidden="true" /> Hear it
          </button>
          <a href={hit.href} className="search-open" onClick={onNavigate}>
            Open in {hit.kind === 'vocab' ? 'Study' : 'Fundamentals'}{' '}
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="search-preview">
      {hit.note && <p className="search-preview-note">{hit.note}</p>}
      <a href={hit.href} className="search-open" onClick={onNavigate}>
        Open in Fundamentals <ArrowRight aria-hidden="true" />
      </a>
    </div>
  );
}

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchEntries(query), [query]);
  const active = results.length ? Math.min(activeIndex, results.length - 1) : 0;

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    setPreviewIndex(null);
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.75;
    window.speechSynthesis.speak(utterance);
  }, []);

  const togglePreview = useCallback((index: number) => {
    setActiveIndex(index);
    setPreviewIndex((current) => (current === index ? null : index));
  }, []);

  // "/" or Cmd/Ctrl+K to open, Escape to close; a custom event from the
  // topbar buttons opens it too.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      const cmdK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (cmdK) {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('zilu:search', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('zilu:search', onOpenEvent);
    };
  }, [close]);

  // Drive the native <dialog>, which gives us the backdrop, focus handling
  // and scroll lock for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector('[data-active="true"]');
    node?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setPreviewIndex(null);
      setActiveIndex((index) =>
        results.length ? (index + 1) % results.length : 0,
      );
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setPreviewIndex(null);
      setActiveIndex((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (results[active]) togglePreview(active);
    }
  }

  const trimmed = query.trim();
  const activeId = results.length ? `search-option-${active}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-label="Search ZiLu"
      onClose={close}
    >
      <button
        type="button"
        className="search-backdrop"
        aria-label="Close search"
        onClick={close}
      />
      <div className="search-panel">
        <div className="search-input-row">
          <Search aria-hidden="true" className="search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-haspopup="listbox"
            aria-controls="search-listbox"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            className="search-input"
            placeholder="Search a word, pinyin, meaning, or grammar point"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
              setPreviewIndex(null);
            }}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="search-close"
            onClick={close}
            aria-label="Close"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {trimmed.length === 0
            ? ''
            : results.length === 0
              ? 'No results'
              : `${results.length} result${results.length === 1 ? '' : 's'}`}
        </p>

        <div
          className="search-results"
          ref={listRef}
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- no plain tag can render rich, styled results
          role="listbox"
          id="search-listbox"
          aria-label="Search results"
        >
          {trimmed.length === 0 && (
            <p className="search-empty">
              Type Chinese (<span lang="zh-Hant">好</span>), pinyin (
              <code>hao</code> or <code>hao3</code>), or English. Also searches
              Grammar and Fundamentals.
            </p>
          )}
          {trimmed.length > 0 && results.length === 0 && (
            <p className="search-empty">
              No matches. Search one word at a time, try pinyin without tones,
              or type the character itself.
            </p>
          )}
          {results.map((hit, index) => (
            <div key={`${hit.href}-${index}`} className="search-result-wrap">
              <button
                type="button"
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- no plain tag can render rich, styled results
                role="option"
                id={`search-option-${index}`}
                aria-selected={index === active}
                className="search-result"
                data-active={index === active ? 'true' : undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => togglePreview(index)}
              >
                <span className="search-result-line">
                  <span
                    className={
                      hit.kind === 'vocab' || hit.primaryIsHanzi
                        ? 'search-hanzi'
                        : 'search-gtitle'
                    }
                    lang={hit.primaryIsHanzi ? 'zh-Hant' : undefined}
                  >
                    {emphasise(hit.primary, hit.match.primary)}
                  </span>
                  {hit.secondary && (
                    <span className="search-py">
                      {emphasise(hit.secondary, hit.match.secondary)}
                    </span>
                  )}
                </span>
                <span className="search-result-sub">
                  {emphasise(hit.tertiary, hit.match.tertiary)} · {hit.location}
                </span>
              </button>
              {previewIndex === index && (
                <ResultPreview hit={hit} onSpeak={speak} onNavigate={close} />
              )}
            </div>
          ))}
        </div>

        <div className="search-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>
              <CornerDownLeft aria-hidden="true" />
            </kbd>{' '}
            preview
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </dialog>
  );
}
