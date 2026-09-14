'use client';

import { useEffect, useRef } from 'react';

import { useThemeFamily } from '@/lib/use-theme';

/** Taopunk only: every click leaves a brief ink-blot ripple at the click
 * point, like a seal being pressed -- "everything here is painted, not
 * printed" extended to the click itself. One global listener (mounted once
 * in the root layout) rather than per-element handlers, so it works
 * everywhere including content this app doesn't otherwise attach handlers
 * to. familyRef is kept in sync via effect (not written during render) so
 * the listener -- created once and never re-bound -- always reads the
 * current family without needing to be a dependency. */
export function InkRippleLayer() {
  const [family] = useThemeFamily();
  const familyRef = useRef(family);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    familyRef.current = family;
  }, [family]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (familyRef.current !== 'taopunk') return;
      const layer = layerRef.current;
      if (!layer) return;
      const ripple = document.createElement('span');
      ripple.className = 'ink-ripple';
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      ripple.addEventListener('animationend', () => ripple.remove());
      layer.appendChild(ripple);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <div ref={layerRef} className="ink-ripple-layer" aria-hidden="true" />;
}
