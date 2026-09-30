'use client';

import { useSyncExternalStore } from 'react';

import type {
  AttemptRecord,
  AttemptResult,
  SessionSnapshot,
  StudyPackProgressState,
  StudySkill,
} from './types';

export const STUDY_PACK_STORAGE_KEY = 'zilu.studyPacks.v1';
const MAX_ATTEMPTS = 240;

export const EMPTY_STUDY_PACK_PROGRESS: StudyPackProgressState = {
  schemaVersion: 1,
  contentVersions: {},
  skills: {},
  attempts: [],
  sessions: {},
};

type Listener = () => void;
let listeners: Listener[] = [];
let currentState = EMPTY_STUDY_PACK_PROGRESS;
let loaded = false;
let persistenceAvailable = true;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

const SKILLS = new Set(['meaning', 'recognition', 'speaking-recall', 'sentence-order']);
const RESULTS = new Set(['correct', 'incorrect', 'independent', 'assisted', 'again']);

function isSkillProgress(value: unknown): value is StudyPackProgressState['skills'][string] {
  return isRecord(value) && typeof value.itemKey === 'string' && typeof value.skill === 'string' && SKILLS.has(value.skill) && typeof value.attemptCount === 'number' && typeof value.correctCount === 'number' && typeof value.incorrectCount === 'number' && typeof value.selfAssessmentCount === 'number' && typeof value.independentRecallCount === 'number' && typeof value.assistedRecallCount === 'number' && (value.lastResult === undefined || typeof value.lastResult === 'string' && RESULTS.has(value.lastResult));
}

function isAttempt(value: unknown): value is AttemptRecord {
  return isRecord(value) && typeof value.id === 'string' && value.packId === 'ch201' && typeof value.exerciseId === 'string' && Array.isArray(value.itemKeys) && value.itemKeys.every((item) => typeof item === 'string') && typeof value.skill === 'string' && SKILLS.has(value.skill) && typeof value.result === 'string' && RESULTS.has(value.result) && typeof value.attemptedAt === 'string';
}

function isSession(value: unknown): value is SessionSnapshot {
  return isRecord(value) && typeof value.id === 'string' && value.packId === 'ch201' && value.contentVersion === 1 && (value.targetMinutes === 5 || value.targetMinutes === 10 || value.targetMinutes === 20) && Array.isArray(value.exerciseIds) && value.exerciseIds.every((item) => typeof item === 'string') && Number.isInteger(value.currentIndex) && Number(value.currentIndex) >= 0 && Array.isArray(value.answeredExerciseIds) && value.answeredExerciseIds.every((item) => typeof item === 'string') && typeof value.startedAt === 'string' && typeof value.updatedAt === 'string';
}

export function parseStudyPackProgress(raw: string | null): StudyPackProgressState {
  if (!raw) return EMPTY_STUDY_PACK_PROGRESS;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.schemaVersion !== 1) return EMPTY_STUDY_PACK_PROGRESS;
    if (!isRecord(value.contentVersions) || !isRecord(value.skills) || !Array.isArray(value.attempts) || !isRecord(value.sessions)) return EMPTY_STUDY_PACK_PROGRESS;
    const contentVersions = Object.fromEntries(Object.entries(value.contentVersions).filter((entry): entry is [string, number] => typeof entry[1] === 'number'));
    const skills = Object.fromEntries(Object.entries(value.skills).filter((entry): entry is [string, StudyPackProgressState['skills'][string]] => isSkillProgress(entry[1])));
    const attempts = value.attempts.filter(isAttempt).slice(-MAX_ATTEMPTS);
    const sessions = Object.fromEntries(Object.entries(value.sessions).filter((entry): entry is [string, SessionSnapshot] => isSession(entry[1])));
    return {
      schemaVersion: 1,
      contentVersions,
      skills,
      attempts,
      sessions,
    };
  } catch {
    return EMPTY_STUDY_PACK_PROGRESS;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    currentState = parseStudyPackProgress(window.localStorage.getItem(STUDY_PACK_STORAGE_KEY));
    persistenceAvailable = true;
  } catch {
    currentState = EMPTY_STUDY_PACK_PROGRESS;
    persistenceAvailable = false;
  }
}

