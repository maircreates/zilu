'use client';

import type { PointerEvent } from 'react';

type LessonVisualProps = {
  step: number;
  showPinyin: boolean;
  showMeaning: boolean;
};

export function LessonVisual({ step, showPinyin, showMeaning }: LessonVisualProps) {
  const moveLight = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const rotateY = ((x - 50) / 50) * 4;
    const rotateX = ((50 - y) / 50) * 4;

    event.currentTarget.style.setProperty('--pointer-x', `${x}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}%`);
    event.currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
    event.currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const resetLight = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '50%');
    event.currentTarget.style.setProperty('--pointer-y', '50%');
    event.currentTarget.style.setProperty('--rotate-x', '0deg');
    event.currentTarget.style.setProperty('--rotate-y', '0deg');
  };

  return (
    <div
      className="lesson-stage"
      data-step={step}
      onPointerMove={moveLight}
      onPointerLeave={resetLight}
      aria-label="Interactive display of the Traditional Chinese greeting 你好, pronounced nǐ hǎo, meaning hello"
    >
      <div className="pointer-light" aria-hidden="true" />
      <div className="stage-grid" aria-hidden="true" />

      <svg className="tone-constellation" viewBox="0 0 760 360" aria-hidden="true">
        <defs>
          <linearGradient id="tone-gradient" x1="0" x2="1">
            <stop offset="0" stopColor="#2dcb78" />
            <stop offset="0.5" stopColor="#b9f6c9" />
            <stop offset="1" stopColor="#f0785c" />
          </linearGradient>
          <filter id="tone-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path className="tone-ghost" d="M72 248 C142 232 175 130 286 104 S434 236 502 242 S615 159 692 104" />
        <path className="tone-trail" d="M72 248 C142 232 175 130 286 104 S434 236 502 242 S615 159 692 104" />
        {[['72', '248'], ['286', '104'], ['502', '242'], ['692', '104']].map(([cx, cy], index) => (
          <g key={cx} className="tone-node" style={{ animationDelay: `${index * 180}ms` }}>
            <circle cx={cx} cy={cy} r="14" />
            <circle cx={cx} cy={cy} r="4" />
          </g>
        ))}
      </svg>

      <div className="orbit orbit-one" aria-hidden="true"><span /></div>
      <div className="orbit orbit-two" aria-hidden="true"><span /></div>

      <div className="hanzi-pair" lang="zh-Hant">
        <div className="hanzi-card hanzi-card-one">
          <span className="character-glint" aria-hidden="true" />
          <span className="hanzi-symbol">你</span>
          <span className="character-meaning">you</span>
        </div>
        <div className="hanzi-card hanzi-card-two">
          <span className="character-glint" aria-hidden="true" />
          <span className="hanzi-symbol">好</span>
          <span className="character-meaning">good</span>
        </div>
      </div>

      <div className="learning-aids" key={`${step}-${showPinyin}-${showMeaning}`}>
        {showPinyin && <p className="pinyin-line">nǐ hǎo</p>}
        {showMeaning && <p className="meaning-line">hello · hi</p>}
      </div>

      <div className={`spoken-tone ${step >= 2 ? 'is-visible' : ''}`}>
        <span className="spoken-label">natural speech</span>
        <span className="spoken-reading">ní hǎo</span>
        <span className="spoken-arrow" aria-hidden="true">↗⌄</span>
      </div>

      <span className="stage-caption">move your pointer through the sound path</span>
    </div>
  );
}
