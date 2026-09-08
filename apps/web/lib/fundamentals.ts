/**
 * Original ZiLu content for the Start Here fundamentals page: a single-page
 * orientation for someone with zero prior Chinese. It follows the beginner
 * sequence sketched in docs/start-here-curriculum.md but is written from
 * scratch -- no textbook text, dialogues, or exercises are reproduced.
 */

export type Example = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

/** Sections, in learning order. Drives the on-page table of contents. */
export const SECTIONS = [
  { id: 'orientation', num: '01', title: 'What you are learning' },
  { id: 'characters', num: '02', title: 'How characters work' },
  { id: 'pinyin', num: '03', title: 'Pinyin, the sound system' },
  { id: 'tones', num: '04', title: 'The tones' },
  { id: 'sounds', num: '05', title: 'Sounds that trip up English speakers' },
  { id: 'pronouns', num: '06', title: 'People words' },
  { id: 'sentences', num: '07', title: 'Building a sentence' },
  { id: 'particles', num: '08', title: 'Little words that do a lot' },
  { id: 'measure-words', num: '09', title: 'Measure words' },
  { id: 'numbers', num: '10', title: 'Numbers, dates, and time' },
  { id: 'phrases', num: '11', title: 'Survival phrases' },
  { id: 'study', num: '12', title: 'How to study with ZiLu' },
] as const;

export type ToneCard = {
  id: string;
  toneNumber: 1 | 2 | 3 | 4 | 0;
  mark: string;
  contour: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
};

// The classic ma1-ma5 set: one syllable, five words, told apart only by tone.
// Widely used for teaching tone and safe to present without a source.
export const TONES: ToneCard[] = [
  {
    id: 'tone-1',
    toneNumber: 1,
    mark: 'ā',
    contour: 'High and flat, like holding one steady musical note.',
    hanzi: '媽',
    pinyin: 'mā',
    meaning: 'mother',
  },
  {
    id: 'tone-2',
    toneNumber: 2,
    mark: 'á',
    contour: 'Rises from mid to high, like asking "what?" in English.',
    hanzi: '麻',
    pinyin: 'má',
    meaning: 'hemp; numb',
  },
  {
    id: 'tone-3',
    toneNumber: 3,
    mark: 'ǎ',
    contour: 'Dips low, then often rises a little at the end.',
    hanzi: '馬',
    pinyin: 'mǎ',
    meaning: 'horse',
  },
  {
    id: 'tone-4',
    toneNumber: 4,
    mark: 'à',
    contour: 'Falls sharply from high to low, like a firm command.',
    hanzi: '罵',
    pinyin: 'mà',
    meaning: 'to scold',
  },
  {
    id: 'tone-neutral',
    toneNumber: 0,
    mark: 'a',
    contour: 'Short, light, and quick, with no strong pitch of its own.',
    hanzi: '嗎',
    pinyin: 'ma',
    meaning: 'question particle',
  },
];

export type SoundContrast = {
  pair: string;
  example: string;
  tip: string;
};

export const SOUND_CONTRASTS: SoundContrast[] = [
  {
    pair: 'j / q / x',
    example: '雞 (jī) · 七 (qī) · 西 (xī)',
    tip: 'A soft, smiling set made near the front teeth. j is unvoiced, q adds a puff of air, x is a light "sh". None of them sound like English j.',
  },
  {
    pair: 'zh / ch / sh / r',
    example: '知 (zhī) · 吃 (chī) · 是 (shì) · 日 (rì)',
    tip: 'Made with the tongue curled back. zh is like "j" in "jump", ch like "ch" in "church", sh like "sh" in "shirt", and r is a buzzing sound between English "r" and "zh".',
  },
  {
    pair: 'c / z',
    example: '菜 (cài) · 在 (zài)',
    tip: 'c has a puff of air, like the "ts" in "cats". z has none, like the "ds" in "reads".',
  },
  {
    pair: 'b / d / g',
    example: '爸 (bà) · 大 (dà) · 個 (gè)',
    tip: 'These are unvoiced and unaspirated -- softer than English b, d, g. They sit closer to English p, t, k said gently.',
  },
  {
    pair: 'ü',
    example: '女 (nǚ) · 綠 (lǜ)',
    tip: 'Say "ee" but round your lips as if for "oo". No English equivalent. Written "u" after j, q, x, y.',
  },
  {
    pair: '-n / -ng',
    example: '心 (xīn) · 星 (xīng)',
    tip: '-n ends with the tongue tip on the ridge behind the teeth. -ng ends in the back of the mouth, with the tongue tip down, like "sing".',
  },
];

