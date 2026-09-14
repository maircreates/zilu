import type { Metadata } from 'next';

import { ZiliFangHub } from '@/components/zili-fang-hub';

export const metadata: Metadata = {
  title: '字力房 — ZiLu',
  description:
    'Experimental drills aimed at specific things Mandarin learners get stuck on: tones, near-synonyms, character structure, and daily habit.',
};

export default function ZiliFangPage() {
  return <ZiliFangHub />;
}
