import type { ReactNode } from 'react';

import { SearchTrigger } from '@/components/search-trigger';
import { TopbarEmblem } from '@/components/topbar-emblem';

/** Every page's header, extracted to one place -- it used to be copy-pasted
 * across a dozen page components, which is exactly how the header nav and
 * the centered TopbarEmblem ended up overlapping on narrow screens with no
 * one place to fix it. Now the header only carries the brand, the decorative
 * emblem, and search; Fundamentals/Grammar/Study/Settings moved to
 * <SkillBar>, a fixed dock that doesn't compete for header width at all.
 * `children` is an escape hatch for the one page (the flashcard explorer)
 * that adds its own extra bit after search (the active pathway label). */
export function Topbar({ children }: { children?: ReactNode }) {
  return (
    <header className="topbar">
      <TopbarEmblem />
      <a className="brand" href="/" aria-label="ZiLu home">
        <span className="brand-mark">字</span>
        <span>
          <strong>ZiLu</strong>
          <small>Your path into Chinese</small>
        </span>
      </a>
      <div className="topbar-actions">
        <SearchTrigger />
        {children}
      </div>
    </header>
  );
}
