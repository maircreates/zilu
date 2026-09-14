'use client';

import { useEffect, useRef, useState } from 'react';

import { useThemeFamily } from '@/lib/use-theme';

/** The four destinations that used to crowd the header's text nav --
 * Fundamentals, Grammar, Study, and Settings -- moved to a fixed dock at the
 * bottom of every page, game-HUD style: a row of round "skill button" icons
 * instead of a row of words. Each icon is a single Traditional character in
 * a circle, the same visual language as the brand mark (字), so a learner
 * already reads these as ZiLu's icon convention rather than a new one. */
const SKILLS = [
  { id: 'fundamentals', href: '/fundamentals', label: 'Fundamentals', glyph: '基' },
  { id: 'grammar', href: '/grammar', label: 'Grammar', glyph: '法' },
  { id: 'study', href: '/study', label: 'Study', glyph: '習' },
  { id: 'settings', href: '/settings', label: 'Settings', glyph: '設' },
] as const;

export type SkillId = (typeof SKILLS)[number]['id'];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*';

function scrambleChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/** Cyberpunk only: hovering the label scrambles it through random
 * characters, locking in the real letters one at a time left-to-right, like
 * a terminal decrypting text. Other families just render the plain label --
 * scrambleEnabled gates the whole effect rather than every call site
 * checking family itself. */
function SkillLabel({ text, scrambleEnabled }: { text: string; scrambleEnabled: boolean }) {
  const [display, setDisplay] = useState(text);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timeoutsRef.current.forEach(clearTimeout);
    },
    [],
  );

  function handleEnter() {
    if (!scrambleEnabled) return;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    const chars = text.split('');
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ' ') continue;
      const lockAt = 90 + i * 30;
      for (let tick = 0; tick < 3; tick++) {
        const delay = lockAt - 80 + tick * 22;
        if (delay < 0) continue;
        timeoutsRef.current.push(
          setTimeout(() => {
            setDisplay((prev) => {
              const next = prev.split('');
              next[i] = scrambleChar();
              return next.join('');
            });
          }, delay),
        );
      }
      timeoutsRef.current.push(
        setTimeout(() => {
          setDisplay((prev) => {
            const next = prev.split('');
            next[i] = text[i];
            return next.join('');
          });
        }, lockAt),
      );
    }
  }

  return (
    <span className="skill-button-label" onPointerEnter={handleEnter}>
      {display}
    </span>
  );
}

export function SkillBar({ active }: { active?: SkillId }) {
  const [family] = useThemeFamily();
  const scrambleEnabled = family === 'cyberpunk';

  return (
    <nav className="skill-bar" aria-label="Primary">
      {SKILLS.map((skill) => (
        <a
          key={skill.id}
          href={skill.href}
          className="skill-button"
          aria-current={active === skill.id ? 'page' : undefined}
        >
          <span className="skill-button-glyph" lang="zh-Hant" aria-hidden="true">
            {skill.glyph}
          </span>
          <SkillLabel text={skill.label} scrambleEnabled={scrambleEnabled} />
        </a>
      ))}
    </nav>
  );
}
