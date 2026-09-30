import type { Flashcard } from '../pathways';

export type StudySkill =
  | 'meaning'
  | 'recognition'
  | 'speaking-recall'
  | 'sentence-order';

export type SourceNote = {
  id: string;
  kind: 'conversation' | 'textbook' | 'authored-practice';
  label: string;
  locator?: string;
  encounteredOn?: string;
  verification: 'verified' | 'context-confirmed' | 'needs-review';
  note?: string;
};

export type CanonicalVocabulary = Flashcard & {
  id: string;
  pathwayNumber: number;
  waypointNumber: number;
  deckId: 'a' | 'b';
  cardIndex: number;
};

export type StudyUnit = {
  id: string;
  titleZh: string;
  titlePinyin: string;
  titleEn: string;
  summary: string;
  learningGoals: string[];
  vocabularyIds: string[];
  grammarIds: string[];
  exampleIds: string[];
  speakingPromptIds: string[];
  exerciseIds: string[];
  sourceIds: string[];
};

export type StudyCollection = {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  vocabularyIds?: string[];
  speakingPromptIds?: string[];
  grammarIds?: string[];
};

export type StudyPack = {
  id: 'ch201';
  contentVersion: number;
  title: string;
  titleZh: string;
  description: string;
  sourceContext: string;
  units: StudyUnit[];
  collections: StudyCollection[];
  sources: SourceNote[];
};

export type ExampleSentence = {
  id: string;
  traditional: string;
  pinyin: string;
  english: string;
  vocabularyIds: string[];
  grammarIds: string[];
  sourceIds: string[];
  visibility: 'public-generalized';
};

export type GrammarPattern = {
  id: string;
  title: string;
  pattern: string;
  explanation: string;
  exampleIds: string[];
  canonicalGrammarHref?: string;
  reviewFocus: string;
};

export type SpeakingPrompt = {
  id: string;
  unitId: string;
  promptZh: string;
  promptPinyin: string;
  promptEn: string;
  suggestedAnswerIds: string[];
  vocabularyIds: string[];
  sourceIds: string[];
};

export type CharacterStudy = {
  id: string;
  character: string;
  pinyin: string;
  use: string;
  combination: string;
};

type ExerciseBase = {
  id: string;
  unitId?: string;
  title: string;
  skill: StudySkill;
  targetKeys: string[];
  explanation: string;
  mistakeTag?: string;
  estimatedSeconds: number;
};

export type ChoiceExercise = ExerciseBase & {
  kind: 'choice';
  prompt: string;
  options: Array<{ id: string; text: string }>;
  correctOptionIds: string[];
};

export type SentenceOrderExercise = ExerciseBase & {
  kind: 'sentence-order';
  prompt: string;
  tokens: Array<{ id: string; text: string }>;
  acceptedOrders: string[][];
  answer: string;
};

export type SpeakingExercise = ExerciseBase & {
  kind: 'speaking-recall';
  promptId: string;
};

export type StudyExercise =
  | ChoiceExercise
  | SentenceOrderExercise
  | SpeakingExercise;

export type AttemptResult =
  | 'correct'
  | 'incorrect'
  | 'independent'
  | 'assisted'
  | 'again';

export type SkillProgress = {
  itemKey: string;
  skill: StudySkill;
  attemptCount: number;
  correctCount: number;
  incorrectCount: number;
  selfAssessmentCount: number;
  independentRecallCount: number;
  assistedRecallCount: number;
  lastPracticedAt?: string;
  lastResult?: AttemptResult;
  dueAt?: string;
};

export type AttemptRecord = {
  id: string;
  packId: 'ch201';
  unitId?: string;
  exerciseId: string;
  itemKeys: string[];
  skill: StudySkill;
  result: AttemptResult;
  attemptedAt: string;
  mistakeTag?: string;
};

export type SessionSnapshot = {
  id: string;
  packId: 'ch201';
  contentVersion: number;
  targetMinutes: 5 | 10 | 20;
  unitId?: string;
  exerciseIds: string[];
  currentIndex: number;
  answeredExerciseIds: string[];
  startedAt: string;
  updatedAt: string;
};

export type StudyPackProgressState = {
  schemaVersion: 1;
  contentVersions: Record<string, number>;
  skills: Record<string, SkillProgress>;
  attempts: AttemptRecord[];
  sessions: Record<string, SessionSnapshot>;
};
