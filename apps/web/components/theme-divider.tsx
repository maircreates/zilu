'use client';

import { useEffect, useRef } from 'react';

import { useInView } from '@/lib/use-in-view';

/** Silkpunk thread geometry, in the SVG's own 900x40 viewBox units. The
 * thread is anchored at the spool (fixed) and at the divider's far end
 * (fixed); T1/T2 are the two free interior points that get pulled toward
 * the cursor while dragging and eased back to their resting spot on
 * release. Kept as a fixed 4-point/3-segment structure in both the resting
 * and dragged shapes (only the point values change) so the CSS `d`
 * transition on release can interpolate between them smoothly instead of
 * just snapping. */
const THREAD_START = { x: 30, y: 20 };
const THREAD_END = { x: 900, y: 20 };
const REST_T1 = { x: 320, y: 20 };
const REST_T2 = { x: 610, y: 20 };
const REST_D = 'M30,20 Q175,2 320,20 Q465,38 610,20 Q755,2 900,20';
/** How far a ripple can push the thread perpendicular to its pull, and how
 * fast that ripple travels -- tuned so it reads as a live wobble in a
 * taut-but-flexible thread, not a shake. */
const RIPPLE_AMP = 6;
const RIPPLE_SPEED = 140;
/** Degrees of spool rotation per viewBox unit of pulled distance -- picked
 * so a full-length pull reads as a few visible turns, not a twitch. */
const ROTATION_PER_UNIT = 2.2;

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** How much a point at path-parameter `paramT` (0 = spool end, 1 = far end)
 * should follow the cursor -- 1 right where you grabbed, fading to 0 a
 * half-span away, so pulling anywhere tents the whole thread toward that
 * one spot instead of every point snapping equally. */
function pullWeight(paramT: number, cursorX: number) {
  const cursorT = Math.min(
    1,
    Math.max(0, (cursorX - THREAD_START.x) / (THREAD_END.x - THREAD_START.x)),
  );
  return Math.min(1, Math.max(0, 1 - Math.abs(paramT - cursorT) / 0.5));
}

/** A section divider whose look and "draw itself in" reveal both depend on
 * the active color family -- Cyberpunk gets a circuit trace, Silkpunk a
 * spool of thread you can grab and pull (the spool spins as you pull it
 * out, and it springs back with a wavy snap when you let go), Taopunk a
 * single brush stroke with an ink-bleed underlay. The reveal draws in via
 * a one-time CSS transition triggered by scroll (useInView), not a
 * per-frame-driven property, so it can't get stuck the way the
 * floating-characters opacity bug once did. Nodes/accents glow a little
 * brighter on hover as a small interactive touch. */
