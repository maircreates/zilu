import type { Metadata } from 'next';

import { ZiliFangToneDuel } from '@/components/zili-fang-tone-duel';

export const metadata: Metadata = {
  title: '調對決 · 字力房 — ZiLu',
  description: 'Listen to a syllable said with every tone and pick which one you heard.',
};

export default function ToneDuelPage() {
  return <ZiliFangToneDuel />;
}
