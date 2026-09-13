'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { PenLine, Volume2, X } from 'lucide-react';
import HanziWriter from 'hanzi-writer';

import { loadCharData } from '@/lib/hanzi-data';
import { ALL_CHARACTERS, findCombo } from '@/lib/floating-characters';
import { useHomepageFx, type HomepageFxSettings } from '@/lib/use-homepage-fx';
import { StrokePractice } from '@/components/stroke-practice';
import type { Flashcard } from '@/lib/pathways';

const TOPBAR_HEIGHT = 76;
const FOOTER_HEIGHT = 96;
const MARGIN = 32;
const DRAG_THRESHOLD = 6;
const MERGE_DISTANCE = 70;
const MERGE_TWEEN_MS = 260;
const POP_MS = 280;
const TOAST_MS = 2600;

const DENSITY_COUNT: Record<HomepageFxSettings['density'], number> = {
  few: 12,
  some: 24,
  many: 42,
};

const SPEED_FACTOR: Record<HomepageFxSettings['speed'], number> = {
  slow: 0.5,
  normal: 1,
  fast: 1.9,
};

type Item = { id: number; card: Flashcard };

type Physics = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  frozen: boolean;
  merge: { targetX: number; targetY: number; start: number } | null;
};

type Bounds = { left: number; right: number; top: number; bottom: number };

type DragState = {
  id: number;
  pointerId: number;
  moved: boolean;
  lastX: number;
  lastY: number;
  lastT: number;
  vx: number;
  vy: number;
} | null;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickCharacter(exclude: Set<string>): Flashcard {
  const pool = ALL_CHARACTERS.filter((c) => !exclude.has(c.hanzi));
  const from = pool.length ? pool : ALL_CHARACTERS;
  return from[Math.floor(Math.random() * from.length)];
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 0.75;
  window.speechSynthesis.speak(utterance);
}

function computeBounds(): Bounds {
  return {
    left: MARGIN,
    right: Math.max(MARGIN + 1, window.innerWidth - MARGIN),
    top: TOPBAR_HEIGHT + MARGIN,
    bottom: Math.max(
      TOPBAR_HEIGHT + MARGIN + 1,
      window.innerHeight - FOOTER_HEIGHT - MARGIN,
    ),
  };
}

/** Ambient, interactive Chinese characters drifting across the homepage
 * hero. Hover, click, and drag behavior are all configurable from Settings >
 * Display > Aesthetics > Homepage; the character pool and word combos are
 * derived from the real vocabulary data, not a hand-picked list. */
