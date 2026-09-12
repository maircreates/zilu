import type { Metadata } from 'next';

import { FundamentalsHub } from '@/components/fundamentals-hub';

export const metadata: Metadata = {
  title: 'Fundamentals — ZiLu',
  description:
    'Start Here: an original bridge into Traditional Chinese tones, pronunciation, and core sentence structures for complete beginners.',
};

export default function FundamentalsPage() {
  return <FundamentalsHub />;
}
