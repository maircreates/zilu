import type { Metadata } from 'next';

import { ReviewPage } from '@/components/study-packs/review-page';

export const metadata: Metadata = { title: 'Quick Review — Chinese Class — ZiLu', description: 'A short Current Class review shaped by your recent practice.' };

type Props = { searchParams: Promise<{ minutes?: string; unit?: string; collection?: string; scope?: string; resume?: string }> };

export default async function Ch201ReviewRoute({ searchParams }: Props) {
  const query = await searchParams;
  return <ReviewPage minutes={query.minutes} unitId={query.unit} collectionId={query.collection} scope={query.scope} resume={query.resume === '1'} />;
}
