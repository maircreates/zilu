import type {
  CanonicalVocabulary,
  CharacterStudy,
  ExampleSentence,
  GrammarPattern,
  SpeakingPrompt,
  StudyExercise,
  StudyPack,
} from './types';

function duplicateIds(items: Array<{ id: string }>, label: string) {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.id.trim()) errors.push(`${label} has an empty ID.`);
    if (seen.has(item.id)) errors.push(`Duplicate ${label} ID: ${item.id}`);
    seen.add(item.id);
  }
  return errors;
}

function missingRefs(ids: string[], known: Set<string>, location: string) {
  return ids.filter((id) => !known.has(id)).map((id) => `${location} references missing ID: ${id}`);
}

export function validateStudyPack(input: {
  pack: StudyPack;
  vocabulary: CanonicalVocabulary[];
  examples: ExampleSentence[];
  grammar: GrammarPattern[];
  speaking: SpeakingPrompt[];
  exercises: StudyExercise[];
  characters: CharacterStudy[];
}) {
  const { pack, vocabulary, examples, grammar, speaking, exercises, characters } = input;
  const errors = [
    ...duplicateIds(pack.units, 'unit'),
    ...duplicateIds(pack.collections, 'collection'),
    ...duplicateIds(pack.sources, 'source'),
    ...duplicateIds(vocabulary, 'vocabulary'),
    ...duplicateIds(examples, 'example'),
    ...duplicateIds(grammar, 'grammar'),
    ...duplicateIds(speaking, 'speaking prompt'),
    ...duplicateIds(exercises, 'exercise'),
    ...duplicateIds(characters, 'character'),
  ];
  const vocabularyIds = new Set(vocabulary.map((item) => item.id));
  const exampleIds = new Set(examples.map((item) => item.id));
  const grammarIds = new Set(grammar.map((item) => item.id));
  const speakingIds = new Set(speaking.map((item) => item.id));
  const exerciseIds = new Set(exercises.map((item) => item.id));
  const sourceIds = new Set(pack.sources.map((item) => item.id));
  const unitIds = new Set(pack.units.map((item) => item.id));

  for (const unit of pack.units) {
    errors.push(...missingRefs(unit.vocabularyIds, vocabularyIds, `Unit ${unit.id}`));
    errors.push(...missingRefs(unit.exampleIds, exampleIds, `Unit ${unit.id}`));
    errors.push(...missingRefs(unit.grammarIds, grammarIds, `Unit ${unit.id}`));
    errors.push(...missingRefs(unit.speakingPromptIds, speakingIds, `Unit ${unit.id}`));
    errors.push(...missingRefs(unit.exerciseIds, exerciseIds, `Unit ${unit.id}`));
    errors.push(...missingRefs(unit.sourceIds, sourceIds, `Unit ${unit.id}`));
  }
  for (const collection of pack.collections) {
    errors.push(...missingRefs(collection.vocabularyIds ?? [], vocabularyIds, `Collection ${collection.id}`));
    errors.push(...missingRefs(collection.speakingPromptIds ?? [], speakingIds, `Collection ${collection.id}`));
    errors.push(...missingRefs(collection.grammarIds ?? [], grammarIds, `Collection ${collection.id}`));
  }
  for (const example of examples) {
    if (!example.traditional.trim() || !example.pinyin.trim() || !example.english.trim()) errors.push(`Example ${example.id} has empty required text.`);
    errors.push(...missingRefs(example.vocabularyIds, vocabularyIds, `Example ${example.id}`));
    errors.push(...missingRefs(example.grammarIds, grammarIds, `Example ${example.id}`));
    errors.push(...missingRefs(example.sourceIds, sourceIds, `Example ${example.id}`));
    if (example.visibility !== 'public-generalized') errors.push(`Bundled example ${example.id} is not public-generalized.`);
  }
  for (const pattern of grammar) {
    errors.push(...missingRefs(pattern.exampleIds, exampleIds, `Grammar ${pattern.id}`));
    if (!pattern.title.trim() || !pattern.pattern.trim() || !pattern.explanation.trim() || !pattern.reviewFocus.trim()) errors.push(`Grammar ${pattern.id} has empty required text.`);
  }
  for (const prompt of speaking) {
    if (!unitIds.has(prompt.unitId)) errors.push(`Speaking prompt ${prompt.id} has missing unit ${prompt.unitId}.`);
    errors.push(...missingRefs(prompt.suggestedAnswerIds, exampleIds, `Speaking prompt ${prompt.id}`));
    errors.push(...missingRefs(prompt.vocabularyIds, vocabularyIds, `Speaking prompt ${prompt.id}`));
    errors.push(...missingRefs(prompt.sourceIds, sourceIds, `Speaking prompt ${prompt.id}`));
  }
  for (const exercise of exercises) {
    if (exercise.unitId && !unitIds.has(exercise.unitId)) errors.push(`Exercise ${exercise.id} has missing unit ${exercise.unitId}.`);
    if (!exercise.title.trim() || !exercise.explanation.trim()) errors.push(`Exercise ${exercise.id} has empty required text.`);
    if (exercise.kind === 'choice') {
      const optionIds = new Set(exercise.options.map((option) => option.id));
      if (optionIds.size !== exercise.options.length) errors.push(`Choice ${exercise.id} has duplicate option IDs.`);
      if (exercise.options.some((option) => !option.text.trim())) errors.push(`Choice ${exercise.id} has an empty option.`);
      for (const id of exercise.correctOptionIds) if (!optionIds.has(id)) errors.push(`Choice ${exercise.id} has missing correct option ${id}.`);
    }
    if (exercise.kind === 'sentence-order') {
      const tokenIds = exercise.tokens.map((token) => token.id);
      const expected = [...tokenIds].sort().join('|');
      for (const order of exercise.acceptedOrders) if ([...order].sort().join('|') !== expected) errors.push(`Sentence order ${exercise.id} has an answer inconsistent with its tokens.`);
    }
    if (exercise.kind === 'speaking-recall' && !speakingIds.has(exercise.promptId)) errors.push(`Speaking exercise ${exercise.id} has missing prompt ${exercise.promptId}.`);
  }
  return errors;
}
