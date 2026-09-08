/**
 * Original ZiLu grammar reference. The set of points and their rough order
 * follow a standard beginner Mandarin sequence; every explanation and every
 * example sentence here is written from scratch. No textbook grammar notes or
 * example sentences are reproduced.
 *
 * Example sentences deliberately stay within early Pathway 01 vocabulary so a
 * learner can read them without extra lookups.
 */

export type GrammarExample = {
  hanzi: string;
  pinyin: string;
  english: string;
};

export type GrammarContrast = {
  wrong: string;
  right: string;
  why: string;
};

export type GrammarPoint = {
  id: string;
  title: string;
  waypoint: string;
  template: string;
  why: string;
  examples: GrammarExample[];
  watchOut?: string;
  contrast?: GrammarContrast;
};

export type GrammarTheme = {
  id: string;
  num: string;
  title: string;
  intro: string;
  points: GrammarPoint[];
};

export const GRAMMAR_THEMES: GrammarTheme[] = [
  {
    id: 'basics',
    num: '01',
    title: 'Sentence basics',
    intro:
      'The shape of a plain Chinese sentence, and the handful of habits that are different from English.',
    points: [
      {
        id: 'svo',
        title: 'Subject, verb, object',
        waypoint: 'Waypoint 01',
        template: 'Subject + Verb + Object',
        why: 'The doer comes first, then the action, then the thing it acts on -- the same order as English.',
        examples: [
          { hanzi: '我喝茶。', pinyin: 'wǒ hē chá.', english: 'I drink tea.' },
          {
            hanzi: '他看書。',
            pinyin: 'tā kàn shū.',
            english: 'He reads a book.',
          },
          {
            hanzi: '我們學中文。',
            pinyin: 'wǒmen xué zhōngwén.',
            english: 'We study Chinese.',
          },
        ],
      },
      {
        id: 'no-conjugation',
        title: 'Verbs never change form',
        waypoint: 'Waypoint 01',
        template: 'The verb is identical for every subject and every time',
        why: 'No -s, -ed, or -ing. When something happens is shown by time words, not by the verb.',
        examples: [
          { hanzi: '我喝茶。', pinyin: 'wǒ hē chá.', english: 'I drink tea.' },
          {
            hanzi: '他喝茶。',
            pinyin: 'tā hē chá.',
            english: 'He drinks tea.',
          },
          {
            hanzi: '昨天我喝茶。',
            pinyin: 'zuótiān wǒ hē chá.',
            english: 'Yesterday I drank tea.',
          },
        ],
        watchOut:
          'There is no hidden "am" in "I am drinking". 我喝 already carries it.',
      },
      {
        id: 'drop-subject',
        title: 'Dropping the subject',
        waypoint: 'Waypoint 01',
        template: 'Leave out the subject when it is already clear',
        why: 'If everyone knows who you are talking about, Chinese usually drops the pronoun.',
        examples: [
          {
            hanzi: '你去嗎？去。',
            pinyin: 'nǐ qù ma? qù.',
            english: 'Are you going? Going.',
          },
          {
            hanzi: '忙嗎？很忙。',
            pinyin: 'máng ma? hěn máng.',
            english: 'Busy? Very busy.',
          },
        ],
      },
      {
        id: 'topic-first',
        title: 'Naming the topic first',
        waypoint: 'Waypoint 02',
        template: 'Known thing + a comment about it',
        why: 'Chinese often puts what you are talking about at the front, then says something about it.',
        examples: [
          {
            hanzi: '這本書我看了。',
            pinyin: 'zhè běn shū wǒ kàn le.',
            english: 'This book, I have read it.',
          },
          {
            hanzi: '中文很有意思。',
            pinyin: 'zhōngwén hěn yǒuyìsi.',
            english: 'Chinese is very interesting.',
          },
        ],
      },
    ],
  },
  {
    id: 'describing',
    num: '02',
    title: 'Being and describing',
    intro:
      'How to say what something is, and what it is like. The two use completely different words.',
    points: [
      {
        id: 'shi-noun',
        title: 'Identifying with 是',
        waypoint: 'Waypoint 01',
        template: 'Subject + 是 (shì) + Noun',
        why: '是 is for "X is a [noun]". It is not used before an adjective.',
        examples: [
          {
            hanzi: '我是學生。',
            pinyin: 'wǒ shì xuésheng.',
            english: 'I am a student.',
          },
          {
            hanzi: '他是老師。',
            pinyin: 'tā shì lǎoshī.',
            english: 'He is a teacher.',
          },
          {
            hanzi: '她是美國人。',
            pinyin: 'tā shì měiguórén.',
            english: 'She is American.',
          },
        ],
      },
      {
        id: 'hen-adjective',
        title: 'Describing with 很 + adjective',
        waypoint: 'Waypoint 01',
        template: 'Subject + 很 (hěn) + Adjective',
        why: 'An adjective is the whole predicate -- no "is" needed. 很 usually just links the two and does not have to mean "very".',
        examples: [
          { hanzi: '我很忙。', pinyin: 'wǒ hěn máng.', english: 'I am busy.' },
          {
            hanzi: '天氣很冷。',
            pinyin: 'tiānqì hěn lěng.',
            english: 'The weather is cold.',
          },
          {
            hanzi: '這杯茶很熱。',
            pinyin: 'zhè bēi chá hěn rè.',
            english: 'This cup of tea is hot.',
          },
        ],
        watchOut:
          'Dropping 很 (我忙) sounds like a contrast is coming -- "I am busy, but...". Keep 很 for a plain statement.',
        contrast: {
          wrong: '我是忙。',
          right: '我很忙。',
          why: '忙 is an adjective, so it takes 很, not 是.',
        },
      },
      {
        id: 'de-possessive',
        title: 'Ownership with 的',
        waypoint: 'Waypoint 02',
        template: 'Owner + 的 (de) + Thing',
        why: '的 is the possessive link, like apostrophe-s or "of".',
        examples: [
          { hanzi: '我的書', pinyin: 'wǒ de shū', english: 'my book' },
          {
            hanzi: '老師的名字',
            pinyin: 'lǎoshī de míngzi',
            english: "the teacher's name",
          },
          {
            hanzi: '這是你的茶。',
            pinyin: 'zhè shì nǐ de chá.',
            english: 'This is your tea.',
          },
        ],
        watchOut:
          'With close relationships you can drop 的 -- 我媽媽 (my mom), not usually 我的媽媽.',
      },
      {
        id: 'ye-dou',
        title: '也 (also) and 都 (all)',
        waypoint: 'Waypoint 02',
        template: 'Subject + 也 / 都 + Verb',
        why: 'Both go before the verb -- never at the end like English "too" or "all".',
        examples: [
          {
            hanzi: '我也是學生。',
            pinyin: 'wǒ yě shì xuésheng.',
            english: 'I am a student too.',
          },
          {
            hanzi: '他們都很忙。',
            pinyin: 'tāmen dōu hěn máng.',
            english: 'They are all busy.',
          },
          {
            hanzi: '我們也都去。',
            pinyin: 'wǒmen yě dōu qù.',
            english: 'We are all going too.',
          },
        ],
        watchOut: 'When both appear they stack as 也都, still before the verb.',
      },
    ],
  },
  {
    id: 'questions',
    num: '03',
    title: 'Asking questions',
    intro:
      'Chinese barely rearranges anything to ask a question -- it mostly just adds a small word.',
    points: [
      {
        id: 'ma',
        title: 'Yes / no questions with 嗎',
        waypoint: 'Waypoint 01',
        template: 'Statement + 嗎 (ma) ?',
        why: 'Add 嗎 to the end of any statement. Nothing else moves.',
        examples: [
          {
            hanzi: '你是學生嗎？',
            pinyin: 'nǐ shì xuésheng ma?',
            english: 'Are you a student?',
          },
          {
            hanzi: '他喝咖啡嗎？',
            pinyin: 'tā hē kāfēi ma?',
            english: 'Does he drink coffee?',
          },
          {
            hanzi: '你今天忙嗎？',
            pinyin: 'nǐ jīntiān máng ma?',
            english: 'Are you busy today?',
          },
        ],
      },
      {
        id: 'question-words',
        title: 'Question words stay in place',
        waypoint: 'Waypoint 01',
        template: 'Put the question word where the answer will go',
        why: '什麼 / 誰 / 哪 do not jump to the front. The sentence keeps its normal order.',
        examples: [
          {
            hanzi: '你叫什麼名字？',
            pinyin: 'nǐ jiào shénme míngzi?',
            english: 'What is your name? (lit. you called what name)',
          },
          {
            hanzi: '他是誰？',
            pinyin: 'tā shì shéi?',
            english: 'Who is he?',
          },
          {
            hanzi: '你喝什麼？',
            pinyin: 'nǐ hē shénme?',
            english: 'What are you drinking?',
          },
        ],
        watchOut:
          'Do not add 嗎 to a sentence that already has a question word.',
      },
      {
        id: 'ne',
        title: '呢 to bounce a question back',
        waypoint: 'Waypoint 01',
        template: 'Answer, + Noun + 呢 (ne) ?',
        why: '呢 is a quick way to ask "and you?" or "what about X?" once something has already been asked.',
        examples: [
          {
            hanzi: '我很好，你呢？',
            pinyin: 'wǒ hěn hǎo, nǐ ne?',
            english: 'I am well, and you?',
          },
          {
            hanzi: '我喝茶，你呢？',
            pinyin: 'wǒ hē chá, nǐ ne?',
            english: 'I am having tea, what about you?',
          },
          {
            hanzi: '我的書呢？',
            pinyin: 'wǒ de shū ne?',
            english: 'Where is my book?',
          },
        ],
      },
      {
        id: 'a-not-a',
        title: 'The verb-not-verb question',
        waypoint: 'Waypoint 02',
        template: 'Verb + 不 + Verb   (or Adjective + 不 + Adjective)',
        why: 'Another way to ask yes / no without 嗎: say the word, then 不, then the word again.',
        examples: [
          {
            hanzi: '你是不是學生？',
            pinyin: 'nǐ shì bu shì xuésheng?',
            english: 'Are you a student?',
          },
          {
            hanzi: '你喝不喝咖啡？',
            pinyin: 'nǐ hē bu hē kāfēi?',
            english: 'Do you drink coffee?',
          },
          {
            hanzi: '今天冷不冷？',
            pinyin: 'jīntiān lěng bu lěng?',
            english: 'Is it cold today?',
          },
        ],
        contrast: {
          wrong: '你是不是學生嗎？',
          right: '你是不是學生？',
          why: 'Pick one -- 嗎 or verb-not-verb, never both in the same question.',
        },
      },
      {
        id: 'ji-duoshao',
        title: '幾 vs 多少',
        waypoint: 'Waypoint 02',
        template: '幾 + measure word + noun  ·  多少 + noun',
        why: '幾 (jǐ) expects a small answer, under ten or so, and needs a measure word. 多少 (duōshao) is for any amount and often drops the measure word.',
        examples: [
          {
            hanzi: '你有幾本書？',
            pinyin: 'nǐ yǒu jǐ běn shū?',
            english: 'How many books do you have?',
          },
          {
            hanzi: '你們家有幾個人？',
            pinyin: 'nǐmen jiā yǒu jǐ ge rén?',
            english: 'How many people are in your family?',
          },
          {
            hanzi: '這個多少錢？',
            pinyin: 'zhège duōshao qián?',
            english: 'How much is this?',
          },
        ],
        watchOut: '錢 (money) almost always takes 多少, never 幾.',
      },
    ],
  },
  {
    id: 'negation',
    num: '04',
    title: 'Saying no',
    intro:
      'Chinese has two words for "not", and using the wrong one changes the meaning.',
    points: [
      {
        id: 'bu',
        title: '不 for most things',
        waypoint: 'Waypoint 01',
        template: 'Subject + 不 (bù) + Verb / Adjective',
        why: '不 negates habits, opinions, adjectives, and anything in the present or future. It sits right before the word it negates.',
        examples: [
          {
            hanzi: '我不喝咖啡。',
            pinyin: 'wǒ bù hē kāfēi.',
            english: 'I do not drink coffee.',
          },
          {
            hanzi: '他不是老師。',
            pinyin: 'tā bú shì lǎoshī.',
            english: 'He is not a teacher.',
          },
          {
            hanzi: '今天不冷。',
            pinyin: 'jīntiān bù lěng.',
            english: 'It is not cold today.',
          },
        ],
        watchOut:
          '不 shifts to second tone (bú) before a fourth-tone word -- 不是 is "bú shì".',
      },
      {
        id: 'mei',
        title: '沒(有) for "did not" and "do not have"',
        waypoint: 'Waypoint 02',
        template: 'Subject + 沒(有) (méi yǒu) + Verb / Noun',
        why: '沒 negates a past action that did not happen, and possession. Never use 不 for these.',
        examples: [
          { hanzi: '我沒去。', pinyin: 'wǒ méi qù.', english: 'I did not go.' },
          {
            hanzi: '他沒喝咖啡。',
            pinyin: 'tā méi hē kāfēi.',
            english: 'He did not drink coffee.',
          },
          {
            hanzi: '我沒有時間。',
            pinyin: 'wǒ méiyǒu shíjiān.',
            english: 'I do not have time.',
          },
        ],
        contrast: {
          wrong: '我不有時間。',
          right: '我沒有時間。',
          why: '有 is the one verb that is always negated with 沒.',
        },
      },
      {
        id: 'hai-mei',
        title: '還沒 for "not yet"',
        waypoint: 'Waypoint 03',
        template: 'Subject + 還沒 (hái méi) + Verb',
        why: '還 (still) plus 沒 means the action has not happened but is expected to.',
        examples: [
          {
            hanzi: '我還沒吃飯。',
            pinyin: 'wǒ hái méi chī fàn.',
            english: 'I have not eaten yet.',
          },
          {
            hanzi: '他還沒來。',
            pinyin: 'tā hái méi lái.',
            english: 'He is not here yet.',
          },
        ],
        watchOut: 'Add 呢 at the end for a natural "not yet!" -- 還沒呢.',
      },
    ],
  },
  {
    id: 'time',
    num: '05',
    title: 'Time and what is done',
    intro:
      'Where time words go, and how the small word 了 marks that something is finished or has changed.',
    points: [
      {
        id: 'time-early',
        title: 'Time words go early',
        waypoint: 'Waypoint 03',
        template: '(Subject) + Time word + Verb ...',
        why: 'When something happens is stated near the front -- right before or after the subject, not tacked on at the end.',
        examples: [
          {
            hanzi: '明天我去學校。',
            pinyin: 'míngtiān wǒ qù xuéxiào.',
            english: 'I am going to school tomorrow.',
          },
          {
            hanzi: '我今天很忙。',
            pinyin: 'wǒ jīntiān hěn máng.',
            english: 'I am busy today.',
          },
          {
            hanzi: '他昨天沒來。',
            pinyin: 'tā zuótiān méi lái.',
            english: 'He did not come yesterday.',
          },
        ],
        watchOut: '我去學校明天 is wrong -- the time cannot sit at the end.',
      },
      {
        id: 'le-completed',
        title: '了 for a completed action',
        waypoint: 'Waypoint 05',
        template: 'Subject + Verb + 了 (le) (+ object)',
        why: '了 right after the verb signals the action is done. It is about completion, not strictly the past.',
        examples: [
          { hanzi: '我吃了。', pinyin: 'wǒ chī le.', english: 'I have eaten.' },
          {
            hanzi: '他買了三本書。',
            pinyin: 'tā mǎi le sān běn shū.',
            english: 'He bought three books.',
          },
          {
            hanzi: '我看了那個電影。',
            pinyin: 'wǒ kàn le nàge diànyǐng.',
            english: 'I watched that movie.',
          },
        ],
        contrast: {
          wrong: '我沒吃了。',
          right: '我沒吃。',
          why: 'A negative sentence drops 了 -- 沒 already tells you it did not happen.',
        },
      },
      {
        id: 'le-change',
        title: '了 for a change or new situation',
        waypoint: 'Waypoint 05',
        template: '... + 了 (at the very end)',
        why: '了 at the end of a sentence marks that things are now different from before.',
        examples: [
          {
            hanzi: '我懂了。',
            pinyin: 'wǒ dǒng le.',
            english: 'Now I understand.',
          },
          {
            hanzi: '他是老師了。',
            pinyin: 'tā shì lǎoshī le.',
            english: 'He is a teacher now.',
          },
          {
            hanzi: '天氣冷了。',
            pinyin: 'tiānqì lěng le.',
            english: 'It has turned cold.',
          },
        ],
      },
      {
        id: 'when-vs-duration',
        title: 'When it happens vs. how long it lasts',
        waypoint: 'Waypoint 08',
        template: 'Time-when + Verb ...   ·   ... Verb + duration',
        why: '"When" (tomorrow, at three) goes before the verb. "How long" (for two weeks) goes after it.',
        examples: [
          {
            hanzi: '我明天去。',
            pinyin: 'wǒ míngtiān qù.',
            english: 'I am going tomorrow. (when)',
          },
          {
            hanzi: '我學了兩個星期。',
            pinyin: 'wǒ xué le liǎng ge xīngqī.',
            english: 'I studied for two weeks. (how long)',
          },
          {
            hanzi: '他昨天看了很久。',
            pinyin: 'tā zuótiān kàn le hěn jiǔ.',
            english: 'He watched for a long time yesterday.',
          },
        ],
      },
      {
        id: 'zai-progressive',
        title: '在 / 正在 for something happening now',
        waypoint: 'Waypoint 08',
        template: 'Subject + 在 / 正在 (zài / zhèngzài) + Verb',
        why: 'Put 在 before the verb for an action in progress right now.',
        examples: [
          {
            hanzi: '我在喝咖啡。',
            pinyin: 'wǒ zài hē kāfēi.',
            english: 'I am drinking coffee right now.',
          },
          {
            hanzi: '他正在看書。',
            pinyin: 'tā zhèngzài kàn shū.',
            english: 'He is reading a book right now.',
          },
        ],
        watchOut:
          'This 在 (before a verb) is not the same as 在 meaning "located at" -- that one comes later.',
      },
    ],
  },
];
