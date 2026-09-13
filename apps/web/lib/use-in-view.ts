'use client';

import { useEffect, useRef, useState } from 'react';

/** True once the element has scrolled into view -- stays true afterward (a
 * one-time reveal trigger, not a continuous visibility tracker). Used to
 * fire a decorative "draw itself in" transition the first time a user
 * actually scrolls to it, rather than on mount before they've seen it. */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}
