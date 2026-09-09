import type { Metadata } from 'next';

import { FlashcardExplorer } from '@/components/flashcard-explorer';

export const metadata: Metadata = {
  title: 'Study — ZiLu',
  description:
    'Traditional Chinese flashcards with pinyin and pronunciation for complete beginners.',
};

type StudyPageProps = {
  searchParams: Promise<{
    guided?: string;
    pi?: string;
    wi?: string;
    di?: string;
    ci?: string;
  }>;
};

function toIndex(value: string | undefined): number | null {
  if (value === undefined) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export default async function StudyPage({ searchParams }: StudyPageProps) {
  const params = await searchParams;
  const parts = [params.pi, params.wi, params.di, params.ci].map(toIndex);
  const initialPosition = parts.every((part) => part !== null)
    ? {
        pathwayIndex: parts[0] as number,
        waypointIndex: parts[1] as number,
        deckIndex: parts[2] as number,
        cardIndex: parts[3] as number,
      }
    : undefined;

  return (
    <FlashcardExplorer
      initialGuided={params.guided === '1'}
      initialPosition={initialPosition}
    />
  );
}
