import type { Metadata } from 'next';
import { ExamPage } from '@/components/study-packs/exam-prep';
import { getCh201Exam } from '@/lib/study-packs/exams';
type Props = { params: Promise<{ examId: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { examId } = await params; const exam = getCh201Exam(examId); return { title: exam ? `${exam.title} — ZiLu` : 'Exam Preparation — ZiLu' }; }
export default async function ExamLearnPage({ params }: Props) { const { examId } = await params; return <ExamPage examId={examId} />; }
