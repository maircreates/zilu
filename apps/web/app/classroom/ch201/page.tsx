import type { Metadata } from 'next';

import { StudyPackHub } from '@/components/study-packs/study-pack-hub';

export const metadata: Metadata = {
  title: 'Chinese Class — Current Class — ZiLu',
  description: 'A focused CH201 Learning review pack with three current topic units.',
};

export default function Ch201Page() {
  return <StudyPackHub />;
}
