'use client';

import { useInView } from '@/lib/use-in-view';

/** A section divider whose look and "draw itself in" reveal both depend on
 * the active color family -- Cyberpunk gets a circuit trace, Silkpunk a
 * cloud-collar wave, Taopunk a single brush stroke with an ink-bleed
 * underlay. Draws in via a one-time CSS transition triggered by scroll
 * (useInView), not a per-frame-driven property, so it can't get stuck the
 * way the floating-characters opacity bug once did. Nodes/accents glow a
 * little brighter on hover as a small interactive touch. */
export function ThemeDivider() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`theme-divider${inView ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 900 40" preserveAspectRatio="none">
        {/* Cyberpunk: circuit trace with two right-angle jogs and node pads. */}
        <g className="theme-divider-cyberpunk">
          <path
            className="theme-divider-path"
            d="M0,20 H300 V8 H380 V20 H520 V32 H600 V20 H900"
          />
          <rect className="theme-divider-node" x="296" y="4" width="8" height="8" />
          <rect className="theme-divider-node" x="596" y="28" width="8" height="8" />
        </g>

        {/* Silkpunk: a cloud-collar (ruyi) wave with dot accents at the peaks. */}
        <g className="theme-divider-silkpunk">
          <path
            className="theme-divider-path"
            d="M0,20 C100,2 200,38 300,20 C400,2 500,38 600,20 C700,2 800,38 900,20"
          />
          <circle className="theme-divider-node" cx="150" cy="10" r="3.5" />
          <circle className="theme-divider-node" cx="450" cy="10" r="3.5" />
          <circle className="theme-divider-node" cx="750" cy="10" r="3.5" />
        </g>

        {/* Taopunk: one loose brush stroke, a blurred low-opacity underlay
            giving it a soft ink-bleed edge instead of a printed hard line. */}
        <g className="theme-divider-taopunk">
          <path
            className="theme-divider-path theme-divider-bleed"
            d="M20,22 C250,4 450,36 880,18"
          />
          <path
            className="theme-divider-path"
            d="M20,22 C250,4 450,36 880,18"
          />
        </g>
      </svg>
    </div>
  );
}
