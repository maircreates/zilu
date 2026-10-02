import type { Metadata } from 'next';
import { UnitOneCourse } from '@/components/study-packs/unit-one-course';
export const metadata: Metadata = { title: 'Unit 1 Catch-up Course — ZiLu', description: 'A complete beginner-safe CH201 Unit 1 learning course.' };
export default function UnitOneCoursePage() { return <UnitOneCourse />; }
