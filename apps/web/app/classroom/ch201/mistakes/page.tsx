import type { Metadata } from 'next';

import { MistakeReview } from '@/components/study-packs/mistake-review';

export const metadata: Metadata = { title: 'Needs Review — Chinese Class — ZiLu', description: 'Review objective errors and self-assessed weak items from Current Class.' };

export default function Ch201MistakesRoute() {
  return <MistakeReview />;
}
