import type { StudyExercise, StudyPackProgressState } from './types';

function exercisePriority(exercise: StudyExercise, state: StudyPackProgressState, now: number) {
  const matching = Object.values(state.skills).filter(
    (progress) => progress.skill === exercise.skill && exercise.targetKeys.includes(progress.itemKey),
  );
  if (matching.some((progress) => progress.lastResult === 'incorrect' || progress.lastResult === 'again' || progress.lastResult === 'assisted')) return 0;
  if (matching.some((progress) => progress.dueAt && Date.parse(progress.dueAt) <= now)) return 1;
  if (matching.length === 0) return 2;
  return 3;
}

export function buildReviewExerciseIds(input: {
  exercises: StudyExercise[];
  state: StudyPackProgressState;
  targetMinutes: 5 | 10 | 20;
  unitId?: string;
  allowedVocabularyIds?: string[];
  now?: number;
}) {
  const allowedKeys = input.allowedVocabularyIds?.map((id) => `vocabulary:${id}`);
  const eligible = input.exercises.filter((exercise) => {
    if (input.unitId && exercise.unitId !== input.unitId) return false;
    if (allowedKeys && !exercise.targetKeys.some((key) => allowedKeys.includes(key))) return false;
    return true;
  });
  const now = input.now ?? Date.now();
  const sorted: StudyExercise[] = [];
  const kinds: StudyExercise['kind'][] = ['choice', 'sentence-order', 'speaking-recall'];
  for (const priority of [0, 1, 2, 3]) {
    const queues = kinds.map((kind) => eligible.filter((exercise) => exercise.kind === kind && exercisePriority(exercise, input.state, now) === priority).sort((a, b) => a.id.localeCompare(b.id)));
    let remaining = queues.reduce((total, queue) => total + queue.length, 0);
    while (remaining > 0) {
      for (const queue of queues) {
        const next = queue.shift();
        if (next) {
          sorted.push(next);
          remaining -= 1;
        }
      }
    }
  }
  const targetSeconds = input.targetMinutes * 60;
  const selected: string[] = [];
  let duration = 0;
  for (const exercise of sorted) {
    if (selected.length > 0 && duration >= targetSeconds) break;
    selected.push(exercise.id);
    duration += exercise.estimatedSeconds;
  }
  return selected;
}

export function exerciseNeedsReview(exercise: StudyExercise, state: StudyPackProgressState) {
  return Object.values(state.skills).some(
    (progress) =>
      progress.skill === exercise.skill &&
      exercise.targetKeys.includes(progress.itemKey) &&
      (progress.lastResult === 'incorrect' || progress.lastResult === 'again' || progress.lastResult === 'assisted'),
  );
}

export function practicedSkillCount(state: StudyPackProgressState) {
  return Object.keys(state.skills).length;
}
