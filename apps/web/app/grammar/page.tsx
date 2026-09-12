import type { Metadata } from 'next';

import { GrammarHub } from '@/components/grammar-hub';

export const metadata: Metadata = {
  title: 'Grammar — ZiLu',
  description:
    'A beginner Mandarin grammar reference in Traditional Chinese, with pinyin and English toggles and spoken examples.',
};

export default function GrammarPage() {
  return <GrammarHub />;
}