function notify() {
  for (const listener of listeners) listener();
}

function persist(next: StudyPackProgressState) {
  currentState = next;
  try {
    window.localStorage.setItem(STUDY_PACK_STORAGE_KEY, JSON.stringify(next));
    persistenceAvailable = true;
  } catch {
    persistenceAvailable = false;
  }
  notify();
}

function subscribe(listener: Listener) {
  ensureLoaded();
  listeners = [...listeners, listener];
  listener();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STUDY_PACK_STORAGE_KEY) return;
    currentState = parseStudyPackProgress(event.newValue);
    notify();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot() {
  ensureLoaded();
  return currentState;
}

function getServerSnapshot() {
  return EMPTY_STUDY_PACK_PROGRESS;
}

export function useStudyPackProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { state, persistenceAvailable };
}

function progressKey(itemKey: string, skill: StudySkill) {
  return `${itemKey}|${skill}`;
}

function dueDate(result: AttemptResult, attemptedAt: string) {
  const date = new Date(attemptedAt);
  const days = result === 'correct' || result === 'independent' ? 3 : result === 'assisted' ? 1 : 0;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export function recordStudyAttempt(input: Omit<AttemptRecord, 'attemptedAt'> & { attemptedAt?: string }) {
  ensureLoaded();
  const attemptedAt = input.attemptedAt ?? new Date().toISOString();
  const attempt: AttemptRecord = { ...input, attemptedAt };
  const next = applyStudyAttempt(currentState, attempt);
  if (next === currentState) return;
  persist(next);
}

export function applyStudyAttempt(state: StudyPackProgressState, attempt: AttemptRecord) {
  if (state.attempts.some((item) => item.id === attempt.id)) return state;
  const skills = { ...state.skills };
  for (const itemKey of attempt.itemKeys) {
    const key = progressKey(itemKey, attempt.skill);
    const previous = skills[key] ?? {
      itemKey,
      skill: attempt.skill,
      attemptCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      selfAssessmentCount: 0,
      independentRecallCount: 0,
      assistedRecallCount: 0,
    };
    const objective = attempt.result === 'correct' || attempt.result === 'incorrect';
    skills[key] = {
      ...previous,
      attemptCount: previous.attemptCount + 1,
      correctCount: previous.correctCount + (attempt.result === 'correct' ? 1 : 0),
      incorrectCount: previous.incorrectCount + (attempt.result === 'incorrect' ? 1 : 0),
      selfAssessmentCount: previous.selfAssessmentCount + (objective ? 0 : 1),
      independentRecallCount: previous.independentRecallCount + (attempt.result === 'independent' ? 1 : 0),
      assistedRecallCount: previous.assistedRecallCount + (attempt.result === 'assisted' || attempt.result === 'again' ? 1 : 0),
      lastPracticedAt: attempt.attemptedAt,
      lastResult: attempt.result,
      dueAt: dueDate(attempt.result, attempt.attemptedAt),
    };
  }
  return {
    ...state,
    contentVersions: { ...state.contentVersions, ch201: 1 },
    skills,
    attempts: [...state.attempts, attempt].slice(-MAX_ATTEMPTS),
  };
}

export function saveStudySession(snapshot: SessionSnapshot) {
  ensureLoaded();
  persist({
    ...currentState,
    contentVersions: { ...currentState.contentVersions, [snapshot.packId]: snapshot.contentVersion },
    sessions: { ...currentState.sessions, [snapshot.packId]: snapshot },
  });
}

export function clearStudySession(packId: string) {
  ensureLoaded();
  const sessions = { ...currentState.sessions };
  delete sessions[packId];
  persist({ ...currentState, sessions });
}

export function resetStudyPackProgress(packId: string) {
  ensureLoaded();
  const sessions = { ...currentState.sessions };
  const contentVersions = { ...currentState.contentVersions };
  delete sessions[packId];
  delete contentVersions[packId];
  persist({
    ...currentState,
    contentVersions,
    skills: {},
    attempts: currentState.attempts.filter((attempt) => attempt.packId !== packId),
    sessions,
  });
}

export function makeAttemptId(sessionId: string, exerciseId: string) {
  return `${sessionId}:${exerciseId}`;
}
