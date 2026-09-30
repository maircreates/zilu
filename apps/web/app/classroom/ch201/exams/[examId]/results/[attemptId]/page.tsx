import { ExamResults } from '@/components/study-packs/exam-prep';
export default async function ExamResultsPage({ params }: { params: Promise<{ examId: string; attemptId: string }> }) { const { examId, attemptId } = await params; return <ExamResults examId={examId} attemptId={attemptId} />; }
