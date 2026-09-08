import type { Metadata } from 'next';

import { FlashcardExplorer } from '@/components/flashcard-explorer';

export const metadata: Metadata = {
  title: 'Study — ZiLu',
  description:
    'Traditional Chinese flashcards with pinyin and pronunciation for complete beginners.',
};

type StudyPageProps = {
  searchParams: Promise<{ guided?: string }>;
};

export default async function StudyPage({ searchParams }: StudyPageProps) {
  const params = await searchParams;
  return <FlashcardExplorer initialGuided={params.guided === '1'} />;
}