export type SentencePattern = {
  id: string;
  title: string;
  template: string;
  explanation: string;
  example: Example;
};

export const SENTENCE_PATTERNS: SentencePattern[] = [
  {
    id: 'svo',
    title: 'Subject, verb, object',
    template: 'Subject + Verb + Object',
    explanation:
      'The basic order matches English: doer, then action, then what it acts on.',
    example: {
      hanzi: '我喝茶。',
      pinyin: 'wǒ hē chá.',
      meaning: 'I drink tea.',
    },
  },
  {
    id: 'no-conjugation',
    title: 'Verbs never change form',
    template: 'Verb stays identical for every subject and every time',
    explanation:
      'No -s, -ed, or -ing. 喝 is 喝 whether it is I, he, yesterday, or tomorrow. Time words and small particles carry the "when".',
    example: {
      hanzi: '昨天他也喝茶。',
      pinyin: 'zuótiān tā yě hē chá.',
      meaning: 'Yesterday he drank tea too.',
    },
  },
  {
    id: 'to-be',
    title: 'Identifying with 是',
    template: 'Subject + 是 (shì) + Noun',
    explanation:
      '是 links a subject to a noun, like "am / is / are". Do not use it before an adjective.',
    example: {
      hanzi: '我是學生。',
      pinyin: 'wǒ shì xuésheng.',
      meaning: 'I am a student.',
    },
  },
  {
    id: 'adjective',
    title: 'Describing with 很 + adjective',
    template: 'Subject + 很 (hěn) + Adjective',
    explanation:
      'An adjective is the whole predicate -- no "is" needed. 很 usually just connects the two and does not have to mean "very".',
    example: {
      hanzi: '天氣很冷。',
      pinyin: 'tiānqì hěn lěng.',
      meaning: 'The weather is cold.',
    },
  },
  {
    id: 'have',
    title: 'Having or existing with 有',
    template: 'Subject + 有 (yǒu) + Noun',
    explanation:
      '有 covers both "to have" and "there is". Its negative is always 沒有, never 不有.',
    example: {
      hanzi: '我有時間。',
      pinyin: 'wǒ yǒu shíjiān.',
      meaning: 'I have time.',
    },
  },
  {
    id: 'negation',
    title: 'Saying no: 不 and 沒',
    template:
      '不 (bù) for most things · 沒 (méi) for "did not" and "do not have"',
    explanation:
      'Use 不 for habits, opinions, and the future. Use 沒 for a past action that did not happen and for not having something.',
    example: {
      hanzi: '我不喝咖啡，昨天也沒喝。',
      pinyin: 'wǒ bù hē kāfēi, zuótiān yě méi hē.',
      meaning: 'I do not drink coffee, and I did not drink any yesterday.',
    },
  },
  {
    id: 'yes-no',
    title: 'Yes / no questions with 嗎',
    template: 'Statement + 嗎 (ma) ?',
    explanation:
      'Add 嗎 to the end of any statement. Nothing else moves -- the word order stays exactly the same.',
    example: {
      hanzi: '你是學生嗎？',
      pinyin: 'nǐ shì xuésheng ma?',
      meaning: 'Are you a student?',
    },
  },
  {
    id: 'question-words',
    title: 'What / who / where questions',
    template: 'Put the question word where the answer would go',
    explanation:
      'The question word stays in place -- it does not jump to the front. 你叫什麼名字 is literally "you called what name".',
    example: {
      hanzi: '你叫什麼名字？',
      pinyin: 'nǐ jiào shénme míngzi?',
      meaning: 'What is your name?',
    },
  },
  {
    id: 'time-placement',
    title: 'Where time words go',
    template: 'Time word comes early -- before or just after the subject',
    explanation:
      'When something happens is stated near the start of the sentence, not tacked on at the end like in English.',
    example: {
      hanzi: '明天我去學校。',
      pinyin: 'míngtiān wǒ qù xuéxiào.',
      meaning: 'I am going to school tomorrow.',
    },
  },
];

