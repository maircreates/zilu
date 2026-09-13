'use client';

import { ArrowLeft } from 'lucide-react';

import {
  useHomepageFx,
  type ClickMode,
  type Density,
  type DragMode,
  type HomepageFxSettings,
  type HoverMode,
  type Speed,
} from '@/lib/use-homepage-fx';
import { FloatingCharactersBg } from '@/components/floating-characters-bg';
import { SegmentedControl } from '@/components/segmented-control';
import { DayNightToggle } from '@/components/day-night-toggle';
import { Topbar } from '@/components/topbar';
import { SkillBar } from '@/components/skill-bar';

const DENSITY_OPTIONS: { id: Density; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'many', label: 'Many' },
  { id: 'swarm', label: 'Swarm' },
];

const SPEED_OPTIONS: { id: Speed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
];

const HOVER_OPTIONS: { id: HoverMode; label: string }[] = [
  { id: 'glow', label: 'Glow + label' },
  { id: 'stroke', label: 'Stroke animation' },
];

const CLICK_OPTIONS: { id: ClickMode; label: string }[] = [
  { id: 'flashcard', label: 'Open flashcard' },
  { id: 'pop', label: 'Pop & respawn' },
];

const DRAG_OPTIONS: { id: DragMode; label: string }[] = [
  { id: 'physics', label: 'Physics toss' },
  { id: 'combine', label: 'Word combining' },
];

export function SettingsHomepagePage() {
  const [fx, setFx] = useHomepageFx();

  function set<K extends keyof HomepageFxSettings>(
    key: K,
    value: HomepageFxSettings[K],
  ) {
    setFx({ [key]: value } as Partial<HomepageFxSettings>);
  }

  return (
    <main className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <FloatingCharactersBg />

      <Topbar />
      <SkillBar active="settings" />

      <a href="/settings/display/aesthetics" className="subpage-back">
        <ArrowLeft aria-hidden="true" /> Aesthetics
      </a>

      <section className="settings-hero">
        <span className="eyebrow">Settings / Display / Aesthetics / Homepage</span>
        <h1>Homepage</h1>
        <p>
          The Chinese characters drifting behind the homepage hero. Every
          character is a real word from your pathways, and changes here take
          effect immediately -- visit the homepage to see them live. Saved
          separately per color family, so switching themes in Settings /
          Display / Theme recalls that family&apos;s own setup here too.
        </p>
      </section>

      <div className="settings-panel">
        <div className="settings-row">
          <div className="settings-row-head">
            <div>
              <strong>Floating characters</strong>
              <span>Turn the background effect on or off entirely.</span>
            </div>
            <label className="settings-toggle" aria-label="Enable floating characters">
              <input
                type="checkbox"
                checked={fx.enabled}
                onChange={(event) => set('enabled', event.target.checked)}
              />
              <span className="toggle-track" aria-hidden="true">
                <span />
              </span>
            </label>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <strong>Density</strong>
          </div>
          <SegmentedControl
            legend="Number of floating characters"
            value={fx.density}
            options={DENSITY_OPTIONS}
            onChange={(value) => set('density', value)}
          />
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <strong>Speed</strong>
          </div>
          <SegmentedControl
            legend="Drift speed"
            value={fx.speed}
            options={SPEED_OPTIONS}
            onChange={(value) => set('speed', value)}
          />
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <div>
              <strong>Hover</strong>
              <span>
                Glow shows pinyin and meaning right away. Stroke animation
                plays the character being written, using the same stroke data
                as flashcard practice.
              </span>
            </div>
          </div>
          <SegmentedControl
            legend="What happens on hover"
            value={fx.hover}
            options={HOVER_OPTIONS}
            onChange={(value) => set('hover', value)}
          />
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <div>
              <strong>Click</strong>
              <span>
                Open flashcard shows the full meaning with Hear it and
                Practice writing. Pop & respawn is a quick, playful burst.
              </span>
            </div>
          </div>
          <SegmentedControl
            legend="What happens on click"
            value={fx.click}
            options={CLICK_OPTIONS}
            onChange={(value) => set('click', value)}
          />
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <div>
              <strong>Drag</strong>
              <span>
                Physics toss just tosses the character around. Word combining
                also lets you drag two characters together -- if they form a
                real word, they snap into it and reveal the meaning.
              </span>
            </div>
          </div>
          <SegmentedControl
            legend="What happens on drag"
            value={fx.drag}
            options={DRAG_OPTIONS}
            onChange={(value) => set('drag', value)}
          />
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <div>
              <strong>Throw</strong>
              <span>
                Release a drag with enough speed and the character flies off
                and coasts to a stop. Turn off and a release always settles
                gently, no matter how fast you let go.
              </span>
            </div>
            <label className="settings-toggle" aria-label="Enable throwing characters">
              <input
                type="checkbox"
                checked={fx.throwEnabled}
                onChange={(event) => set('throwEnabled', event.target.checked)}
              />
              <span className="toggle-track" aria-hidden="true">
                <span />
              </span>
            </label>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <div>
              <strong>Cursor reacts</strong>
              <span>
                Nearby characters curve away as your cursor approaches, even
                before you&apos;re hovering one.
              </span>
            </div>
            <label className="settings-toggle" aria-label="Enable cursor proximity reaction">
              <input
                type="checkbox"
                checked={fx.cursorForce}
                onChange={(event) => set('cursorForce', event.target.checked)}
              />
              <span className="toggle-track" aria-hidden="true">
                <span />
              </span>
            </label>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-head">
            <div>
              <strong>Pathway colors</strong>
              <span>
                A small tinted dot under each character showing which pathway
                (Vol 1, 2, or 3) teaches it.
              </span>
            </div>
            <label className="settings-toggle" aria-label="Enable pathway color dots">
              <input
                type="checkbox"
                checked={fx.pathwayColors}
                onChange={(event) => set('pathwayColors', event.target.checked)}
              />
              <span className="toggle-track" aria-hidden="true">
                <span />
              </span>
            </label>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Learner-facing Chinese is always Traditional Chinese.</p>
        <DayNightToggle />
      </footer>
    </main>
  );
}
