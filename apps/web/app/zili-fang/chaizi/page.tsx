import type { Metadata } from 'next';

import { ZiliFangChaizi } from '@/components/zili-fang-chaizi';

export const metadata: Metadata = {
  title: '拆字 · 字力房 — ZiLu',
  description: 'Break a character into its components and the memory story behind it.',
};

export default function ChaiziPage() {
  return <ZiliFangChaizi />;
}
