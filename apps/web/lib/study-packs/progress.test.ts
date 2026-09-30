import assert from 'node:assert/strict';
import test from 'node:test';

import { applyStudyAttempt, EMPTY_STUDY_PACK_PROGRESS, parseStudyPackProgress } from './progress.ts';

void test('malformed and unknown storage records fall back safely', () => {
  assert.deepEqual(parseStudyPackProgress('{bad json'), EMPTY_STUDY_PACK_PROGRESS);
  assert.deepEqual(parseStudyPackProgress(JSON.stringify({ schemaVersion: 99 })), EMPTY_STUDY_PACK_PROGRESS);
});

void test('valid storage is parsed and bounded', () => {
  const attempts = Array.from({ length: 250 }, (_, index) => ({ id: String(index), packId: 'ch201', exerciseId: 'x', itemKeys: [], skill: 'meaning', result: 'correct', attemptedAt: '2026-09-30T00:00:00.000Z' }));
  const parsed = parseStudyPackProgress(JSON.stringify({ schemaVersion: 1, contentVersions: { ch201: 1 }, skills: {}, attempts, sessions: {} }));
  assert.equal(parsed.attempts.length, 240);
  assert.equal(parsed.attempts[0]?.id, '10');
});

void test('invalid nested storage records are discarded without crashing', () => {
  const parsed = parseStudyPackProgress(JSON.stringify({ schemaVersion: 1, contentVersions: { ch201: 1 }, skills: { broken: null }, attempts: [null], sessions: { ch201: { targetMinutes: 99 } } }));
  assert.deepEqual(parsed.skills, {});
  assert.deepEqual(parsed.attempts, []);
  assert.deepEqual(parsed.sessions, {});
});

void test('the same attempt ID is counted only once', () => {
  const attempt = { id: 'session:exercise', packId: 'ch201' as const, exerciseId: 'exercise', itemKeys: ['vocabulary:word'], skill: 'meaning' as const, result: 'incorrect' as const, attemptedAt: '2026-09-30T00:00:00.000Z' };
  const once = applyStudyAttempt(EMPTY_STUDY_PACK_PROGRESS, attempt);
  const twice = applyStudyAttempt(once, attempt);
  assert.equal(twice.attempts.length, 1);
  assert.equal(twice.skills['vocabulary:word|meaning']?.attemptCount, 1);
});
