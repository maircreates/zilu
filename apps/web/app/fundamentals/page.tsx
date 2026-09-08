import type { Metadata } from 'next';

import { FundamentalsGuide } from '@/components/fundamentals-guide';

export const metadata: Metadata = {
  title: 'Fundamentals — ZiLu',
  description:
    'Start Here: an original bridge into Traditional Chinese tones, pronunciation, and core sentence structures for complete beginners.',
};

export default function FundamentalsPage() {
  return <FundamentalsGuide />;
}
