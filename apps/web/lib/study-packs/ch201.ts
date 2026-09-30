import { pathways } from '../pathways';
import type {
  CanonicalVocabulary,
  CharacterStudy,
  ExampleSentence,
  GrammarPattern,
  SpeakingPrompt,
  StudyExercise,
  StudyPack,
} from './types';
import { validateStudyPack } from './validate';

type VocabSeed = Omit<CanonicalVocabulary, 'hanzi' | 'pinyin' | 'meaning'> & { expectedHanzi: string };

const VOCABULARY_SEEDS: VocabSeed[] = [
  { id: 'v3-kaixue', expectedHanzi: '開學', pathwayNumber: 3, waypointNumber: 1, deckId: 'a', cardIndex: 0 },
  { id: 'v3-xinsheng', expectedHanzi: '新生', pathwayNumber: 3, waypointNumber: 1, deckId: 'a', cardIndex: 1 },
  { id: 'v3-bijiao', expectedHanzi: '比較', pathwayNumber: 3, waypointNumber: 1, deckId: 'a', cardIndex: 10 },
  { id: 'v3-banjia', expectedHanzi: '搬家', pathwayNumber: 3, waypointNumber: 1, deckId: 'b', cardIndex: 4 },
  { id: 'v3-shiying', expectedHanzi: '適應', pathwayNumber: 3, waypointNumber: 1, deckId: 'b', cardIndex: 2 },
  { id: 'v3-shengqian', expectedHanzi: '省錢', pathwayNumber: 3, waypointNumber: 1, deckId: 'a', cardIndex: 11 },
  { id: 'v3-ziyou', expectedHanzi: '自由', pathwayNumber: 3, waypointNumber: 1, deckId: 'a', cardIndex: 12 },
  { id: 'v3-haochu', expectedHanzi: '好處', pathwayNumber: 3, waypointNumber: 1, deckId: 'b', cardIndex: 1 },
  { id: 'v3-bangmang', expectedHanzi: '幫忙', pathwayNumber: 3, waypointNumber: 1, deckId: 'b', cardIndex: 5 },
  { id: 'v3-chusheng', expectedHanzi: '出生', pathwayNumber: 3, waypointNumber: 1, deckId: 'a', cardIndex: 4 },
  { id: 'v3-dong', expectedHanzi: '棟', pathwayNumber: 3, waypointNumber: 2, deckId: 'a', cardIndex: 10 },
  { id: 'v3-riyongpin', expectedHanzi: '日用品', pathwayNumber: 3, waypointNumber: 2, deckId: 'a', cardIndex: 13 },
  { id: 'v3-yiban', expectedHanzi: '一般', pathwayNumber: 3, waypointNumber: 2, deckId: 'b', cardIndex: 6 },
  { id: 'v3-canguanr', expectedHanzi: '餐館兒', pathwayNumber: 3, waypointNumber: 2, deckId: 'b', cardIndex: 9 },
  { id: 'v3-didao', expectedHanzi: '地道', pathwayNumber: 3, waypointNumber: 2, deckId: 'b', cardIndex: 10 },
];

function resolveVocabulary(seed: VocabSeed): CanonicalVocabulary {
  const { expectedHanzi, ...identity } = seed;
  const pathway = pathways.find((item) => item.number === seed.pathwayNumber);
  const waypoint = pathway?.waypoints.find((item) => item.number === seed.waypointNumber);
  const deck = waypoint?.decks.find((item) => item.id === seed.deckId);
  const card = deck?.cards[seed.cardIndex];
  if (!card) throw new Error(`CH201 canonical vocabulary did not resolve: ${seed.id}`);
  if (card.hanzi !== expectedHanzi) throw new Error(`CH201 canonical vocabulary mismatch for ${seed.id}: expected ${expectedHanzi}, found ${card.hanzi}`);
  return { ...identity, ...card };
}

