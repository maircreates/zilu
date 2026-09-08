/**
 * Original ZiLu content for the Start Here fundamentals page. This is a
 * standalone reference for learners with zero prior Chinese knowledge, kept
 * separate from the Pathway/Waypoint/Deck curriculum data in `pathways.ts`.
 * See docs/start-here-curriculum.md for the fuller planned lesson sequence;
 * this page is a condensed, original single-page bridge into it.
 */

export type FundamentalsExample = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type ToneCard = {
  id: string;
  toneNumber: 1 | 2 | 3 | 4 | 0;
  contour: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type SoundContrast = {
  pair: string;
  example: string;
  tip: string;
};

export type SentencePattern = {
  id: string;
  title: string;
  template: string;
  explanation: string;
  example: FundamentalsExample;
};

export type PhraseCard = FundamentalsExample & { situation: string };

// The classic ma1-ma5 set: one syllable, five different words, told apart only
// by tone. Widely used for teaching tone and safe to present without a source.
export const TONES: ToneCard[] = [
  {
    id: 'tone-1',
    toneNumber: 1,
    contour: 'High and flat, like holding one steady musical note.',
    hanzi: '媽',
    pinyin: 'mā',
    meaning: 'mother',
  },
  {
    id: 'tone-2',
    toneNumber: 2,
    contour: 'Rises from mid to high, like asking "what?" in English.',
    hanzi: '麻',
    pinyin: 'má',
    meaning: 'hemp; numb',
  },
  {
    id: 'tone-3',
    toneNumber: 3,
    contour: 'Dips low, then often rises a little at the end.',
    hanzi: '馬',
    pinyin: 'mǎ',
    meaning: 'horse',
  },
  {
    id: 'tone-4',
    toneNumber: 4,
    contour: 'Falls sharply from high to low, like a firm command.',
    hanzi: '罵',
    pinyin: 'mà',
    meaning: 'to scold',
  },
  {
    id: 'tone-neutral',
    toneNumber: 0,
    contour: 'Short and light, with no strong pitch contour of its own.',
    hanzi: '嗎',
    pinyin: 'ma',
    meaning: 'question particle',
  },
];

export const SOUND_CONTRASTS: SoundContrast[] = [
  {
    pair: 'x vs. sh',
    example: '西 (xī) vs. 是 (shì)',
    tip: 'x is soft and airy, made near the front of the mouth. sh is made further back, with the tongue curled slightly.',
  },
  {
    pair: 'q vs. ch',
    example: '七 (qī) vs. 吃 (chī)',
    tip: 'q is light, near the front teeth. ch is produced with the tongue curled back -- close to English "ch," but sharper.',
  },
  {
    pair: 'c vs. z',
    example: '菜 (cài) vs. 在 (zài)',
    tip: 'c carries a puff of air, close to the "ts" in "cats." z has no puff of air at all.',
  },
  {
    pair: 'ü vs. u',
    example: '女 (nǚ) vs. 五 (wǔ)',
    tip: 'ü is a rounded-lips "ee" with no English equivalent. u is a plain "oo" sound.',
  },
];

export const SENTENCE_PATTERNS: SentencePattern[] = [
  {
    id: 'svo',
    title: 'Subject, verb, object',
    template: 'Subject + Verb + Object',
    explanation:
      'Word order is often close to English: the doer comes first, then the action, then what receives it. Verbs never change form for tense or subject.',
    example: {
      hanzi: '我喝茶。',
      pinyin: 'wǒ hē chá.',
      meaning: 'I drink tea.',
    },
  },
  {
    id: 'to-be',
    title: 'Identifying something with 是',
    template: 'Subject + 是 (shì) + Noun',
    explanation:
      '是 links a subject to what it is, similar to "am / is / are." It appears before nouns, not before adjectives.',
    example: {
      hanzi: '我是學生。',
      pinyin: 'wǒ shì xuésheng.',
      meaning: 'I am a student.',
    },
  },
  {
    id: 'adjective-predicate',
    title: 'Describing with an adjective',
    template: 'Subject + 很 (hěn) + Adjective',
    explanation:
      'Adjectives act as the predicate directly, with no "is / are." 很 often appears even when it does not mean "very" -- it simply connects subject and adjective.',
    example: {
      hanzi: '天氣很冷。',
      pinyin: 'tiānqì hěn lěng.',
      meaning: 'The weather is cold.',
    },
  },
  {
    id: 'negation-bu',
    title: 'Negating with 不',
    template: 'Subject + 不 (bù) + Verb / Adjective',
    explanation:
      '不 negates most verbs, adjectives, and future or habitual actions. It sits directly before the word it negates.',
    example: {
      hanzi: '我不喝咖啡。',
      pinyin: 'wǒ bù hē kāfēi.',
      meaning: 'I do not drink coffee.',
    },
  },
  {
    id: 'negation-mei',
    title: 'Negating a past action with 沒',
    template: 'Subject + 沒(有) (méi yǒu) + Verb',
    explanation:
      '沒, often 沒有, negates completed actions and possession. Use it for "did not," never 不.',
    example: {
      hanzi: '我沒去。',
      pinyin: 'wǒ méi qù.',
      meaning: 'I did not go.',
    },
  },
  {
    id: 'yes-no-question',
    title: 'Yes/no questions with 嗎',
    template: 'Statement + 嗎 (ma)?',
    explanation:
      'Add 嗎 to the end of a statement to turn it into a yes/no question. Word order never changes.',
    example: {
      hanzi: '你是學生嗎？',
      pinyin: 'nǐ shì xuésheng ma?',
      meaning: 'Are you a student?',
    },
  },
  {
    id: 'echo-question',
    title: 'Echoing a question back with 呢',
    template: 'Answer, + Noun + 呢 (ne)?',
    explanation:
      '呢 echoes a question back after answering it -- a quick, natural way to ask "and you?"',
    example: {
      hanzi: '我很好，你呢？',
      pinyin: 'wǒ hěn hǎo, nǐ ne?',
      meaning: 'I am well, and you?',
    },
  },
  {
    id: 'possession',
    title: 'Having something with 有',
    template: 'Subject + 有 (yǒu) + Noun',
    explanation:
      '有 expresses possession or existence. Negate it with 沒, never 不.',
    example: {
      hanzi: '我有時間。',
      pinyin: 'wǒ yǒu shíjiān.',
      meaning: 'I have time.',
    },
  },
];

export const NUMBERS: FundamentalsExample[] = [
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

export const SURVIVAL_PHRASES: PhraseCard[] = [
  {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'hello',
    situation: 'Greeting one person',
  },
  {
    hanzi: '謝謝',
    pinyin: 'xièxie',
    meaning: 'thank you',
    situation: 'Showing thanks',
  },
  {
    hanzi: '不客氣',
    pinyin: 'bú kèqi',
    meaning: 'you are welcome',
    situation: 'Replying to thanks',
  },
  {
    hanzi: '對不起',
    pinyin: 'duìbùqǐ',
    meaning: 'sorry',
    situation: 'Apologizing',
  },
  {
    hanzi: '沒關係',
    pinyin: 'méi guānxi',
    meaning: 'it is okay',
    situation: 'Accepting an apology',
  },
  {
    hanzi: '請',
    pinyin: 'qǐng',
    meaning: 'please',
    situation: 'Making a polite request',
  },
  {
    hanzi: '再見',
    pinyin: 'zàijiàn',
    meaning: 'goodbye',
    situation: 'Ending a conversation',
  },
];