export type Particle = {
  hanzi: string;
  pinyin: string;
  role: string;
  example: Example;
};

export const PARTICLES: Particle[] = [
  {
    hanzi: '的',
    pinyin: 'de',
    role: 'links an owner to a thing, like apostrophe-s or "of"',
    example: {
      hanzi: '老師的名字',
      pinyin: 'lǎoshī de míngzi',
      meaning: "the teacher's name",
    },
  },
  {
    hanzi: '了',
    pinyin: 'le',
    role: 'marks a change of state or a completed action',
    example: {
      hanzi: '我懂了。',
      pinyin: 'wǒ dǒng le.',
      meaning: 'Now I understand.',
    },
  },
  {
    hanzi: '嗎',
    pinyin: 'ma',
    role: 'turns a statement into a yes / no question',
    example: {
      hanzi: '你好嗎？',
      pinyin: 'nǐ hǎo ma?',
      meaning: 'How are you?',
    },
  },
  {
    hanzi: '呢',
    pinyin: 'ne',
    role: 'bounces the same question back',
    example: {
      hanzi: '我很好，你呢？',
      pinyin: 'wǒ hěn hǎo, nǐ ne?',
      meaning: 'I am well, and you?',
    },
  },
  {
    hanzi: '吧',
    pinyin: 'ba',
    role: 'softens a sentence into a suggestion or a guess',
    example: {
      hanzi: '我們走吧。',
      pinyin: 'wǒmen zǒu ba.',
      meaning: 'Let us go.',
    },
  },
];

export const PRONOUNS: Example[] = [
  { hanzi: '我', pinyin: 'wǒ', meaning: 'I; me' },
  { hanzi: '你', pinyin: 'nǐ', meaning: 'you (one person)' },
  { hanzi: '您', pinyin: 'nín', meaning: 'you (polite -- elders, teachers)' },
  { hanzi: '他', pinyin: 'tā', meaning: 'he; him' },
  { hanzi: '她', pinyin: 'tā', meaning: 'she; her' },
  { hanzi: '我們', pinyin: 'wǒ men', meaning: 'we; us' },
  { hanzi: '你們', pinyin: 'nǐ men', meaning: 'you (more than one)' },
  { hanzi: '他們', pinyin: 'tā men', meaning: 'they; them' },
];

export type MeasureWord = {
  hanzi: string;
  pinyin: string;
  use: string;
  example: Example;
};

export const MEASURE_WORDS: MeasureWord[] = [
  {
    hanzi: '個',
    pinyin: 'ge',
    use: 'the all-purpose one -- reach for it when unsure',
    example: { hanzi: '三個人', pinyin: 'sān ge rén', meaning: 'three people' },
  },
  {
    hanzi: '本',
    pinyin: 'běn',
    use: 'books and bound things',
    example: { hanzi: '一本書', pinyin: 'yì běn shū', meaning: 'one book' },
  },
  {
    hanzi: '隻',
    pinyin: 'zhī',
    use: 'many animals, and one of a pair',
    example: { hanzi: '一隻貓', pinyin: 'yì zhī māo', meaning: 'one cat' },
  },
  {
    hanzi: '杯',
    pinyin: 'bēi',
    use: 'a cup or glass of something',
    example: {
      hanzi: '一杯水',
      pinyin: 'yì bēi shuǐ',
      meaning: 'a glass of water',
    },
  },
  {
    hanzi: '張',
    pinyin: 'zhāng',
    use: 'flat things -- paper, tickets, tables',
    example: {
      hanzi: '一張紙',
      pinyin: 'yì zhāng zhǐ',
      meaning: 'one sheet of paper',
    },
  },
];

