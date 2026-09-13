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

        {/* Silkpunk: a spool of thread at the left, with the thread itself
            (a cloud-collar/ruyi wave, dot accents at the peaks) unspooling
            rightward -- the reveal already draws left-to-right following
            the path's own start point, so it naturally looks like it's
            being pulled off the spool as it comes into view. The spool
            graphic itself is a plain static group, not part of the reveal. */}
        <g className="theme-divider-silkpunk">
          <g className="theme-divider-spool">
            <ellipse className="theme-divider-spool-cap" cx="17" cy="10" rx="13" ry="4" />
            <rect className="theme-divider-spool-body" x="4" y="10" width="26" height="20" rx="2" />
            <ellipse className="theme-divider-spool-cap" cx="17" cy="30" rx="13" ry="4" />
            <path
              className="theme-divider-spool-thread"
              d="M6,15 Q17,19 28,15 M6,20 Q17,24 28,20 M6,25 Q17,29 28,25"
            />
          </g>
          <path
            className="theme-divider-path"
            d="M30,20 C130,2 230,38 330,20 C430,2 530,38 630,20 C730,2 830,38 900,20"
          />
          <circle className="theme-divider-node" cx="180" cy="10" r="3.5" />
          <circle className="theme-divider-node" cx="480" cy="10" r="3.5" />
          <circle className="theme-divider-node" cx="780" cy="10" r="3.5" />
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