export function ThemeDivider() {
  const [inViewRef, inView] = useInView<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const threadRef = useRef<SVGPathElement | null>(null);
  const hitRef = useRef<SVGPathElement | null>(null);
  const spoolRef = useRef<SVGGElement | null>(null);

  function setContainerRef(node: HTMLDivElement | null) {
    inViewRef.current = node;
    containerRef.current = node;
  }

  // All drag/rAF logic lives in one effect, attached with native listeners
  // rather than JSX event props -- everything imperative here runs outside
  // React's render phase, the same pattern floating-characters-bg.tsx uses
  // for its own per-frame physics.
  useEffect(() => {
    const hit = hitRef.current;
    const thread = threadRef.current;
    const spool = spoolRef.current;
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!hit || !thread || !spool || !svg || !container) return;

    let dragging = false;
    let rafId: number | null = null;
    const cursor = { x: THREAD_START.x, y: THREAD_START.y };
    // Where the thread was actually grabbed -- rotation tracks distance
    // dragged from THIS point, not from the spool. The thread's resting
    // shape already spans the full divider, so measuring from the spool
    // anchor would make the spool jump to a huge rotation the instant you
    // touch the thread anywhere, before any pulling has happened at all.
    let grabStart = { x: THREAD_START.x, y: THREAD_START.y };

    function toLocalPoint(clientX: number, clientY: number) {
      const rect = svg!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return { ...THREAD_START };
      return {
        x: ((clientX - rect.left) / rect.width) * 900,
        y: ((clientY - rect.top) / rect.height) * 40,
      };
    }

    function renderThread(cursorX: number, cursorY: number, ripplePhase: number) {
      const t1Weight = pullWeight(0.333, cursorX);
      const t2Weight = pullWeight(0.667, cursorX);
      const t1 = {
        x: REST_T1.x + (cursorX - REST_T1.x) * t1Weight,
        y: REST_T1.y + (cursorY - REST_T1.y) * t1Weight,
      };
      const t2 = {
        x: REST_T2.x + (cursorX - REST_T2.x) * t2Weight,
        y: REST_T2.y + (cursorY - REST_T2.y) * t2Weight,
      };
      const c1 = midpoint(THREAD_START, t1);
      const c2 = midpoint(t1, t2);
      const c3 = midpoint(t2, THREAD_END);
      c1.y += Math.sin(ripplePhase) * RIPPLE_AMP * t1Weight;
      c2.y += Math.sin(ripplePhase + 2) * RIPPLE_AMP * Math.max(t1Weight, t2Weight);
      c3.y += Math.sin(ripplePhase + 4) * RIPPLE_AMP * t2Weight;
      const d =
        `M${THREAD_START.x},${THREAD_START.y} Q${c1.x},${c1.y} ${t1.x},${t1.y} ` +
        `Q${c2.x},${c2.y} ${t2.x},${t2.y} Q${c3.x},${c3.y} ${THREAD_END.x},${THREAD_END.y}`;
      thread!.setAttribute('d', d);
      hit!.setAttribute('d', d);
      const pulled = Math.hypot(cursorX - grabStart.x, cursorY - grabStart.y);
      spool!.style.transform = `rotate(${pulled * ROTATION_PER_UNIT}deg)`;
    }

    function tick() {
      if (!dragging) return;
      renderThread(cursor.x, cursor.y, performance.now() / RIPPLE_SPEED);
      rafId = requestAnimationFrame(tick);
    }

    function handlePointerDown(event: PointerEvent) {
      dragging = true;
      container!.classList.add('is-dragging');
      hit!.setPointerCapture(event.pointerId);
      const point = toLocalPoint(event.clientX, event.clientY);
      cursor.x = point.x;
      cursor.y = point.y;
      grabStart = { x: point.x, y: point.y };
      renderThread(cursor.x, cursor.y, performance.now() / RIPPLE_SPEED);
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    // Renders immediately on every move rather than waiting for the next
    // rAF tick -- rAF still drives the idle ripple while the cursor holds
    // still, but the thread's position tracking the cursor itself never
    // depends on it, so a throttled/backgrounded tab can't make dragging
    // feel laggy or unresponsive.
    function handlePointerMove(event: PointerEvent) {
      if (!dragging) return;
      const point = toLocalPoint(event.clientX, event.clientY);
      cursor.x = point.x;
      cursor.y = point.y;
      renderThread(cursor.x, cursor.y, performance.now() / RIPPLE_SPEED);
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      container!.classList.remove('is-dragging');
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      thread!.setAttribute('d', REST_D);
      hit!.setAttribute('d', REST_D);
      spool!.style.transform = 'rotate(0deg)';
    }

    hit.addEventListener('pointerdown', handlePointerDown);
    hit.addEventListener('pointermove', handlePointerMove);
    hit.addEventListener('pointerup', endDrag);
    hit.addEventListener('pointercancel', endDrag);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      hit.removeEventListener('pointerdown', handlePointerDown);
      hit.removeEventListener('pointermove', handlePointerMove);
      hit.removeEventListener('pointerup', endDrag);
      hit.removeEventListener('pointercancel', endDrag);
    };
  }, []);

  return (
    <div
      ref={setContainerRef}
      className={`theme-divider${inView ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg ref={svgRef} viewBox="0 0 900 40" preserveAspectRatio="none">
        {/* Cyberpunk: circuit trace with two right-angle jogs and node pads. */}
        <g className="theme-divider-cyberpunk">
          <path
            className="theme-divider-path"
            d="M0,20 H300 V8 H380 V20 H520 V32 H600 V20 H900"
          />
          <rect className="theme-divider-node" x="296" y="4" width="8" height="8" />
          <rect className="theme-divider-node" x="596" y="28" width="8" height="8" />
        </g>

        {/* Silkpunk: a spool of thread at the left. At rest it's a gentle
            three-hump wave unspooling rightward (the scroll-triggered
            reveal draws it in left-to-right, so it already looks pulled
            off the spool as it comes into view). Grab it anywhere -- the
            wide invisible hit-path makes that easy -- and it tents toward
            the cursor with a live ripple while the spool spins to match;
            let go and both spring back through the CSS `d`/transform
            transition on the visible elements. */}
        <g className="theme-divider-silkpunk">
          <g ref={spoolRef} className="theme-divider-spool">
            <ellipse className="theme-divider-spool-cap" cx="17" cy="10" rx="13" ry="4" />
            <rect className="theme-divider-spool-body" x="4" y="10" width="26" height="20" rx="2" />
            <ellipse className="theme-divider-spool-cap" cx="17" cy="30" rx="13" ry="4" />
            <path
              className="theme-divider-spool-thread"
              d="M6,15 Q17,19 28,15 M6,20 Q17,24 28,20 M6,25 Q17,29 28,25"
            />
          </g>
          <path ref={threadRef} className="theme-divider-path" d={REST_D} />
          <path ref={hitRef} className="theme-divider-thread-hit" d={REST_D} />
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
