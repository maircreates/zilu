'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Search, X } from 'lucide-react';

import { searchEntries } from '@/lib/search-index';

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

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchEntries(query), [query]);
  const active = results.length ? Math.min(activeIndex, results.length - 1) : 0;

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  // "/" or Cmd/Ctrl+K to open; a custom event from the topbar buttons.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
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
  }, []);

  // Drive the native <dialog>, which gives us the backdrop, Escape-to-close,
  // focus handling and scroll lock for free.
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
      setActiveIndex((index) =>
        results.length ? (index + 1) % results.length : 0,
      );
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === 'Enter') {
      const hit = results[active];
      if (hit) window.location.assign(hit.href);
    }
  }

  const trimmed = query.trim();

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
            className="search-input"
            placeholder="Search a word, pinyin, meaning, or grammar point"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
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

        <div className="search-results" ref={listRef}>
          {trimmed.length === 0 && (
            <p className="search-empty">
              Type Chinese (<span lang="zh-Hant">好</span>), pinyin (
              <code>hao</code> or <code>hao3</code>), or English.
            </p>
          )}
          {trimmed.length > 0 && results.length === 0 && (
            <p className="search-empty">
              No matches. Try pinyin without tones, a single character, or an
              English word.
            </p>
          )}
          {results.map((hit, index) => (
            <a
              key={`${hit.href}-${index}`}
              href={hit.href}
              className="search-result"
              data-active={index === active ? 'true' : undefined}
              onMouseMove={() => setActiveIndex(index)}
              onClick={close}
            >
              <span className="search-result-line">
                <span
                  className={
                    hit.kind === 'vocab' ? 'search-hanzi' : 'search-gtitle'
                  }
                  lang={hit.kind === 'vocab' ? 'zh-Hant' : undefined}
                >
                  {hit.primary}
                </span>
                {hit.secondary && (
                  <span className="search-py">{hit.secondary}</span>
                )}
              </span>
              <span className="search-result-sub">
                {hit.tertiary} · {hit.location}
              </span>
            </a>
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
            open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </dialog>
  );
}
