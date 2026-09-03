export type LanguageItem = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

type StageBase = {
  id: string;
  label: string;
  title: string;
  instruction: string;
};

export type MeetStage = StageBase & {
  kind: 'meet';
  phrase: LanguageItem;
  context: string;
};

export type ListenStage = StageBase & {
  kind: 'listen';
  utterances: Array<LanguageItem & { speech: string }>;
};

export type NoticeStage = StageBase & {
  kind: 'notice';
  items: LanguageItem[];
  note: string;
};

export type ChoiceStage = StageBase & {
  kind: 'choice';
  prompt: string;
  choices: Array<LanguageItem & { id: string; correct: boolean; feedback: string }>;
};

export type RecallStage = StageBase & {
  kind: 'recall';
  prompt: string;
  answer: string;
  acceptedAnswers: string[];
  hint: string;
};

export type ReviewStage = StageBase & {
  kind: 'review';
  learned: string[];
  next: string;
};

export type LessonStage = MeetStage | ListenStage | NoticeStage | ChoiceStage | RecallStage | ReviewStage;

export type Lesson = {
  id: string;
  pathway: string;
  number: number;
  title: string;
  objective: string;
  estimatedMinutes: number;
  stages: LessonStage[];
};
