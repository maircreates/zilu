import assert from 'node:assert/strict';
import test from 'node:test';

import { buildReviewExerciseIds } from './review.ts';
import type { StudyExercise, StudyPackProgressState } from './types.ts';

const exercise = (id: string, unitId: string, itemKey: string): StudyExercise => ({
  id,
  kind: 'choice',
  unitId,
  title: id,
  prompt: id,
  options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
  correctOptionIds: ['yes'],
  explanation: 'Because.',
  skill: 'meaning',
  targetKeys: [itemKey],
  estimatedSeconds: 60,
});

const empty: StudyPackProgressState = { schemaVersion: 1, contentVersions: {}, skills: {}, attempts: [], sessions: {} };

void test('review prioritizes weak items before unpracticed items', () => {
  const exercises = [exercise('new', 'one', 'vocabulary:new'), exercise('weak', 'one', 'vocabulary:weak')];
  const state: StudyPackProgressState = {
    ...empty,
    skills: {
      'vocabulary:weak|meaning': { itemKey: 'vocabulary:weak', skill: 'meaning', attemptCount: 1, correctCount: 0, incorrectCount: 1, selfAssessmentCount: 0, independentRecallCount: 0, assistedRecallCount: 0, lastResult: 'incorrect' },
    },
  };
  assert.deepEqual(buildReviewExerciseIds({ exercises, state, targetMinutes: 5 }), ['weak', 'new']);
});

void test('review honors unit and vocabulary filters without duplicates', () => {
  const exercises = [exercise('one-a', 'one', 'vocabulary:a'), exercise('one-b', 'one', 'vocabulary:b'), exercise('two-a', 'two', 'vocabulary:a')];
  assert.deepEqual(buildReviewExerciseIds({ exercises, state: empty, targetMinutes: 5, unitId: 'one', allowedVocabularyIds: ['a'] }), ['one-a']);
});