export function FloatingCharactersBg() {
  const [settings] = useHomepageFx();
  const [items, setItems] = useState<Item[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [poppingId, setPoppingId] = useState<number | null>(null);
  const [flashcardId, setFlashcardId] = useState<number | null>(null);
  const [flashcardAnchor, setFlashcardAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [practiceCard, setPracticeCard] = useState<Flashcard | null>(null);
  const [toast, setToast] = useState<{
    x: number;
    y: number;
    a: Flashcard;
    b: Flashcard;
    word: Flashcard;
  } | null>(null);

  const physicsRef = useRef<Map<number, Physics>>(new Map());
  const elsRef = useRef<Map<number, HTMLButtonElement>>(new Map());
  const boundsRef = useRef<Bounds>({ left: 0, right: 0, top: 0, bottom: 0 });
  const dragRef = useRef<DragState>(null);
  const nextId = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);
  const settingsRef = useRef(settings);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const applyTransform = useCallback((id: number) => {
    const el = elsRef.current.get(id);
    const physics = physicsRef.current.get(id);
    if (!el || !physics) return;
    el.style.transform = `translate3d(${physics.x}px, ${physics.y}px, 0) translate(-50%, -50%)`;
  }, []);

  const spawnItem = useCallback(
    (exclude: Set<string>, existingId?: number): Item => {
      const bounds = boundsRef.current;
      const card = pickCharacter(exclude);
      const id = existingId ?? nextId.current++;
      const x = randomBetween(bounds.left, bounds.right);
      const y = randomBetween(bounds.top, bounds.bottom);
      const angle = Math.random() * Math.PI * 2;
      const speed = randomBetween(6, 16);
      physicsRef.current.set(id, {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        frozen: false,
        merge: null,
      });
      return { id, card };
    },
    [],
  );

  // Mount: seed the field, track viewport bounds, respect reduced-motion,
  // and run the drift animation loop. Runs client-only so server and client
  // markup match (positions are random). The initial setItems call happens
  // inside the rAF callback below rather than as a bare effect-body
  // statement, matching this codebase's pattern for effect-driven state.
  useEffect(() => {
    boundsRef.current = computeBounds();
    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const isNarrow = window.innerWidth < 640;
    const count = Math.max(
      4,
      Math.round(
        DENSITY_COUNT[settingsRef.current.density] * (isNarrow ? 0.5 : 1),
      ),
    );
    const used = new Set<string>();
    const seeded: Item[] = [];
    for (let i = 0; i < count; i++) {
      const item = spawnItem(used);
      used.add(item.card.hanzi);
      seeded.push(item);
    }
    const seedFrame = requestAnimationFrame(() => setItems(seeded));

    const onResize = () => {
      boundsRef.current = computeBounds();
    };
    window.addEventListener('resize', onResize);

    lastFrameRef.current = performance.now();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;
      const bounds = boundsRef.current;
      const speedFactor = SPEED_FACTOR[settingsRef.current.speed];

      if (!reducedMotionRef.current) {
        for (const [id, physics] of physicsRef.current) {
          if (physics.frozen) continue;
          if (physics.merge) {
            const progress = Math.min(
              1,
              (now - physics.merge.start) / MERGE_TWEEN_MS,
            );
            physics.x =
              physics.x + (physics.merge.targetX - physics.x) * progress;
            physics.y =
              physics.y + (physics.merge.targetY - physics.y) * progress;
            if (progress >= 1) physics.frozen = true;
            applyTransform(id);
            continue;
          }
          if (dragRef.current?.id === id) continue;

          physics.vx += randomBetween(-14, 14) * dt;
          physics.vy += randomBetween(-14, 14) * dt;
          const speed = Math.hypot(physics.vx, physics.vy);
          const maxSpeed = 26 * speedFactor;
          if (speed > maxSpeed) {
            physics.vx = (physics.vx / speed) * maxSpeed;
            physics.vy = (physics.vy / speed) * maxSpeed;
          }
          physics.x += physics.vx * speedFactor * dt;
          physics.y += physics.vy * speedFactor * dt;

          if (physics.x < bounds.left) {
            physics.x = bounds.left;
            physics.vx = Math.abs(physics.vx);
          } else if (physics.x > bounds.right) {
            physics.x = bounds.right;
            physics.vx = -Math.abs(physics.vx);
          }
          if (physics.y < bounds.top) {
            physics.y = bounds.top;
            physics.vy = Math.abs(physics.vy);
          } else if (physics.y > bounds.bottom) {
            physics.y = bounds.bottom;
            physics.vy = -Math.abs(physics.vy);
          }
        }

        // Gentle separation so characters do not pile on top of each other.
        const entries = [...physicsRef.current.entries()];
        for (let i = 0; i < entries.length; i++) {
          const [idA, a] = entries[i];
          if (a.merge || dragRef.current?.id === idA) continue;
          for (let j = i + 1; j < entries.length; j++) {
            const [idB, b] = entries[j];
            if (b.merge || dragRef.current?.id === idB) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 1;
            const minDist = 46;
            if (dist < minDist) {
              const push = ((minDist - dist) / minDist) * 6 * dt * 60;
              const nx = dx / dist;
              const ny = dy / dist;
              a.x -= nx * push;
              a.y -= ny * push;
              b.x += nx * push;
              b.y += ny * push;
            }
          }
        }

        for (const id of physicsRef.current.keys()) applyTransform(id);
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(seedFrame);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyTransform, spawnItem]);

  const respawn = useCallback(
    (ids: number[]) => {
      setItems((current) => {
        const inUse = new Set(current.map((item) => item.card.hanzi));
        const next = current.map((item) => {
          if (!ids.includes(item.id)) return item;
          inUse.delete(item.card.hanzi);
          const spawned = spawnItem(inUse, item.id);
          inUse.add(spawned.card.hanzi);
          return spawned;
        });
        return next;
      });
    },
    [spawnItem],
  );

  const triggerPop = useCallback(
    (id: number) => {
      setPoppingId(id);
      window.setTimeout(() => {
        setPoppingId(null);
        respawn([id]);
      }, POP_MS);
    },
    [respawn],
  );

  const triggerCombine = useCallback(
    (idA: number, idB: number, cardA: Flashcard, cardB: Flashcard) => {
      const physicsA = physicsRef.current.get(idA);
      const physicsB = physicsRef.current.get(idB);
      const word = findCombo(cardA.hanzi, cardB.hanzi);
      if (!physicsA || !physicsB || !word) return;
      const midX = (physicsA.x + physicsB.x) / 2;
      const midY = (physicsA.y + physicsB.y) / 2;
      const now = performance.now();
      physicsA.merge = { targetX: midX - 14, targetY: midY, start: now };
      physicsB.merge = { targetX: midX + 14, targetY: midY, start: now };
      physicsA.frozen = false;
      physicsB.frozen = false;
      setToast({ x: midX, y: midY, a: cardA, b: cardB, word });
      window.setTimeout(() => {
        setToast(null);
        const a = physicsRef.current.get(idA);
        const b = physicsRef.current.get(idB);
        if (a) {
          a.merge = null;
          a.frozen = false;
        }
        if (b) {
          b.merge = null;
          b.frozen = false;
        }
        respawn([idA, idB]);
      }, MERGE_TWEEN_MS + TOAST_MS);
    },
    [respawn],
  );

  const runClick = useCallback(
    (item: Item) => {
      if (settingsRef.current.click === 'pop') {
        triggerPop(item.id);
      } else {
        const physics = physicsRef.current.get(item.id);
        if (physics) {
          physics.frozen = true;
          setFlashcardAnchor({ x: physics.x, y: physics.y });
        }
        setFlashcardId(item.id);
      }
    },
    [triggerPop],
  );

  const closeFlashcard = useCallback(() => {
    if (flashcardId !== null) {
      const physics = physicsRef.current.get(flashcardId);
      if (physics) physics.frozen = false;
    }
    setFlashcardId(null);
    setFlashcardAnchor(null);
  }, [flashcardId]);

  const onPointerDown = useCallback(
    (item: Item, event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== undefined && event.button !== 0) return;
      const physics = physicsRef.current.get(item.id);
      if (!physics || physics.merge) return;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Capture can fail for some input sources; the click/drag logic
        // below does not depend on it succeeding.
      }
      dragRef.current = {
        id: item.id,
        pointerId: event.pointerId,
        moved: false,
        lastX: event.clientX,
        lastY: event.clientY,
        lastT: performance.now(),
        vx: 0,
        vy: 0,
      };
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const physics = physicsRef.current.get(drag.id);
      if (!physics) return;
      const dx = event.clientX - drag.lastX;
      const dy = event.clientY - drag.lastY;
      if (
        !drag.moved &&
        Math.hypot(event.clientX - drag.lastX, event.clientY - drag.lastY) <
          DRAG_THRESHOLD
      ) {
        // still deciding whether this is a click or a drag
      }
      if (Math.abs(dx) + Math.abs(dy) > 0) drag.moved = true;
      const now = performance.now();
      const dt = Math.max(1, now - drag.lastT);
      drag.vx = (dx / dt) * 16;
      drag.vy = (dy / dt) * 16;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = now;

      const bounds = boundsRef.current;
      physics.x = Math.min(bounds.right, Math.max(bounds.left, physics.x + dx));
      physics.y = Math.min(bounds.bottom, Math.max(bounds.top, physics.y + dy));
      applyTransform(drag.id);
    },
    [applyTransform],
  );

  const onPointerUp = useCallback(
    (item: Item, event: React.PointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (!drag.moved) {
        runClick(item);
        return;
      }

      const physics = physicsRef.current.get(item.id);
      if (!physics) return;

      if (settingsRef.current.drag === 'combine') {
        let nearestId: number | null = null;
        let nearestDist = MERGE_DISTANCE;
        let nearestCard: Flashcard | null = null;
        for (const other of items) {
          if (other.id === item.id) continue;
          const otherPhysics = physicsRef.current.get(other.id);
          if (!otherPhysics || otherPhysics.merge) continue;
          const dist = Math.hypot(
            otherPhysics.x - physics.x,
            otherPhysics.y - physics.y,
          );
          if (dist < nearestDist && findCombo(item.card.hanzi, other.card.hanzi)) {
            nearestDist = dist;
            nearestId = other.id;
            nearestCard = other.card;
          }
        }
        if (nearestId !== null && nearestCard) {
          triggerCombine(item.id, nearestId, item.card, nearestCard);
          return;
        }
      }

      physics.vx = Math.max(-40, Math.min(40, drag.vx));
      physics.vy = Math.max(-40, Math.min(40, drag.vy));
    },
    [items, runClick, triggerCombine],
  );

  const openPractice = useCallback((card: Flashcard) => {
    setPracticeCard(card);
  }, []);

  const handleHoverStart = useCallback((id: number) => {
    setHoveredId(id);
  }, []);

  const handleHoverEnd = useCallback((id: number) => {
    setHoveredId((current) => (current === id ? null : current));
  }, []);

  const registerEl = useCallback(
    (id: number, el: HTMLButtonElement | null) => {
      if (el) {
        elsRef.current.set(id, el);
        applyTransform(id);
      } else {
        elsRef.current.delete(id);
      }
    },
    [applyTransform],
  );

  if (!settings.enabled) return null;

  const flashcardItem = items.find((item) => item.id === flashcardId) ?? null;

  return (
    <div className="floating-field" aria-hidden={false}>
      {items.map((item) => (
        <FloatingCharacter
          key={item.id}
          item={item}
          hoverMode={settings.hover}
          hovered={hoveredId === item.id}
          popping={poppingId === item.id}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyActivate={runClick}
          registerEl={registerEl}
        />
      ))}

      {toast ? (
        <div
          className="floating-toast"
          style={{ left: toast.x, top: toast.y }}
        >
          <span lang="zh-Hant">{toast.word.hanzi}</span>
          <strong>{toast.word.pinyin}</strong>
          <em>{toast.word.meaning}</em>
        </div>
      ) : null}

      {flashcardItem && flashcardAnchor ? (
        <div
          className="floating-popover"
          style={{
            left: Math.min(
              window.innerWidth - 20,
              Math.max(20, flashcardAnchor.x),
            ),
            top: Math.min(
              window.innerHeight - 20,
              Math.max(20, flashcardAnchor.y),
            ),
          }}
        >
          <button
            type="button"
            className="floating-popover-close"
            onClick={closeFlashcard}
            aria-label="Close"
          >
            <X aria-hidden="true" />
          </button>
          <strong lang="zh-Hant">{flashcardItem.card.hanzi}</strong>
          <span>{flashcardItem.card.pinyin}</span>
          <p>{flashcardItem.card.meaning}</p>
          <div className="floating-popover-actions">
            <button
              type="button"
              onClick={() => speak(flashcardItem.card.hanzi)}
            >
              <Volume2 aria-hidden="true" /> Hear it
            </button>
            <button
              type="button"
              onClick={() => openPractice(flashcardItem.card)}
            >
              <PenLine aria-hidden="true" /> Practice writing
            </button>
          </div>
        </div>
      ) : null}

      {practiceCard ? (
        <StrokePractice
          hanzi={practiceCard.hanzi}
          meaning={practiceCard.meaning}
          onClose={() => setPracticeCard(null)}
        />
      ) : null}
    </div>
  );
}

