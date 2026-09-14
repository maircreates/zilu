import type { Metadata } from 'next';

import { ZiliFangLazyMode } from '@/components/zili-fang-lazy-mode';

export const metadata: Metadata = {
  title: '懶人模式 · 字力房 — ZiLu',
  description: 'Five cards, out loud, once a day.',
};

export default function LazyModePage() {
  return <ZiliFangLazyMode />;
}
