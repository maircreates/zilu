'use client';

import { Search } from 'lucide-react';

/**
 * The magnifying-glass button that lives in each page's topbar. It just asks
 * the globally-mounted <SearchPalette> to open via a window event, so the two
 * do not need to share React state.
 */
export function SearchTrigger() {
  return (
    <button
      type="button"
      className="topbar-search"
      aria-label="Search (press /)"
      onClick={() => window.dispatchEvent(new Event('zilu:search'))}
    >
      <Search aria-hidden="true" />
    </button>
  );
}
