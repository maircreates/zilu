'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { PenLine, Volume2, X } from 'lucide-react';
import HanziWriter from 'hanzi-writer';

import { loadCharData } from '@/lib/hanzi-data';
import {
  ALL_CHARACTERS,
  WORD_COMBO_LIST,
  findCombo,
  type SourcedCard,
} from '@/lib/floating-characters';
import { useHomepageFx, type HomepageFxSettings } from '@/lib/use-homepage-fx';
import { StrokePractice } from '@/components/stroke-practice';

const TOPBAR_HEIGHT = 76;
const FOOTER_HEIGHT = 96;
const MARGIN = 32;
const MERGE_DISTANCE = 70;
const MERGE_TWEEN_MS = 260;
const POP_MS = 280;
const TOAST_MS = 2600;
const WALL_RESTITUTION = 0.92;
const COLLISION_RESTITUTION = 0.85;
const COLLISION_MIN_DIST = 46;
/** Below this release speed (px/s) a drag just settles into normal drift --
 * deliberately not too sensitive, so a slow/small drag never flings. */
const THROW_MIN_SPEED = 90;
const THROW_MAX_SPEED = 640;
/** A release always launches noticeably faster than the tracked drag speed
 * itself -- a real flick imparts a snap beyond what the hand's average
 * velocity captures, so without this the takeoff reads as weak/slow. */
const THROW_BOOST = 1.45;
const FLING_DAMPING = 0.965;
const IDLE_MS = 15000;
const IDLE_CHECK_MS = 3000;
/** How close the cursor has to be before a character starts curving away,
 * and how hard it pushes at zero distance (falls off linearly to 0 at the
 * radius). This is proximity, not contact -- it fires before you're even
 * hovering the character. */
const CURSOR_RADIUS = 110;
const CURSOR_FORCE = 430;
/** A hovered character keeps drifting (hover doesn't freeze it), so it can
 * end up drifting out from under a cursor that never itself moves. Browsers
 * only recompute pointerenter/pointerleave in response to real pointer
 * movement, not content moving underneath a still cursor -- so without this
 * check, the hover state (and the stroke-animation view it can switch to)
 * gets stuck forever once that happens, even carrying over to whatever
 * character later respawns into that same slot. Checked every tick instead. */
const HOVER_CLEAR_DISTANCE = 60;

const DENSITY_COUNT: Record<HomepageFxSettings['density'], number> = {
  normal: 100,
  many: 200,
  swarm: 400,
};

const SPEED_FACTOR: Record<HomepageFxSettings['speed'], number> = {
  slow: 0.5,
  normal: 1,
  fast: 1.9,
};

/** A quiet per-pathway tint (reusing the app's existing theme colors, so it
 * still adapts to whichever color theme is active) shown as a small dot
 * under each character -- a hint at which pathway teaches it, not a full
 * recolor. */
const PATHWAY_TINT: Record<number, string> = {
  1: 'var(--green)',
  2: 'var(--accent)',
  3: 'var(--accent-deep)',
};

type Item = { id: number; card: SourcedCard };

