import type { Metadata } from 'next';
import { ExamsHome } from '@/components/study-packs/exam-prep';
export const metadata: Metadata = { title: 'Exam Preparation — Chinese Class — ZiLu', description: 'Catch-up-first preparation for CH201 unit tests and final.' };
export default function ExamsPage() { return <ExamsHome />; }
