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

/** Sections, in learning order. Each is its own page under /fundamentals/. */
export const SECTIONS = [
  {
    id: 'orientation',
    num: '01',
    title: 'What you are learning',
    teaser: 'What "Chinese" means, and how ZiLu presents each word.',
  },
  {
    id: 'characters',
    num: '02',
    title: 'How characters work',
    teaser: 'How characters carry meaning, and how words are built from them.',
  },
  {
    id: 'radicals',
    num: '03',
    title: 'Radicals: the recurring pieces',
    teaser: 'The recurring pieces that turn up across many characters.',
  },
  {
    id: 'pinyin',
    num: '04',
    title: 'Pinyin, the sound system',
    teaser: 'How pinyin spells the sound of a syllable.',
  },
  {
    id: 'tones',
    num: '05',
    title: 'The tones',
    teaser:
      'The four tones plus the neutral tone, with audio and a listening drill.',
  },
  {
    id: 'sounds',
    num: '06',
    title: 'Sounds that trip up English speakers',
    teaser: 'The sound groups that trip up English speakers, with audio.',
  },
  {
    id: 'pronouns',
    num: '07',
    title: 'People words',
    teaser: 'I, you, he, she, we, they -- and how to make them plural.',
  },
  {
    id: 'sentences',
    num: '08',
    title: 'Building a sentence',
    teaser: 'The core sentence patterns, with a link to the full Grammar page.',
  },
  {
    id: 'particles',
    num: '09',
    title: 'Little words that do a lot',
    teaser: 'The short words that change what a sentence does.',
  },
  {
    id: 'measure-words',
    num: '10',
    title: 'Measure words',
    teaser: 'The counting word every number-plus-noun phrase needs.',
  },
  {
    id: 'numbers',
    num: '11',
    title: 'Numbers, dates, and time',
    teaser: 'Zero through ten, then dates, weekdays, and telling time.',
  },
  {
    id: 'phrases',
    num: '12',
    title: 'Survival phrases',
    teaser:
      'Ten phrases for greeting, thanking, apologizing, and asking for help.',
  },
  {
    id: 'study',
    num: '13',
    title: 'How to study with ZiLu',
    teaser: 'Habits that make the flashcard decks actually work.',
  },
] as const;

export type Radical = {
  hanzi: string;
  /** The compressed left/top-side form, when it differs from the standalone character. */
  asComponent?: string;
  pinyin: string;
  meaning: string;
  tip: string;
  examples: Example[];
};

