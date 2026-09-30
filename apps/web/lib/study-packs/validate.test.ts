import assert from 'node:assert/strict';
import test from 'node:test';

import { validateStudyPack } from './validate.ts';
import type { StudyPack } from './types.ts';

const pack: StudyPack = {
  id: 'ch201', contentVersion: 1, title: 'Class', titleZh: '課', description: 'Test', sourceContext: 'Test', collections: [], sources: [],
  units: [{ id: 'unit', titleZh: '課', titlePinyin: 'Kè', titleEn: 'Unit', summary: 'Test', learningGoals: ['Learn'], vocabularyIds: ['missing'], grammarIds: [], exampleIds: [], speakingPromptIds: [], exerciseIds: [], sourceIds: [] }],
};

void test('validator rejects unresolved canonical references', () => {
  const errors = validateStudyPack({ pack, vocabulary: [], examples: [], grammar: [], speaking: [], exercises: [], characters: [] });
  assert.ok(errors.some((message) => message.includes('missing ID: missing')));
});

void test('validator rejects a choice answer that is not an option', () => {
  const errors = validateStudyPack({
    pack: { ...pack, units: [{ ...pack.units[0], vocabularyIds: [], exerciseIds: ['choice'] }] },
    vocabulary: [], examples: [], grammar: [], speaking: [], characters: [],
    exercises: [{ id: 'choice', kind: 'choice', unitId: 'unit', title: 'Choice', prompt: 'Pick', options: [{ id: 'a', text: 'A' }], correctOptionIds: ['b'], explanation: 'No', skill: 'meaning', targetKeys: ['vocabulary:test'], estimatedSeconds: 30 }],
  });
  assert.ok(errors.some((message) => message.includes('missing correct option b')));
});

void test('sentence order supports repeated text through distinct token IDs', () => {
  const exercise = { id: 'order', kind: 'sentence-order' as const, unitId: 'unit', title: 'Order', prompt: 'Build', tokens: [{ id: 'you-1', text: '有' }, { id: 'time', text: '時候' }, { id: 'you-2', text: '有' }], acceptedOrders: [['you-1', 'time', 'you-2']], answer: '有時候有', explanation: 'Distinct IDs preserve repeated text.', skill: 'sentence-order' as const, targetKeys: ['grammar:test'], estimatedSeconds: 30 };
  const errors = validateStudyPack({ pack: { ...pack, units: [{ ...pack.units[0], vocabularyIds: [], exerciseIds: ['order'] }] }, vocabulary: [], examples: [], grammar: [], speaking: [], characters: [], exercises: [exercise] });
  assert.deepEqual(errors, []);
});