export const CH201_VOCABULARY = VOCABULARY_SEEDS.map(resolveVocabulary);
export const CH201_VOCABULARY_BY_ID = new Map(CH201_VOCABULARY.map((item) => [item.id, item]));

export const CH201_EXAMPLES: ExampleSentence[] = [
  { id: 'ex-school-started', traditional: '今天開學了。', pinyin: 'Jīntiān kāixué le.', english: 'School started today.', vocabularyIds: ['v3-kaixue'], grammarIds: [], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-new-student', traditional: '我是新生。', pinyin: 'Wǒ shì xīnshēng.', english: 'I am a new student.', vocabularyIds: ['v3-xinsheng'], grammarIds: [], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-room-bigger', traditional: '這個房間比較大。', pinyin: 'Zhège fángjiān bǐjiào dà.', english: 'This room is relatively big.', vocabularyIds: ['v3-bijiao'], grammarIds: ['comparatively'], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-moving', traditional: '我下個星期搬家。', pinyin: 'Wǒ xià ge xīngqī bānjiā.', english: 'I am moving next week.', vocabularyIds: ['v3-banjia'], grammarIds: [], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-adapting', traditional: '我還在適應學校生活。', pinyin: 'Wǒ hái zài shìyìng xuéxiào shēnghuó.', english: 'I am still getting used to school life.', vocabularyIds: ['v3-shiying'], grammarIds: [], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-room-furniture', traditional: '我的房間有一張桌子、一把椅子、一張床和一個衣櫃。', pinyin: 'Wǒ de fángjiān yǒu yì zhāng zhuōzi, yì bǎ yǐzi, yì zhāng chuáng hé yí ge yīguì.', english: 'My room has a table, a chair, a bed, and a wardrobe.', vocabularyIds: [], grammarIds: ['place-you'], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-desk', traditional: '我的桌子上有一台電腦和一本書。', pinyin: 'Wǒ de zhuōzi shàng yǒu yì tái diànnǎo hé yì běn shū.', english: 'There is a computer and a book on my desk.', vocabularyIds: [], grammarIds: ['place-you', 'location-noun'], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-live-dorm', traditional: '我住在宿舍。', pinyin: 'Wǒ zhù zài sùshè.', english: 'I live in a dorm.', vocabularyIds: [], grammarIds: [], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-three-rooms', traditional: '我的宿舍有三個房間。', pinyin: 'Wǒ de sùshè yǒu sān ge fángjiān.', english: 'My dorm has three rooms.', vocabularyIds: [], grammarIds: ['place-you'], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-live-alone', traditional: '我喜歡一個人住，因為沒有人打擾我。', pinyin: 'Wǒ xǐhuan yí ge rén zhù, yīnwèi méi yǒu rén dǎrǎo wǒ.', english: 'I like living alone because nobody disturbs me.', vocabularyIds: [], grammarIds: [], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-both-busy', traditional: '我們都很忙。', pinyin: 'Wǒmen dōu hěn máng.', english: 'We are both busy.', vocabularyIds: [], grammarIds: [], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-study-dorm', traditional: '我在宿舍看書。', pinyin: 'Wǒ zài sùshè kàn shū.', english: 'I read in the dorm.', vocabularyIds: [], grammarIds: ['place-action'], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-cat-topic', traditional: '沙發上的貓在睡覺。', pinyin: 'Shāfā shàng de māo zài shuìjiào.', english: 'The cat on the sofa is sleeping.', vocabularyIds: [], grammarIds: ['topic-comment'], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-school-nearby', traditional: '學校附近有一家餐館兒。', pinyin: 'Xuéxiào fùjìn yǒu yì jiā cānguǎnr.', english: 'There is a restaurant near the school.', vocabularyIds: ['v3-canguanr'], grammarIds: ['location-noun', 'place-you'], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-want-food', traditional: '你想吃什麼？', pinyin: 'Nǐ xiǎng chī shénme?', english: 'What would you like to eat?', vocabularyIds: [], grammarIds: [], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-beef-noodles', traditional: '我要一碗牛肉麵。', pinyin: 'Wǒ yào yì wǎn niúròu miàn.', english: 'I want a bowl of beef noodles.', vocabularyIds: [], grammarIds: ['want-order'], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-want-drink', traditional: '你要喝什麼？', pinyin: 'Nǐ yào hē shénme?', english: 'What do you want to drink?', vocabularyIds: [], grammarIds: [], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-water', traditional: '我要一杯水。', pinyin: 'Wǒ yào yì bēi shuǐ.', english: 'I want a glass of water.', vocabularyIds: [], grammarIds: ['want-order'], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-dumplings', traditional: '我吃過餃子。', pinyin: 'Wǒ chī guo jiǎozi.', english: 'I have eaten dumplings before.', vocabularyIds: [], grammarIds: ['experience-guo'], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
  { id: 'ex-no-authentic', traditional: '我沒去過地道的中國餐館兒。', pinyin: 'Wǒ méi qù guo dìdao de Zhōngguó cānguǎnr.', english: 'I have not been to an authentic Chinese restaurant.', vocabularyIds: ['v3-didao', 'v3-canguanr'], grammarIds: ['experience-guo'], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-frequency', traditional: '你多久去一次餐館兒？', pinyin: 'Nǐ duōjiǔ qù yí cì cānguǎnr?', english: 'How often do you go to a restaurant?', vocabularyIds: ['v3-canguanr'], grammarIds: [], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-random-visits', traditional: '不一定，有時候去，有時候不去。', pinyin: 'Bù yídìng, yǒu shíhou qù, yǒu shíhou bú qù.', english: 'It depends; sometimes I go and sometimes I do not.', vocabularyIds: [], grammarIds: [], sourceIds: ['adapted-class-answer'], visibility: 'public-generalized' },
  { id: 'ex-moving-shide', traditional: '我是昨天搬家的。', pinyin: 'Wǒ shì zuótiān bānjiā de.', english: 'It was yesterday that I moved.', vocabularyIds: ['v3-banjia'], grammarIds: ['shi-de'], sourceIds: ['authored-practice'], visibility: 'public-generalized' },
];

export const CH201_EXAMPLES_BY_ID = new Map(CH201_EXAMPLES.map((item) => [item.id, item]));

export const CH201_GRAMMAR: GrammarPattern[] = [
  { id: 'place-you', title: 'Say what exists somewhere', pattern: 'Place + 有 + thing', explanation: 'Put the location first, then 有, then the thing that exists there.', exampleIds: ['ex-desk', 'ex-three-rooms'], canonicalGrammarHref: '/grammar/location#point-you-existence', reviewFocus: 'Put the location before 有.' },
  { id: 'place-action', title: 'Say where an action happens', pattern: 'Subject + 在 + place + action', explanation: 'In this basic pattern, the place comes before the action.', exampleIds: ['ex-study-dorm'], canonicalGrammarHref: '/grammar/location#point-zai-place-verb', reviewFocus: 'Put the place before the action.' },
  { id: 'topic-comment', title: 'Name a topic, then comment', pattern: 'Topic + comment', explanation: 'Name what you are talking about first, then say something understandable about it.', exampleIds: ['ex-desk'], canonicalGrammarHref: '/grammar/basics#point-topic-first', reviewFocus: 'Keep the topic and its comment clear.' },
  { id: 'comparatively', title: 'Describe something comparatively', pattern: 'Subject + 比較 + adjective', explanation: '比較 before an adjective means relatively or comparatively; it is not a full A 比 B comparison.', exampleIds: ['ex-room-bigger'], reviewFocus: 'Put 比較 immediately before the adjective.' },
  { id: 'want-order', title: 'Order food or drink', pattern: 'Subject + 要 + quantity + food/drink', explanation: 'Use 要 to state what you want, with a suitable measure word when counting it.', exampleIds: ['ex-beef-noodles', 'ex-water'], reviewFocus: 'Include an appropriate measure word.' },
  { id: 'experience-guo', title: 'Talk about an experience', pattern: 'Verb + 過', explanation: 'Place 過 after the verb to say that you have had an experience. Use 沒 + verb + 過 for the negative.', exampleIds: ['ex-dumplings', 'ex-no-authentic'], reviewFocus: 'Use 沒, not 不, for a past experience you have not had.' },
  { id: 'shi-de', title: 'Highlight a known past detail', pattern: '是…的', explanation: 'Use 是…的 to highlight a detail such as when or where a known past event happened—not as a general past tense.', exampleIds: ['ex-moving-shide'], reviewFocus: 'Use the construction only when highlighting a known event detail.' },
  { id: 'location-noun', title: 'Build a location expression', pattern: 'Noun + 上 / 附近', explanation: 'Add a location word after a noun: 桌子上 means on the desk; 學校附近 means near the school.', exampleIds: ['ex-desk'], canonicalGrammarHref: '/grammar/location#point-here-there', reviewFocus: 'Keep the noun and location word together.' },
];

export const CH201_GRAMMAR_BY_ID = new Map(CH201_GRAMMAR.map((item) => [item.id, item]));

export const CH201_SPEAKING_PROMPTS: SpeakingPrompt[] = [
  { id: 'speak-furniture', unitId: 'dorm-life', promptZh: '你的房間有什麼家具？', promptPinyin: 'Nǐ de fángjiān yǒu shénme jiājù?', promptEn: 'What furniture do you have in your room?', suggestedAnswerIds: ['ex-room-furniture'], vocabularyIds: [], sourceIds: ['adapted-class-answer'] },
  { id: 'speak-desk', unitId: 'dorm-life', promptZh: '你的桌子上有什麼？', promptPinyin: 'Nǐ de zhuōzi shàng yǒu shénme?', promptEn: 'What is on your desk?', suggestedAnswerIds: ['ex-desk'], vocabularyIds: [], sourceIds: ['adapted-class-answer'] },
  { id: 'speak-live', unitId: 'dorm-life', promptZh: '你住在哪裡？', promptPinyin: 'Nǐ zhù zài nǎlǐ?', promptEn: 'Where do you live?', suggestedAnswerIds: ['ex-live-dorm'], vocabularyIds: [], sourceIds: ['adapted-class-answer'] },
  { id: 'speak-rooms', unitId: 'dorm-life', promptZh: '你的宿舍有幾個房間？', promptPinyin: 'Nǐ de sùshè yǒu jǐ ge fángjiān?', promptEn: 'How many rooms does your dorm have?', suggestedAnswerIds: ['ex-three-rooms'], vocabularyIds: [], sourceIds: ['adapted-class-answer'] },
  { id: 'speak-preference', unitId: 'dorm-life', promptZh: '你喜歡怎麼住？', promptPinyin: 'Nǐ xǐhuan zěnme zhù?', promptEn: 'What kind of living arrangement do you prefer?', suggestedAnswerIds: ['ex-live-alone'], vocabularyIds: [], sourceIds: ['adapted-class-answer'] },
  { id: 'speak-roommate', unitId: 'dorm-life', promptZh: '你和室友一起做什麼？', promptPinyin: 'Nǐ hé shìyǒu yìqǐ zuò shénme?', promptEn: 'What do you and your roommate do together?', suggestedAnswerIds: ['ex-both-busy'], vocabularyIds: [], sourceIds: ['adapted-class-answer'] },
  { id: 'speak-authentic', unitId: 'restaurant', promptZh: '你去過地道的中國餐館兒嗎？', promptPinyin: 'Nǐ qù guo dìdao de Zhōngguó cānguǎnr ma?', promptEn: 'Have you been to an authentic Chinese restaurant?', suggestedAnswerIds: ['ex-no-authentic'], vocabularyIds: ['v3-didao', 'v3-canguanr'], sourceIds: ['adapted-class-answer'] },
  { id: 'speak-frequency', unitId: 'restaurant', promptZh: '你多久去一次餐館兒？', promptPinyin: 'Nǐ duōjiǔ qù yí cì cānguǎnr?', promptEn: 'How often do you go to a restaurant?', suggestedAnswerIds: ['ex-random-visits'], vocabularyIds: ['v3-canguanr'], sourceIds: ['adapted-class-answer'] },
];

export const CH201_SPEAKING_BY_ID = new Map(CH201_SPEAKING_PROMPTS.map((item) => [item.id, item]));

export const CH201_CHARACTERS: CharacterStudy[] = [
  ['的', 'de', 'possession or description particle', '我的書'], ['是', 'shì', 'to be', '我是學生'], ['一', 'yī', 'one', '一本書'], ['不', 'bù', 'not', '不去'], ['你', 'nǐ', 'you', '你好'], ['我', 'wǒ', 'I; me', '我們'], ['學', 'xué', 'study; learn', '學中文'], ['了', 'le', 'change or completion particle', '開學了'], ['個', 'gè', 'general measure word', '一個人'], ['天', 'tiān', 'day; sky', '今天'], ['有', 'yǒu', 'have; exist', '有一本書'], ['在', 'zài', 'at; located', '在宿舍'], ['麼', 'me', 'part of 什麼', '什麼'], ['上', 'shàng', 'on; above', '桌子上'], ['好', 'hǎo', 'good; well', '很好'], ['這', 'zhè', 'this', '這個'], ['校', 'xiào', 'part of school', '學校'], ['他', 'tā', 'he; him', '他很好'], ['張', 'zhāng', 'measure word for flat objects', '一張桌子'], ['明', 'míng', 'bright; part of tomorrow', '明天'], ['很', 'hěn', 'very; common before adjectives', '很好'], ['什', 'shén', 'part of 什麼', '什麼'], ['中', 'zhōng', 'middle; Chinese', '中文'], ['生', 'shēng', 'life; birth; student component', '新生'], ['說', 'shuō', 'say; speak', '說中文'], ['住', 'zhù', 'live; reside', '住宿舍'], ['以', 'yǐ', 'used in combinations such as 可以', '可以'], ['就', 'jiù', 'then; just, depending on context', '我就去'], ['林', 'lín', 'forest; surname Lin', '林老師'], ['房', 'fáng', 'room; house component', '房間'],
].map(([character, pinyin, use, combination]) => ({ id: `char-${character}`, character, pinyin, use, combination }));

const UNIT_BY_VOCABULARY: Record<string, string> = {
  'v3-kaixue': 'semester', 'v3-xinsheng': 'semester', 'v3-bijiao': 'semester', 'v3-banjia': 'semester', 'v3-shiying': 'semester',
  'v3-shengqian': 'dorm-life', 'v3-ziyou': 'dorm-life', 'v3-haochu': 'dorm-life', 'v3-bangmang': 'dorm-life', 'v3-chusheng': 'dorm-life', 'v3-dong': 'dorm-life', 'v3-riyongpin': 'dorm-life',
  'v3-yiban': 'restaurant', 'v3-canguanr': 'restaurant', 'v3-didao': 'restaurant',
};

function vocabularyExercises(): StudyExercise[] {
  return CH201_VOCABULARY.map((item, index) => {
    const distractors = [1, 2, 3].map((offset) => CH201_VOCABULARY[(index + offset) % CH201_VOCABULARY.length]);
    return {
      id: `choice-vocab-${item.id}`,
      kind: 'choice' as const,
      unitId: UNIT_BY_VOCABULARY[item.id],
      title: `Meaning of ${item.hanzi}`,
      prompt: `What does ${item.hanzi} mean here?`,
      options: [item, ...distractors].map((option) => ({ id: option.id, text: option.meaning })),
      correctOptionIds: [item.id],
      explanation: `${item.hanzi} (${item.pinyin}) means “${item.meaning}.”`,
      skill: 'meaning' as const,
      targetKeys: [`vocabulary:${item.id}`],
      mistakeTag: 'vocabulary-meaning',
      estimatedSeconds: 40,
    };
  });
}

const sentenceOrderSeeds = [
  ['order-relative', 'semester', 'Build: This room is relatively big.', ['這個房間', '比較', '大'], '這個房間比較大。', 'comparatively', 'Put 比較 immediately before the adjective.'],
  ['order-desk', 'dorm-life', 'Build: There is a book on the desk.', ['桌子上', '有', '一本書'], '桌子上有一本書。', 'place-you', 'Put the location before 有.'],
  ['order-dorm-study', 'dorm-life', 'Build: I read in the dorm.', ['我', '在宿舍', '看書'], '我在宿舍看書。', 'place-action', 'For this basic pattern, put the place before the action.'],
  ['order-three-rooms', 'dorm-life', 'Build: My dorm has three rooms.', ['我的宿舍', '有', '三個房間'], '我的宿舍有三個房間。', 'place-you', 'Put the location or possessor before 有.'],
  ['order-noodles', 'restaurant', 'Build: I want a bowl of beef noodles.', ['我', '要', '一碗', '牛肉麵'], '我要一碗牛肉麵。', 'want-order', 'Use 要 before the quantity and food.'],
  ['order-water', 'restaurant', 'Build: I want a glass of water.', ['我', '要', '一杯', '水'], '我要一杯水。', 'want-order', 'Use the measure word 杯 between the number and 水.'],
  ['order-dumplings', 'restaurant', 'Build: I have eaten dumplings before.', ['我', '吃過', '餃子'], '我吃過餃子。', 'experience-guo', 'Place 過 directly after the verb.'],
  ['order-topic-cat', 'dorm-life', 'Build: The cat on the sofa is sleeping.', ['沙發上的貓', '在睡覺'], '沙發上的貓在睡覺。', 'topic-comment', 'Name the topic first, then make the comment clear.'],
  ['order-moving-shide', 'semester', 'Build: It was yesterday that I moved.', ['我', '是昨天', '搬家的'], '我是昨天搬家的。', 'shi-de', 'Wrap the highlighted detail and known event with 是…的.'],
  ['order-school-nearby', 'restaurant', 'Build: There is a restaurant near the school.', ['學校附近', '有', '一家餐館兒'], '學校附近有一家餐館兒。', 'location-noun', 'Keep 學校 and 附近 together as the location expression.'],
] as const;

function sentenceExercises(): StudyExercise[] {
  return sentenceOrderSeeds.map(([id, unitId, prompt, words, answer, grammarId, explanation]) => {
    const tokens = words.map((text, index) => ({ id: `${id}-${index}`, text }));
    return {
      id,
      kind: 'sentence-order' as const,
      unitId,
      title: 'Build the sentence',
      prompt,
      tokens,
      acceptedOrders: [tokens.map((token) => token.id)],
      answer,
      explanation,
      skill: 'sentence-order' as const,
      targetKeys: [`grammar:${grammarId}`],
      mistakeTag: grammarId === 'place-action' ? 'place-before-action' : grammarId,
      estimatedSeconds: 70,
    };
  });
}

function speakingExercises(): StudyExercise[] {
  return CH201_SPEAKING_PROMPTS.map((prompt) => ({
    id: `exercise-${prompt.id}`,
    kind: 'speaking-recall' as const,
    unitId: prompt.unitId,
    title: 'Speaking recall',
    promptId: prompt.id,
    explanation: 'This is a personal response. Compare your answer with the model, then rate how independently you answered.',
    skill: 'speaking-recall' as const,
    targetKeys: prompt.vocabularyIds.length > 0 ? prompt.vocabularyIds.map((id) => `vocabulary:${id}`) : [`speaking:${prompt.id}`],
    mistakeTag: 'speaking-recall',
    estimatedSeconds: 90,
  }));
}

function characterExercises(): StudyExercise[] {
  return CH201_CHARACTERS.map((item, index) => {
    const distractors = [1, 2, 3].map((offset) => CH201_CHARACTERS[(index + offset) % CH201_CHARACTERS.length]);
    return {
      id: `choice-character-${item.id}`,
      kind: 'choice' as const,
      title: `Recognize ${item.character}`,
      prompt: `Which use matches ${item.character}?`,
      options: [item, ...distractors].map((option) => ({ id: option.id, text: `${option.use} — ${option.combination}` })),
      correctOptionIds: [item.id],
      explanation: `${item.character} (${item.pinyin}) is used here as “${item.use},” as in ${item.combination}.`,
      skill: 'recognition' as const,
      targetKeys: [`character:${item.character}`],
      mistakeTag: 'character-recognition',
      estimatedSeconds: 40,
    };
  });
}

export const CH201_EXERCISES: StudyExercise[] = [
  ...vocabularyExercises(),
  ...sentenceExercises(),
  ...speakingExercises(),
  ...characterExercises(),
];
export const CH201_EXERCISES_BY_ID = new Map(CH201_EXERCISES.map((item) => [item.id, item]));

export const CH201_PACK: StudyPack = {
  id: 'ch201',
  contentVersion: 1,
  title: 'Chinese Class',
  titleZh: '中文課',
  description: 'A focused review of vocabulary, grammar, sentence patterns, and speaking from your current class.',
  sourceContext: 'CH201 Learning',
  sources: [
    { id: 'class-seed', kind: 'conversation', label: 'CH201 Learning supplied study material', verification: 'context-confirmed', note: 'Full private project export was not available in this checkout.' },
    { id: 'authored-practice', kind: 'authored-practice', label: 'Original ZiLu practice examples', verification: 'verified' },
    { id: 'adapted-class-answer', kind: 'conversation', label: 'Generalized examples adapted from approved class answers', verification: 'context-confirmed' },
    { id: 'integrated-chinese-3', kind: 'textbook', label: 'Integrated Chinese 3, fourth edition', verification: 'needs-review', note: 'Exact page-level verification remains pending because source files are not in this checkout.' },
  ],
  collections: [
    { id: 'week-01', title: 'Week 1 Vocabulary', titleZh: '第一週詞語', description: 'Starting the semester and adjusting to school.', vocabularyIds: ['v3-kaixue', 'v3-xinsheng', 'v3-bijiao', 'v3-banjia', 'v3-shiying'] },
    { id: 'week-02', title: 'Week 2 Vocabulary', titleZh: '第二週詞語', description: 'Benefits, independence, and helping others.', vocabularyIds: ['v3-shengqian', 'v3-ziyou', 'v3-haochu', 'v3-bangmang', 'v3-chusheng'] },
    { id: 'week-03', title: 'Week 3 Vocabulary', titleZh: '第三週詞語', description: 'Dorm buildings, necessities, and restaurants.', vocabularyIds: ['v3-dong', 'v3-riyongpin', 'v3-yiban', 'v3-canguanr', 'v3-didao'] },
    { id: 'speaking', title: 'Speaking Practice', titleZh: '口語練習', description: 'Eight short prompts with model responses.', speakingPromptIds: CH201_SPEAKING_PROMPTS.map((item) => item.id) },
    { id: 'grammar', title: 'Grammar', titleZh: '語法', description: 'Eight useful patterns from the current material.', grammarIds: CH201_GRAMMAR.map((item) => item.id) },
  ],
  units: [
    {
      id: 'semester', titleZh: '開學', titlePinyin: 'Kāixué', titleEn: 'Starting the Semester', summary: 'Talk simply about starting school, moving, and adapting.',
      learningGoals: ['Talk about starting school and being a new student.', 'Recognize the Week 1 vocabulary.', 'Describe moving and adapting with short sentences.'],
      vocabularyIds: ['v3-kaixue', 'v3-xinsheng', 'v3-bijiao', 'v3-banjia', 'v3-shiying'], grammarIds: ['comparatively', 'shi-de'],
      exampleIds: ['ex-school-started', 'ex-new-student', 'ex-room-bigger', 'ex-moving', 'ex-adapting', 'ex-moving-shide'], speakingPromptIds: [],
      exerciseIds: CH201_EXERCISES.filter((item) => item.unitId === 'semester').map((item) => item.id), sourceIds: ['class-seed', 'authored-practice', 'integrated-chinese-3'],
    },
    {
      id: 'dorm-life', titleZh: '宿舍生活', titlePinyin: 'Sùshè Shēnghuó', titleEn: 'Dorm Life', summary: 'Describe a room, locate objects and activities, and talk about living preferences.',
      learningGoals: ['Describe furniture and items on a desk.', 'Say where an activity happens.', 'Express a simple room preference.', 'Answer a short question about roommates.'],
      vocabularyIds: ['v3-shengqian', 'v3-ziyou', 'v3-haochu', 'v3-bangmang', 'v3-chusheng', 'v3-dong', 'v3-riyongpin'], grammarIds: ['place-you', 'place-action', 'topic-comment', 'location-noun'],
      exampleIds: ['ex-room-furniture', 'ex-desk', 'ex-live-dorm', 'ex-three-rooms', 'ex-live-alone', 'ex-both-busy', 'ex-study-dorm', 'ex-cat-topic'], speakingPromptIds: CH201_SPEAKING_PROMPTS.filter((item) => item.unitId === 'dorm-life').map((item) => item.id),
      exerciseIds: CH201_EXERCISES.filter((item) => item.unitId === 'dorm-life').map((item) => item.id), sourceIds: ['class-seed', 'adapted-class-answer', 'integrated-chinese-3'],
    },
    {
      id: 'restaurant', titleZh: '在飯館兒', titlePinyin: 'Zài Fànguǎnr', titleEn: 'At a Restaurant', summary: 'Order food and drink and answer simple questions about restaurant experiences.',
      learningGoals: ['Say what food or drink you want.', 'Recognize restaurant vocabulary from class.', 'Talk briefly about restaurant experiences and frequency.'],
      vocabularyIds: ['v3-yiban', 'v3-canguanr', 'v3-didao'], grammarIds: ['want-order', 'experience-guo'],
      exampleIds: ['ex-want-food', 'ex-beef-noodles', 'ex-want-drink', 'ex-water', 'ex-dumplings', 'ex-no-authentic', 'ex-frequency', 'ex-random-visits', 'ex-school-nearby'], speakingPromptIds: CH201_SPEAKING_PROMPTS.filter((item) => item.unitId === 'restaurant').map((item) => item.id),
      exerciseIds: CH201_EXERCISES.filter((item) => item.unitId === 'restaurant').map((item) => item.id), sourceIds: ['class-seed', 'authored-practice', 'adapted-class-answer', 'integrated-chinese-3'],
    },
  ],
};

const validationErrors = validateStudyPack({
  pack: CH201_PACK,
  vocabulary: CH201_VOCABULARY,
  examples: CH201_EXAMPLES,
  grammar: CH201_GRAMMAR,
  speaking: CH201_SPEAKING_PROMPTS,
  exercises: CH201_EXERCISES,
  characters: CH201_CHARACTERS,
});
if (validationErrors.length > 0) {
  throw new Error(`Invalid CH201 study pack:\n${validationErrors.join('\n')}`);
}

export function getCh201Unit(unitId: string) {
  return CH201_PACK.units.find((unit) => unit.id === unitId);
}

export function vocabularyForIds(ids: string[]) {
  return ids.map((id) => CH201_VOCABULARY_BY_ID.get(id)).filter((item): item is CanonicalVocabulary => Boolean(item));
}

export function exercisesForUnit(unitId: string) {
  return CH201_EXERCISES.filter((exercise) => exercise.unitId === unitId);
}