// A hand-picked starter set, not the full 214 Kangxi radicals -- just the
// dozen or so that turn up constantly in early vocabulary. Meanings and
// component forms are standard linguistic fact, not textbook text; the tips
// and example pairings are written for ZiLu.
export const RADICALS: Radical[] = [
  {
    hanzi: '人',
    asComponent: '亻',
    pinyin: 'rén',
    meaning: 'person',
    tip: 'One of the most common pieces in the whole script. On the left side of a character it narrows to 亻 -- still "person", just compressed.',
    examples: [
      { hanzi: '你', pinyin: 'nǐ', meaning: 'you' },
      { hanzi: '他', pinyin: 'tā', meaning: 'he; him' },
      { hanzi: '們', pinyin: 'men', meaning: '(marks a plural)' },
    ],
  },
  {
    hanzi: '口',
    pinyin: 'kǒu',
    meaning: 'mouth',
    tip: 'A square standing for an open mouth. Shows up in most words about eating, speaking, or a small enclosed space.',
    examples: [
      { hanzi: '吃', pinyin: 'chī', meaning: 'to eat' },
      { hanzi: '喝', pinyin: 'hē', meaning: 'to drink' },
      { hanzi: '叫', pinyin: 'jiào', meaning: 'to be called; to call' },
    ],
  },
  {
    hanzi: '女',
    pinyin: 'nǚ',
    meaning: 'woman',
    tip: 'A kneeling figure, used across words about women and family. 好 (good) is famously "woman + child" side by side.',
    examples: [
      { hanzi: '媽', pinyin: 'mā', meaning: 'mom' },
      { hanzi: '她', pinyin: 'tā', meaning: 'she; her' },
      { hanzi: '好', pinyin: 'hǎo', meaning: 'good; fine; well' },
    ],
  },
  {
    hanzi: '心',
    asComponent: '忄',
    pinyin: 'xīn',
    meaning: 'heart',
    tip: 'Feelings, thoughts, and states of mind live here. On the left side it stands upright as 忄.',
    examples: [
      { hanzi: '想', pinyin: 'xiǎng', meaning: 'to want to; would like to' },
      { hanzi: '忙', pinyin: 'máng', meaning: 'busy' },
      { hanzi: '快', pinyin: 'kuài', meaning: 'fast; quick; quickly' },
    ],
  },
  {
    hanzi: '手',
    asComponent: '扌',
    pinyin: 'shǒu',
    meaning: 'hand',
    tip: 'Actions done with the hand. As a left-side piece it becomes 扌 -- easy to mistake for 木 (tree) at a glance, so look for the hook at the bottom.',
    examples: [
      { hanzi: '打', pinyin: 'dǎ', meaning: 'to hit; to play (a sport)' },
      { hanzi: '找', pinyin: 'zhǎo', meaning: 'to look for' },
    ],
  },
  {
    hanzi: '日',
    pinyin: 'rì',
    meaning: 'sun; day',
    tip: 'A small window: originally a picture of the sun. Common in words about time.',
    examples: [
      { hanzi: '是', pinyin: 'shì', meaning: 'to be' },
      { hanzi: '明天', pinyin: 'míng tiān', meaning: 'tomorrow' },
      { hanzi: '星期', pinyin: 'xīng qī', meaning: 'week' },
    ],
  },
  {
    hanzi: '月',
    pinyin: 'yuè',
    meaning: 'moon; month',
    tip: 'A close cousin of 日, and easy to confuse with it -- 月 is narrower, with two strokes inside. 明 (bright) is "sun + moon" side by side.',
    examples: [
      { hanzi: '朋友', pinyin: 'péng you', meaning: 'friend' },
      { hanzi: '有', pinyin: 'yǒu', meaning: 'to have' },
    ],
  },
  {
    hanzi: '言',
    pinyin: 'yán',
    meaning: 'speech; words',
    tip: 'Words coming out of a mouth. Traditional characters keep this piece in full -- Simplified shrinks it to 讠, one of the fastest ways to tell the two scripts apart at a glance.',
    examples: [
      { hanzi: '說', pinyin: 'shuō', meaning: 'to say; to speak' },
      { hanzi: '請', pinyin: 'qǐng', meaning: 'please; to invite' },
    ],
  },
  {
    hanzi: '門',
    pinyin: 'mén',
    meaning: 'door; gate',
    tip: 'Literally a picture of a two-panel door. If a character is built around this frame, something is opening, closing, or happening in a space.',
    examples: [
      { hanzi: '問', pinyin: 'wèn', meaning: 'to ask' },
      { hanzi: '開', pinyin: 'kāi', meaning: 'to open; to hold (a meeting)' },
      { hanzi: '間', pinyin: 'jiān', meaning: 'between; room' },
    ],
  },
  {
    hanzi: '金',
    pinyin: 'jīn',
    meaning: 'metal; gold',
    tip: 'Money, metal, and precious things.',
    examples: [{ hanzi: '錢', pinyin: 'qián', meaning: 'money' }],
  },
  {
    hanzi: '艹',
    pinyin: 'cǎo',
    meaning: 'grass; plant',
    tip: 'Two small sprouts sitting on top of a character -- a strong hint the word is a plant, or made from one.',
    examples: [{ hanzi: '茶', pinyin: 'chá', meaning: 'tea' }],
  },
  {
    hanzi: '食',
    asComponent: '飠',
    pinyin: 'shí',
    meaning: 'food; to eat',
    tip: 'Points to food and eating. As a left-side piece it becomes 飠.',
    examples: [{ hanzi: '飯', pinyin: 'fàn', meaning: 'meal; cooked rice' }],
  },
  {
    hanzi: '大',
    pinyin: 'dà',
    meaning: 'big',
    tip: 'A person standing with arms stretched wide. 天 (day; sky) is this same figure with the sky drawn as a line above the head.',
    examples: [
      { hanzi: '天', pinyin: 'tiān', meaning: 'day' },
      { hanzi: '太', pinyin: 'tài', meaning: 'too; extremely' },
    ],
  },
  {
    hanzi: '小',
    pinyin: 'xiǎo',
    meaning: 'small',
    tip: 'Three small strokes for something little. 少 (few) is the same idea with one more stroke splitting off.',
    examples: [{ hanzi: '少', pinyin: 'shǎo', meaning: 'few; little' }],
  },
];

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

export type ToneDrillItem = {
  hanzi: string;
  pinyin: string;
  toneNumber: 1 | 2 | 3 | 4;
  meaning: string;
};

export type ToneDrillSet = {
  id: string;
  items: ToneDrillItem[];
};

// Classic minimal-pair sets -- the same syllable across all four tones.
// Widely used for teaching tone discrimination; safe to present without a
// source since it is a standard teaching device, not copied text.
export const TONE_DRILLS: ToneDrillSet[] = [
  {
    id: 'ma',
    items: [
      { hanzi: '媽', pinyin: 'mā', toneNumber: 1, meaning: 'mom' },
      { hanzi: '麻', pinyin: 'má', toneNumber: 2, meaning: 'hemp; numb' },
      { hanzi: '馬', pinyin: 'mǎ', toneNumber: 3, meaning: 'horse' },
      { hanzi: '罵', pinyin: 'mà', toneNumber: 4, meaning: 'to scold' },
    ],
  },
  {
    id: 'ba',
    items: [
      { hanzi: '八', pinyin: 'bā', toneNumber: 1, meaning: 'eight' },
      { hanzi: '拔', pinyin: 'bá', toneNumber: 2, meaning: 'to pull out' },
      {
        hanzi: '把',
        pinyin: 'bǎ',
        toneNumber: 3,
        meaning: '(a measure word; to hold)',
      },
      { hanzi: '爸', pinyin: 'bà', toneNumber: 4, meaning: 'dad' },
    ],
  },
  {
    id: 'yi',
    items: [
      { hanzi: '一', pinyin: 'yī', toneNumber: 1, meaning: 'one' },
      { hanzi: '姨', pinyin: 'yí', toneNumber: 2, meaning: 'aunt' },
      { hanzi: '椅', pinyin: 'yǐ', toneNumber: 3, meaning: 'chair' },
      { hanzi: '易', pinyin: 'yì', toneNumber: 4, meaning: 'easy' },
    ],
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