export const NUMBERS: Example[] = [
  { hanzi: '零', pinyin: 'líng', meaning: '0' },
  { hanzi: '一', pinyin: 'yī', meaning: '1' },
  { hanzi: '二', pinyin: 'èr', meaning: '2' },
  { hanzi: '三', pinyin: 'sān', meaning: '3' },
  { hanzi: '四', pinyin: 'sì', meaning: '4' },
  { hanzi: '五', pinyin: 'wǔ', meaning: '5' },
  { hanzi: '六', pinyin: 'liù', meaning: '6' },
  { hanzi: '七', pinyin: 'qī', meaning: '7' },
  { hanzi: '八', pinyin: 'bā', meaning: '8' },
  { hanzi: '九', pinyin: 'jiǔ', meaning: '9' },
  { hanzi: '十', pinyin: 'shí', meaning: '10' },
];

export const NUMBER_BUILD: Example[] = [
  { hanzi: '十一', pinyin: 'shí yī', meaning: '11 = ten, one' },
  { hanzi: '二十', pinyin: 'èr shí', meaning: '20 = two, ten' },
  { hanzi: '三十五', pinyin: 'sān shí wǔ', meaning: '35 = three, ten, five' },
  { hanzi: '一百', pinyin: 'yì bǎi', meaning: '100' },
];

export const TIME_WORDS: Example[] = [
  { hanzi: '今天', pinyin: 'jīn tiān', meaning: 'today' },
  { hanzi: '明天', pinyin: 'míng tiān', meaning: 'tomorrow' },
  { hanzi: '昨天', pinyin: 'zuó tiān', meaning: 'yesterday' },
  { hanzi: '現在', pinyin: 'xiàn zài', meaning: 'now' },
  { hanzi: '以前', pinyin: 'yǐ qián', meaning: 'before; in the past' },
  { hanzi: '以後', pinyin: 'yǐ hòu', meaning: 'after; from now on' },
];

export type PhraseCard = Example & { situation: string };

export const SURVIVAL_PHRASES: PhraseCard[] = [
  {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'hello',
    situation: 'Greeting one person',
  },
  {
    hanzi: '請問',
    pinyin: 'qǐng wèn',
    meaning: 'excuse me (may I ask)',
    situation: 'Starting a question with a stranger',
  },
  {
    hanzi: '謝謝',
    pinyin: 'xiè xie',
    meaning: 'thank you',
    situation: 'Showing thanks',
  },
  {
    hanzi: '不客氣',
    pinyin: 'bú kè qi',
    meaning: 'you are welcome',
    situation: 'Replying to thanks',
  },
  {
    hanzi: '對不起',
    pinyin: 'duì bu qǐ',
    meaning: 'sorry',
    situation: 'Apologizing',
  },
  {
    hanzi: '沒關係',
    pinyin: 'méi guān xi',
    meaning: 'it is okay',
    situation: 'Accepting an apology',
  },
  {
    hanzi: '我不懂',
    pinyin: 'wǒ bù dǒng',
    meaning: 'I do not understand',
    situation: 'When you are lost',
  },
  {
    hanzi: '請再說一次',
    pinyin: 'qǐng zài shuō yí cì',
    meaning: 'please say it again',
    situation: 'Asking for a repeat',
  },
  {
    hanzi: '慢一點',
    pinyin: 'màn yì diǎn',
    meaning: 'a bit slower',
    situation: 'When someone is talking too fast',
  },
  {
    hanzi: '再見',
    pinyin: 'zài jiàn',
    meaning: 'goodbye',
    situation: 'Ending a conversation',
  },
];

export type StudyTip = { title: string; text: string };

export const STUDY_TIPS: StudyTip[] = [
  {
    title: 'Hear every word',
    text: 'Tap the audio before you decide you know a card. Reading pinyin in your head is not the same as hearing the tones.',
  },
  {
    title: 'Say it out loud',
    text: 'Even a whisper. Your mouth needs the reps as much as your eyes do.',
  },
  {
    title: 'Use the guided loop',
    text: 'On any deck, Guided study shows one card at a time and keeps bringing back the ones you miss until the whole deck sticks.',
  },
  {
    title: 'Drop the pinyin crutch',
    text: 'The Pinyinciation switch moves pinyin to the back of the card. Turn it off for a deck once you can read its characters without help.',
  },
  {
    title: 'Short and often',
    text: 'Ten minutes a day beats two hours once a week. Chinese rewards steady contact more than long cramming.',
  },
];
