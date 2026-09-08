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
            hanzi: '茶我喝，咖啡我不喝。',
            pinyin: 'chá wǒ hē, kāfēi wǒ bù hē.',
            english: "Tea I drink; coffee I don't.",
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
          'This 在 (before a verb) is not the same as 在 meaning "located at" -- that one is the next theme.',
      },
    ],
  },
  {
    id: 'location',
    num: '06',
    title: 'Where things are',
    intro:
      'Saying where someone is, where something happens, and what exists in a place. It all runs on 在 and 有.',
    points: [
      {
        id: 'zai-location',
        title: '在 for "to be somewhere"',
        waypoint: 'Waypoint 06',
        template: 'Subject + 在 (zài) + Place',
        why: '在 is a full verb here meaning "is located at". No 是 and no other verb is needed.',
        examples: [
          {
            hanzi: '我在家。',
            pinyin: 'wǒ zài jiā.',
            english: 'I am at home.',
          },
          {
            hanzi: '老師在學校。',
            pinyin: 'lǎoshī zài xuéxiào.',
            english: 'The teacher is at school.',
          },
          {
            hanzi: '你的書在這裡。',
            pinyin: 'nǐ de shū zài zhèlǐ.',
            english: 'Your book is here.',
          },
        ],
        contrast: {
          wrong: '我是在家。',
          right: '我在家。',
          why: '在 already means "am at". Adding 是 doubles the verb.',
        },
      },
      {
        id: 'zai-place-verb',
        title: 'Doing something at a place',
        waypoint: 'Waypoint 06',
        template: 'Subject + 在 + Place + Verb ...',
        why: 'The place phrase comes before the verb, not after it like English "at home".',
        examples: [
          {
            hanzi: '我在家看書。',
            pinyin: 'wǒ zài jiā kàn shū.',
            english: 'I read at home.',
          },
          {
            hanzi: '他在學校學中文。',
            pinyin: 'tā zài xuéxiào xué zhōngwén.',
            english: 'He studies Chinese at school.',
          },
          {
            hanzi: '我們在這裡等你。',
            pinyin: 'wǒmen zài zhèlǐ děng nǐ.',
            english: 'We will wait for you here.',
          },
        ],
        contrast: {
          wrong: '我看書在家。',
          right: '我在家看書。',
          why: 'The place goes in front of the verb in Chinese.',
        },
      },
      {
        id: 'you-existence',
        title: '有 for "there is / there are"',
        waypoint: 'Waypoint 06',
        template: 'Place + 有 (yǒu) + Thing',
        why: 'Name the place first, then 有, then the thing. The thing is usually new, so it feels like "a" or "some".',
        examples: [
          {
            hanzi: '我家有四個人。',
            pinyin: 'wǒ jiā yǒu sì ge rén.',
            english: 'There are four people in my family.',
          },
          {
            hanzi: '這裡有很多書。',
            pinyin: 'zhèlǐ yǒu hěn duō shū.',
            english: 'There are lots of books here.',
          },
          {
            hanzi: '今天有中文課。',
            pinyin: 'jīntiān yǒu zhōngwén kè.',
            english: 'There is Chinese class today.',
          },
        ],
        watchOut:
          'Negate it with 沒有, never 不有 -- 這裡沒有人 (there is nobody here).',
      },
      {
        id: 'here-there',
        title: '這裡 / 那裡 / 哪裡',
        waypoint: 'Waypoint 06',
        template: '這裡 here  ·  那裡 there  ·  哪裡 where',
        why: 'These are places, so they behave like any other place word -- usually after 在.',
        examples: [
          {
            hanzi: '我在這裡。',
            pinyin: 'wǒ zài zhèlǐ.',
            english: 'I am here.',
          },
          {
            hanzi: '你的老師在那裡。',
            pinyin: 'nǐ de lǎoshī zài nàlǐ.',
            english: 'Your teacher is over there.',
          },
          {
            hanzi: '你家在哪裡？',
            pinyin: 'nǐ jiā zài nǎlǐ?',
            english: 'Where is your home?',
          },
        ],
        watchOut:
          'In Taiwan you will also hear 這邊 / 那邊 / 哪邊 (zhèbiān...) for the same thing.',
      },
    ],
  },
  {
    id: 'comparing',
    num: '07',
    title: 'Comparing things',
    intro:
      'Chinese does not change the adjective ("taller", "more expensive"). It puts a comparing word in front instead.',
    points: [
      {
        id: 'bi-comparison',
        title: 'A 比 B + adjective',
        waypoint: 'Waypoint 09',
        template: 'A + 比 (bǐ) + B + Adjective',
        why: '比 does the comparing. The adjective stays in its plain form.',
        examples: [
          {
            hanzi: '我比他高。',
            pinyin: 'wǒ bǐ tā gāo.',
            english: 'I am taller than him.',
          },
          {
            hanzi: '今天比昨天冷。',
            pinyin: 'jīntiān bǐ zuótiān lěng.',
            english: 'Today is colder than yesterday.',
          },
          {
            hanzi: '這本書比那本貴。',
            pinyin: 'zhè běn shū bǐ nà běn guì.',
            english: 'This book is more expensive than that one.',
          },
        ],
        contrast: {
          wrong: '我比他很高。',
          right: '我比他高。',
          why: 'Never put 很 in a 比 sentence -- 比 is already the comparison.',
        },
      },
      {
        id: 'bi-degree',
        title: 'Saying by how much',
        waypoint: 'Waypoint 09',
        template: 'A + 比 + B + Adjective + amount',
        why: 'The size of the gap goes after the adjective, never before it.',
        examples: [
          {
            hanzi: '我比他大三歲。',
            pinyin: 'wǒ bǐ tā dà sān suì.',
            english: 'I am three years older than him.',
          },
          {
            hanzi: '這個比那個貴一點。',
            pinyin: 'zhège bǐ nàge guì yìdiǎn.',
            english: 'This one is a little more expensive than that one.',
          },
          {
            hanzi: '他比我高很多。',
            pinyin: 'tā bǐ wǒ gāo hěn duō.',
            english: 'He is much taller than me.',
          },
        ],
      },
      {
        id: 'yiyang-same',
        title: 'A 跟 B 一樣 -- the same',
        waypoint: 'Waypoint 09',
        template: 'A + 跟 (gēn) + B + 一樣 (yíyàng) (+ Adjective)',
        why: '一樣 on its own means "the same"; add an adjective for "just as ... as".',
        examples: [
          {
            hanzi: '我的書跟你的一樣。',
            pinyin: 'wǒ de shū gēn nǐ de yíyàng.',
            english: 'My book is the same as yours.',
          },
          {
            hanzi: '他跟我一樣高。',
            pinyin: 'tā gēn wǒ yíyàng gāo.',
            english: 'He is the same height as me.',
          },
          {
            hanzi: '這個跟那個一樣貴。',
            pinyin: 'zhège gēn nàge yíyàng guì.',
            english: 'This is just as expensive as that one.',
          },
        ],
        watchOut: 'The negative is 不一樣 -- 我的書跟你的不一樣.',
      },
      {
        id: 'meiyou-comparison',
        title: 'A 沒有 B -- not as ... as',
        waypoint: 'Waypoint 09',
        template: 'A + 沒有 (méiyǒu) + B (+ 那麼) + Adjective',
        why: 'To say something is less, you do not use a negative 比 sentence -- you switch to 沒有.',
        examples: [
          {
            hanzi: '我沒有他高。',
            pinyin: 'wǒ méiyǒu tā gāo.',
            english: 'I am not as tall as him.',
          },
          {
            hanzi: '今天沒有昨天那麼冷。',
            pinyin: 'jīntiān méiyǒu zuótiān nàme lěng.',
            english: 'Today is not as cold as yesterday.',
          },
          {
            hanzi: '這個沒有那個貴。',
            pinyin: 'zhège méiyǒu nàge guì.',
            english: 'This one is not as expensive as that one.',
          },
        ],
        contrast: {
          wrong: '我不比他高。',
          right: '我沒有他高。',
          why: '不比 exists but means "not necessarily more than". For plain "less than", use 沒有.',
        },
      },
      {
        id: 'zui-most',
        title: '最 for "the most"',
        waypoint: 'Waypoint 09',
        template: 'Subject + 最 (zuì) + Adjective / Verb',
        why: '最 goes right before the adjective or the feeling verb. No group to compare against is needed.',
        examples: [
          {
            hanzi: '我最喜歡中文。',
            pinyin: 'wǒ zuì xǐhuān zhōngwén.',
            english: 'I like Chinese the most.',
          },
          {
            hanzi: '今天最冷。',
            pinyin: 'jīntiān zuì lěng.',
            english: 'Today is the coldest.',
          },
          {
            hanzi: '這個最便宜。',
            pinyin: 'zhège zuì piányi.',
            english: 'This one is the cheapest.',
          },
        ],
      },
    ],
  },
  {
    id: 'joining',
    num: '08',
    title: 'Joining ideas together',
    intro:
      'Chinese often marks both halves of a link -- "because ... so ...", "although ... but ...". Keeping both is correct, not redundant.',
    points: [
      {
        id: 'yinwei-suoyi',
        title: '因為 ... 所以 ... -- because / so',
        waypoint: 'Waypoint 07',
        template: '因為 (yīnwèi) + reason, 所以 (suǒyǐ) + result',
        why: 'Both words stay in. English keeps only one ("Because it rained, I stayed") -- Chinese keeps both.',
        examples: [
          {
            hanzi: '因為今天很冷，所以我不去。',
            pinyin: 'yīnwèi jīntiān hěn lěng, suǒyǐ wǒ bú qù.',
            english: 'Because it is cold today, I am not going.',
          },
          {
            hanzi: '因為他很忙，所以沒來。',
            pinyin: 'yīnwèi tā hěn máng, suǒyǐ méi lái.',
            english: 'Because he was busy, he did not come.',
          },
        ],
        watchOut:
          'You can drop one side if the meaning is clear -- 今天很冷，所以我不去 is fine too.',
      },
      {
        id: 'suiran-keshi',
        title: '雖然 ... 可是 ... -- although / but',
        waypoint: 'Waypoint 07',
        template: '雖然 (suīrán) + fact, 可是 (kěshì) + surprise',
        why: 'Same pattern: both halves are marked. 可是 and 但是 (dànshì) are interchangeable.',
        examples: [
          {
            hanzi: '雖然中文很難，可是很有意思。',
            pinyin: 'suīrán zhōngwén hěn nán, kěshì hěn yǒu yìsi.',
            english: 'Although Chinese is hard, it is very interesting.',
          },
          {
            hanzi: '雖然他很忙，可是他很高興。',
            pinyin: 'suīrán tā hěn máng, kěshì tā hěn gāoxìng.',
            english: 'Although he is busy, he is happy.',
          },
        ],
      },
      {
        id: 'xian-ranhou',
        title: '先 ... 再 / 然後 ... -- first, then',
        waypoint: 'Waypoint 08',
        template: '先 (xiān) + action 1, 再 (zài) / 然後 (ránhòu) + action 2',
        why: 'Put the steps in the order they happen. 再 here means "and then", not "again".',
        examples: [
          {
            hanzi: '我先吃飯，再看書。',
            pinyin: 'wǒ xiān chī fàn, zài kàn shū.',
            english: 'I will eat first, then study.',
          },
          {
            hanzi: '你先說，然後我說。',
            pinyin: 'nǐ xiān shuō, ránhòu wǒ shuō.',
            english: 'You speak first, then I will speak.',
          },
        ],
        watchOut:
          'This 再 is unstressed and points forward. The "again" 再 (再見, 再來一個) is about repeating.',
      },
      {
        id: 'yibian',
        title: '一邊 ... 一邊 ... -- doing two things at once',
        waypoint: 'Waypoint 08',
        template: '一邊 (yìbiān) + Verb 1 + 一邊 + Verb 2',
        why: 'One subject, two actions happening at the same moment.',
        examples: [
          {
            hanzi: '我一邊吃飯一邊看書。',
            pinyin: 'wǒ yìbiān chī fàn yìbiān kàn shū.',
            english: 'I eat and read at the same time.',
          },
          {
            hanzi: '他喜歡一邊喝茶一邊聽音樂。',
            pinyin: 'tā xǐhuān yìbiān hē chá yìbiān tīng yīnyuè.',
            english: 'He likes to listen to music while drinking tea.',
          },
        ],
      },
      {
        id: 'de-shihou',
        title: '... 的時候 -- when / while',
        waypoint: 'Waypoint 08',
        template: 'Event + 的時候 (de shíhou), main clause',
        why: '的時候 sits at the END of the "when" part. English puts "when" at the start; Chinese closes the clause with it.',
        examples: [
          {
            hanzi: '我小的時候不喜歡中文。',
            pinyin: 'wǒ xiǎo de shíhou bù xǐhuān zhōngwén.',
            english: 'When I was little I did not like Chinese.',
          },
          {
            hanzi: '你來的時候我不在家。',
            pinyin: 'nǐ lái de shíhou wǒ bú zài jiā.',
            english: 'When you came I was not home.',
          },
        ],
        contrast: {
          wrong: '的時候你來，我不在家。',
          right: '你來的時候，我不在家。',
          why: '的時候 cannot start the clause -- it has to follow the event.',
        },
      },
    ],
  },
  {
    id: 'mix-ups',
    num: '09',
    title: 'Easy things to get wrong',
    intro:
      'Pairs of words that map to one English word, plus two habits English speakers carry over by mistake.',
    points: [
      {
        id: 'er-liang',
        title: '二 vs 兩 -- both are "two"',
        waypoint: 'Waypoint 03',
        template: '二 (èr) for counting  ·  兩 (liǎng) before a measure word',
        why: 'Say 二 when reading numbers (十二, 第二). Say 兩 when "two" is followed by a measure word and a noun.',
        examples: [
          {
            hanzi: '我要兩杯咖啡。',
            pinyin: 'wǒ yào liǎng bēi kāfēi.',
            english: 'I want two cups of coffee.',
          },
          {
            hanzi: '現在兩點。',
            pinyin: 'xiànzài liǎng diǎn.',
            english: "It is two o'clock now.",
          },
          {
            hanzi: '我有兩個哥哥。',
            pinyin: 'wǒ yǒu liǎng ge gēge.',
            english: 'I have two older brothers.',
          },
        ],
        contrast: {
          wrong: '我有二個朋友。',
          right: '我有兩個朋友。',
          why: '個 is a measure word, so "two" in front of it is 兩.',
        },
      },
      {
        id: 'hui-neng-keyi',
        title: '會 vs 能 vs 可以 -- three kinds of "can"',
        waypoint: 'Waypoint 07',
        template:
          '會 learned skill  ·  能 circumstances allow  ·  可以 permission',
        why: 'They are not interchangeable. Pick the one that matches why you can (or cannot).',
        examples: [
          {
            hanzi: '我會說一點中文。',
            pinyin: 'wǒ huì shuō yìdiǎn zhōngwén.',
            english: 'I can speak a little Chinese. (skill)',
          },
          {
            hanzi: '我今天很忙，不能去。',
            pinyin: 'wǒ jīntiān hěn máng, bù néng qù.',
            english: 'I am busy today, I cannot go. (circumstances)',
          },
          {
            hanzi: '我可以坐這裡嗎？',
            pinyin: 'wǒ kěyǐ zuò zhèlǐ ma?',
            english: 'May I sit here? (permission)',
          },
        ],
        contrast: {
          wrong: '我能說中文。',
          right: '我會說中文。',
          why: 'A language is a learned skill, so it takes 會. 能 would mean something is letting you speak right now.',
        },
      },
      {
        id: 'xiang-yao',
        title: '想 vs 要 -- two kinds of "want"',
        waypoint: 'Waypoint 06',
        template: '想 (xiǎng) would like to  ·  要 (yào) want / will',
        why: '想 is softer ("feel like"). 要 is firmer and is what you use to order things.',
        examples: [
          {
            hanzi: '我想喝茶。',
            pinyin: 'wǒ xiǎng hē chá.',
            english: 'I would like some tea.',
          },
          {
            hanzi: '我要一杯咖啡。',
            pinyin: 'wǒ yào yì bēi kāfēi.',
            english: 'I want a cup of coffee.',
          },
          {
            hanzi: '我想去，可是沒有時間。',
            pinyin: 'wǒ xiǎng qù, kěshì méiyǒu shíjiān.',
            english: 'I would like to go, but I do not have time.',
          },
        ],
        watchOut:
          '不想 means "do not feel like". 不要 means "do not want" and can sound like an order (a blunt "no").',
      },
      {
        id: 'dou-placement',
        title: '都 comes after the group',
        waypoint: 'Waypoint 02',
        template: '... the group ... + 都 (dōu) + Verb',
        why: '都 points backward to something already named, so that thing must come before 都.',
        examples: [
          {
            hanzi: '我們都是學生。',
            pinyin: 'wǒmen dōu shì xuésheng.',
            english: 'We are all students.',
          },
          {
            hanzi: '這些書我都看了。',
            pinyin: 'zhèxiē shū wǒ dōu kàn le.',
            english: 'I have read all these books.',
          },
        ],
        contrast: {
          wrong: '都我的朋友喜歡中文。',
          right: '我的朋友都喜歡中文。',
          why: '都 cannot start the sentence -- the group it sums up has to come first.',
        },
      },
      {
        id: 'le-overuse',
        title: 'Do not put 了 on everything',
        waypoint: 'Waypoint 05',
        template:
          '了 = completed or changed. Not for habits or general truths.',
        why: 'English past tense is automatic; Chinese 了 is not. Habits, likes, and descriptions take no 了.',
        examples: [
          {
            hanzi: '我每天喝咖啡。',
            pinyin: 'wǒ měitiān hē kāfēi.',
            english: 'I drink coffee every day. (habit -- no 了)',
          },
          {
            hanzi: '我很喜歡中文。',
            pinyin: 'wǒ hěn xǐhuān zhōngwén.',
            english: 'I like Chinese a lot. (a state -- no 了)',
          },
        ],
        contrast: {
          wrong: '我昨天很忙了。',
          right: '我昨天很忙。',
          why: 'A past state with 很 takes no 了. Use 了 only when the point is that something changed.',
        },
      },
    ],
  },
];
