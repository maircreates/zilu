import type { Metadata } from 'next';
import { TestsHome } from '@/components/study-packs/exam-prep';
export const metadata: Metadata = { title: 'Tests — Chinese Class — ZiLu', description: 'CH201 test preparation, practice, and results in one place.' };
export default function TestsPage() { return <TestsHome />; }
