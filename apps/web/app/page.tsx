import type { Metadata } from 'next';

import { HomePage } from '@/components/home-page';

export const metadata: Metadata = {
  title: 'ZiLu — Your path into Chinese',
  description:
    'Beginner-first Mandarin learning: Traditional Chinese fundamentals and flashcard pathways with pinyin and pronunciation support.',
};

export default function Home() {
  return <HomePage />;
}
