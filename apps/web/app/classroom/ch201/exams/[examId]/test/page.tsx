import { ExamPage } from '@/components/study-packs/exam-prep';
export default async function ExamTestPage({ params }: { params: Promise<{ examId: string }> }) { const { examId } = await params; return <ExamPage examId={examId} mode="test" />; }