type Physics = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  frozen: boolean;
  merge: { targetX: number; targetY: number; start: number } | null;
  /** 0 (far/small/faint) to 1 (near/big/bold) -- cheap parallax depth. */
  depth: number;
  /** Random phase offset so the wobble isn't synchronized across items. */
  phase: number;
  /** Current wobble rotation in degrees, updated once per tick. */
  rotation: number;
  /** True right after a fast-enough throw; decays back to normal drift. */
  flinging: boolean;
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
  /** Exponential moving average of recent velocity, used at release so one
   * jittery final pointermove can't register as a throw by itself. */
  smoothVx: number;
  smoothVy: number;
} | null;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickCharacter(exclude: Set<string>): SourcedCard {
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
  const [practiceCard, setPracticeCard] = useState<SourcedCard | null>(null);
  const [toast, setToast] = useState<{
    x: number;
    y: number;
    a: SourcedCard;
    b: SourcedCard;
    word: SourcedCard;
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
  const itemsRef = useRef<Item[]>([]);
  const lastInteractionRef = useRef(0);
  const idleFiringRef = useRef(false);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const hoveredIdRef = useRef<number | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const applyTransform = useCallback((id: number) => {
    const el = elsRef.current.get(id);
    const physics = physicsRef.current.get(id);
    if (!el || !physics) return;
    const scale = 0.72 + physics.depth * 0.56;
    el.style.transform = `translate3d(${physics.x}px, ${physics.y}px, 0) translate(-50%, -50%) rotate(${physics.rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    el.style.setProperty(
      '--depth-opacity',
      (0.32 + physics.depth * 0.5).toFixed(3),
    );
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
        depth: Math.random(),
        phase: Math.random() * Math.PI * 2,
        rotation: 0,
        flinging: false,
      });
      return { id, card };
    },
    [],
  );

  // How many characters the current density + viewport width call for.
  // Read fresh every time it's invoked (not just once at mount) so it stays
  // correct across density changes and window resizes, and so a transient
  // bad window.innerWidth read at mount (e.g. before layout has settled)
  // doesn't permanently under-seed the field.
  const targetCount = useCallback(() => {
    const isNarrow = window.innerWidth < 640;
    return Math.max(
      4,
      Math.round(
        DENSITY_COUNT[settingsRef.current.density] * (isNarrow ? 0.5 : 1),
      ),
    );
  }, []);

  const adjustToTarget = useCallback(() => {
    boundsRef.current = computeBounds();
    const target = targetCount();
    setItems((current) => {
      if (current.length === target) return current;
      if (current.length > target) {
        for (const item of current.slice(target)) {
          physicsRef.current.delete(item.id);
          elsRef.current.delete(item.id);
        }
        return current.slice(0, target);
      }
      const used = new Set(current.map((it) => it.card.hanzi));
      const additions: Item[] = [];
      for (let i = current.length; i < target; i++) {
        const item = spawnItem(used);
        used.add(item.card.hanzi);
        additions.push(item);
      }
      return [...current, ...additions];
    });
  }, [spawnItem, targetCount]);

  // Seed on mount, and re-adjust (grow or shrink) whenever the density
  // setting or the viewport width crosses the narrow-screen threshold --
  // deferred via rAF/the resize listener rather than called bare in the
  // effect body, matching this codebase's pattern for effect-driven state.
  useEffect(() => {
    const frame = requestAnimationFrame(adjustToTarget);
    window.addEventListener('resize', adjustToTarget);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', adjustToTarget);
    };
  }, [settings.density, adjustToTarget]);

  // Mount: track viewport bounds, respect reduced-motion, and run the drift
  // animation loop. Runs client-only so server and client markup match.
  useEffect(() => {
    boundsRef.current = computeBounds();
    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    lastInteractionRef.current = performance.now();

    const onResize = () => {
      boundsRef.current = computeBounds();
    };
    window.addEventListener('resize', onResize);

    const onWindowPointerMove = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    const onWindowPointerLeave = () => {
      mouseRef.current = null;
    };
    window.addEventListener('pointermove', onWindowPointerMove);
    document.documentElement.addEventListener(
      'pointerleave',
      onWindowPointerLeave,
    );

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

          physics.rotation = Math.sin(now / 480 + physics.phase) * 13;
          if (dragRef.current?.id === id) continue;

          // Cursor proximity: curve away before the pointer even reaches
          // the character, falling off linearly to nothing at the radius.
          const mouse = settingsRef.current.cursorForce
            ? mouseRef.current
            : null;
          if (mouse) {
            const mdx = physics.x - mouse.x;
            const mdy = physics.y - mouse.y;
            const mdist = Math.hypot(mdx, mdy);
            if (mdist < CURSOR_RADIUS && mdist > 0.01) {
              const strength = (1 - mdist / CURSOR_RADIUS) * CURSOR_FORCE;
              physics.vx += (mdx / mdist) * strength * dt;
              physics.vy += (mdy / mdist) * strength * dt;
            }
          }

          // Nearer (higher-depth) characters drift a little faster, for a
          // cheap parallax feel alongside their larger, more opaque render.
          const depthSpeed = 0.55 + physics.depth * 0.9;
          const effectiveSpeedFactor = speedFactor * depthSpeed;
          const maxSpeed = 36 * effectiveSpeedFactor;

          if (physics.flinging) {
            physics.vx *= FLING_DAMPING;
            physics.vy *= FLING_DAMPING;
            if (Math.hypot(physics.vx, physics.vy) <= maxSpeed) {
              physics.flinging = false;
            }
          } else {
            physics.vx += randomBetween(-24, 24) * dt;
            physics.vy += randomBetween(-24, 24) * dt;
            const speed = Math.hypot(physics.vx, physics.vy);
            if (speed > maxSpeed) {
              physics.vx = (physics.vx / speed) * maxSpeed;
              physics.vy = (physics.vy / speed) * maxSpeed;
            }
          }
          physics.x += physics.vx * dt;
          physics.y += physics.vy * dt;

          if (physics.x < bounds.left) {
            physics.x = bounds.left;
            physics.vx = Math.abs(physics.vx) * WALL_RESTITUTION;
          } else if (physics.x > bounds.right) {
            physics.x = bounds.right;
            physics.vx = -Math.abs(physics.vx) * WALL_RESTITUTION;
          }
          if (physics.y < bounds.top) {
            physics.y = bounds.top;
            physics.vy = Math.abs(physics.vy) * WALL_RESTITUTION;
          } else if (physics.y > bounds.bottom) {
            physics.y = bounds.bottom;
            physics.vy = -Math.abs(physics.vy) * WALL_RESTITUTION;
          }
        }

        // Real elastic collisions: exchange velocity along the collision
        // normal (heavier/nearer characters push harder and budge less),
        // plus a small positional correction so overlapping pairs don't sink
        // into each other while their velocities sort themselves out.
        const entries = [...physicsRef.current.entries()];
        for (let i = 0; i < entries.length; i++) {
          const [idA, a] = entries[i];
          if (a.merge || dragRef.current?.id === idA) continue;
          const massA = 0.6 + a.depth * 0.8;
          for (let j = i + 1; j < entries.length; j++) {
            const [idB, b] = entries[j];
            if (b.merge || dragRef.current?.id === idB) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.01;
            if (dist >= COLLISION_MIN_DIST) continue;

            const nx = dx / dist;
            const ny = dy / dist;
            const massB = 0.6 + b.depth * 0.8;
            const relVx = b.vx - a.vx;
            const relVy = b.vy - a.vy;
            const closingSpeed = relVx * nx + relVy * ny;
            if (closingSpeed < 0) {
              const impulse =
                (-(1 + COLLISION_RESTITUTION) * closingSpeed) /
                (1 / massA + 1 / massB);
              const ix = impulse * nx;
              const iy = impulse * ny;
              a.vx -= ix / massA;
              a.vy -= iy / massA;
              b.vx += ix / massB;
              b.vy += iy / massB;
            }

            const overlap = COLLISION_MIN_DIST - dist;
            const correction = overlap * 0.5;
            a.x -= nx * correction;
            a.y -= ny * correction;
            b.x += nx * correction;
            b.y += ny * correction;
          }
        }

        for (const id of physicsRef.current.keys()) applyTransform(id);

        const hoveredId = hoveredIdRef.current;
        if (hoveredId !== null) {
          const hoveredPhysics = physicsRef.current.get(hoveredId);
          const mouse = mouseRef.current;
          const stillClose =
            hoveredPhysics &&
            mouse &&
            Math.hypot(hoveredPhysics.x - mouse.x, hoveredPhysics.y - mouse.y) <
              HOVER_CLEAR_DISTANCE;
          if (!stillClose) {
            hoveredIdRef.current = null;
            setHoveredId((current) => (current === hoveredId ? null : current));
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onWindowPointerMove);
      document.documentElement.removeEventListener(
        'pointerleave',
        onWindowPointerLeave,
      );
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
    (idA: number, idB: number, cardA: SourcedCard, cardB: SourcedCard) => {
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

  // Idle easter egg: after a stretch of no interaction, borrow two of the
  // characters already on screen, relabel them as a real combo pair, and
  // glide them together with the same animation as a manual drag-combine.
  // Skipped entirely if the vocabulary has no combos to draw from.
  useEffect(() => {
    if (WORD_COMBO_LIST.length === 0) return;
    const interval = window.setInterval(() => {
      if (reducedMotionRef.current || idleFiringRef.current) return;
      if (performance.now() - lastInteractionRef.current < IDLE_MS) return;
      // Never borrow a character that's currently frozen (its flashcard is
      // open), mid-merge, or being dragged -- disturbing one of those was
      // another way a character could look like it vanished.
      const current = itemsRef.current.filter((it) => {
        const p = physicsRef.current.get(it.id);
        return p && !p.frozen && !p.merge && dragRef.current?.id !== it.id;
      });
      if (current.length < 2) return;

      const i1 = Math.floor(Math.random() * current.length);
      let i2 = Math.floor(Math.random() * (current.length - 1));
      if (i2 >= i1) i2 += 1;
      const combo =
        WORD_COMBO_LIST[Math.floor(Math.random() * WORD_COMBO_LIST.length)];
      const itemA = current[i1];
      const itemB = current[i2];

      idleFiringRef.current = true;
      lastInteractionRef.current = performance.now();
      setItems((items) =>
        items.map((item) => {
          if (item.id === itemA.id) return { id: item.id, card: combo.a };
          if (item.id === itemB.id) return { id: item.id, card: combo.b };
          return item;
        }),
      );
      triggerCombine(itemA.id, itemB.id, combo.a, combo.b);
      window.setTimeout(
        () => {
          idleFiringRef.current = false;
        },
        MERGE_TWEEN_MS + TOAST_MS + 200,
      );
    }, IDLE_CHECK_MS);

    return () => window.clearInterval(interval);
  }, [triggerCombine]);

  const runClick = useCallback(
    (item: Item) => {
      if (settingsRef.current.click === 'pop') {
        triggerPop(item.id);
      } else {
        // Opening a new flashcard without closing the last one used to
        // leave that earlier character frozen in place forever -- nothing
        // else ever unfroze it. Unfreeze whatever was previously open first.
        if (flashcardId !== null && flashcardId !== item.id) {
          const previous = physicsRef.current.get(flashcardId);
          if (previous) previous.frozen = false;
        }
        const physics = physicsRef.current.get(item.id);
        if (physics) {
          physics.frozen = true;
          setFlashcardAnchor({ x: physics.x, y: physics.y });
        }
        setFlashcardId(item.id);
      }
    },
    [triggerPop, flashcardId],
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
      lastInteractionRef.current = performance.now();
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
        smoothVx: 0,
        smoothVy: 0,
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
      if (Math.abs(dx) + Math.abs(dy) > 0) drag.moved = true;
      const now = performance.now();
      const dt = Math.max(1, now - drag.lastT);
      // Instantaneous velocity in px/s, then folded into a running average
      // so the release speed reflects the overall gesture, not one jittery
      // final sample -- that's what keeps a small/slow drag from ever
      // registering as a throw.
      const instVx = (dx / dt) * 1000;
      const instVy = (dy / dt) * 1000;
      drag.vx = instVx;
      drag.vy = instVy;
      drag.smoothVx = drag.smoothVx * 0.7 + instVx * 0.3;
      drag.smoothVy = drag.smoothVy * 0.7 + instVy * 0.3;
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
        let nearestCard: SourcedCard | null = null;
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

      const releaseSpeed = Math.hypot(drag.smoothVx, drag.smoothVy);
      if (settingsRef.current.throwEnabled && releaseSpeed > THROW_MIN_SPEED) {
        const boosted = Math.min(releaseSpeed * THROW_BOOST, THROW_MAX_SPEED);
        const scale = boosted / releaseSpeed;
        physics.vx = drag.smoothVx * scale;
        physics.vy = drag.smoothVy * scale;
        physics.flinging = true;
      } else {
        physics.vx = Math.max(-40, Math.min(40, drag.smoothVx));
        physics.vy = Math.max(-40, Math.min(40, drag.smoothVy));
        physics.flinging = false;
      }
    },
    [items, runClick, triggerCombine],
  );

  const openPractice = useCallback((card: SourcedCard) => {
    setPracticeCard(card);
  }, []);

  const handleHoverStart = useCallback((id: number) => {
    lastInteractionRef.current = performance.now();
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
          pathwayColors={settings.pathwayColors}
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
  pathwayColors,
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
  pathwayColors: boolean;
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
  // Tracks which hanzi (if any) failed to load stroke data, rather than a
  // plain boolean, so it "resets" for free whenever the character changes
  // instead of needing a separate effect just to clear it.
  const [failedHanzi, setFailedHanzi] = useState<string | null>(null);
  const writerFailed = failedHanzi === item.card.hanzi;
  const showWriter = hovered && hoverMode === 'stroke' && !writerFailed;

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
      onLoadCharDataError: () => {
        if (!cancelled) setFailedHanzi(item.card.hanzi);
      },
    });
    void writer.animateCharacter();
    return () => {
      cancelled = true;
      writer.cancelQuiz();
      el.innerHTML = '';
    };
  }, [hovered, hoverMode, item.card.hanzi]);

  return (
    <button
      type="button"
      ref={(el) => registerEl(item.id, el)}
      className={`floating-char${hovered ? ' is-hovered' : ''}${popping ? ' is-popping' : ''}`}
      style={
        {
          '--char-tint': PATHWAY_TINT[item.card.pathway] ?? 'transparent',
        } as React.CSSProperties
      }
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
      {showWriter ? (
        <span key="writer" className="floating-char-writer" ref={writerMountRef} />
      ) : (
        <span key="glyph" lang="zh-Hant">{item.card.hanzi}</span>
      )}
      {pathwayColors ? (
        <i className="floating-char-dot" aria-hidden="true" />
      ) : null}
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
