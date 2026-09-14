import type { Metadata } from 'next';

import { ZiliFangWordFight } from '@/components/zili-fang-word-fight';

export const metadata: Metadata = {
  title: '字打架 · 字力房 — ZiLu',
  description: 'Near-synonym pairs English collapses into one word, wrong vs. right, side by side.',
};

export default function WordFightPage() {
  return <ZiliFangWordFight />;
}