const FloatingCharacter = memo(function FloatingCharacter({
  item,
  hoverMode,
  hovered,
  popping,
  onHoverStart,
  onHoverEnd,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyActivate,
  registerEl,
}: {
  item: Item;
  hoverMode: HomepageFxSettings['hover'];
  hovered: boolean;
  popping: boolean;
  onHoverStart: (id: number) => void;
  onHoverEnd: (id: number) => void;
  onPointerDown: (item: Item, event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (item: Item, event: React.PointerEvent<HTMLButtonElement>) => void;
  onKeyActivate: (item: Item) => void;
  registerEl: (id: number, el: HTMLButtonElement | null) => void;
}) {
  const writerMountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hovered || hoverMode !== 'stroke') return;
    const el = writerMountRef.current;
    if (!el) return;
    el.innerHTML = '';
    let cancelled = false;
    const writer = HanziWriter.create(el, item.card.hanzi, {
      width: 56,
      height: 56,
      padding: 4,
      showOutline: true,
      strokeAnimationSpeed: 1.4,
      delayBetweenStrokes: 200,
      strokeColor: '#19302a',
      outlineColor: '#d9d4c3',
      charDataLoader: loadCharData,
    });
    void writer.animateCharacter();
    return () => {
      cancelled = true;
      if (!cancelled) writer.cancelQuiz();
      el.innerHTML = '';
    };
  }, [hovered, hoverMode, item.card.hanzi]);

  return (
    <button
      type="button"
      ref={(el) => registerEl(item.id, el)}
      className={`floating-char${hovered ? ' is-hovered' : ''}${popping ? ' is-popping' : ''}`}
      aria-label={`${item.card.hanzi}, ${item.card.pinyin}, ${item.card.meaning}`}
      onPointerEnter={() => onHoverStart(item.id)}
      onPointerLeave={() => onHoverEnd(item.id)}
      onPointerDown={(event) => onPointerDown(item, event)}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => onPointerUp(item, event)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onKeyActivate(item);
        }
      }}
    >
      {hovered && hoverMode === 'stroke' ? (
        <span className="floating-char-writer" ref={writerMountRef} />
      ) : (
        <span lang="zh-Hant">{item.card.hanzi}</span>
      )}
      {hovered && hoverMode === 'glow' ? (
        <small>
          {item.card.pinyin} · {item.card.meaning}
        </small>
      ) : null}
      {popping ? (
        <i className="floating-burst" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              style={{ '--angle': `${index * 60}deg` } as React.CSSProperties}
            />
          ))}
        </i>
      ) : null}
    </button>
  );
});
