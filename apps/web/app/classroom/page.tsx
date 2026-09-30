import type { Metadata } from 'next';

import { ClassroomIndex } from '@/components/study-packs/classroom-index';

export const metadata: Metadata = {
  title: 'Current Class — ZiLu',
  description: 'Review vocabulary, grammar, sentence patterns, and speaking from your current Chinese class.',
};

export default function ClassroomPage() {
  return <ClassroomIndex />;
}
