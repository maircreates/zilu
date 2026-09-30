import type { ExamId } from './exams';

export type ExamAttempt = {
  id: string;
  examId: ExamId;
  completedAt: string;
  answers: Record<string, string>;
  correctIds: string[];
  total: number;
};

const STORAGE_KEY = 'zilu.ch201ExamAttempts.v1';
const MAX_ATTEMPTS = 24;

export function makeExamAttemptId(examId: ExamId) {
  return `${examId}-${Date.now().toString(36)}`;
}

function isAttempt(value: unknown): value is ExamAttempt {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && typeof item.examId === 'string' && typeof item.completedAt === 'string' && item.answers !== null && typeof item.answers === 'object' && !Array.isArray(item.answers) && Array.isArray(item.correctIds) && item.correctIds.every((id) => typeof id === 'string') && typeof item.total === 'number';
}

export function saveExamAttempt(attempt: ExamAttempt) {
  try {
    const existing = readExamAttempts();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing.filter((item) => item.id !== attempt.id), attempt].slice(-MAX_ATTEMPTS)));
    return true;
  } catch {
    return false;
  }
}

export function readExamAttempts(): ExamAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isAttempt) : [];
  } catch {
    return [];
  }
}

export function getExamAttempt(id: string) {
  return readExamAttempts().find((attempt) => attempt.id === id);
}
