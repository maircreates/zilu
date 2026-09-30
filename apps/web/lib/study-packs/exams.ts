export type ExamId = 'unit-1' | 'unit-2' | 'unit-3' | 'final';

export type ExamBlueprint = {
  id: ExamId;
  title: string;
  titleZh: string;
  lessons: string;
  summary: string;
  sourceNote?: string;
  sections: Array<{ name: string; points: string }>;
  foundations: Array<{ title: string; explanation: string; example: string }>;
  vocabulary: Array<{ hanzi: string; pinyin: string; meaning: string }>;
  writingWords: string[];
  writingPrompt: string;
  reading: { passage: string; question: string; answer: string };
  translations: Array<{ prompt: string; answer: string }>;
};

const foundationalGrammar = [
  { title: 'Sentence order', explanation: 'Start with who or what you are talking about. Put time before the action, and place before the action when it matters.', example: '我今天在宿舍看書。 — I read in the dorm today.' },
  { title: 'Make a small sentence first', explanation: 'Do not translate every English word. Find the subject, action, and object, then add one detail at a time.', example: '我住在宿舍。 → 我的宿舍離學校很近。' },
];

export const CH201_EXAMS: ExamBlueprint[] = [
  {
    id: 'unit-1', title: 'Unit 1 Test', titleZh: '第一單元考試', lessons: 'Lessons 1–3', summary: 'Start with rooms, school, comparison, and the basic sentences that make the test possible.',
    sections: [{ name: 'Listening', points: '24' }, { name: 'Word placement', points: '5' }, { name: 'Vocabulary usage', points: '5' }, { name: 'Translation', points: '24' }, { name: 'Sentence rearranging', points: '6' }, { name: 'Reading', points: '12' }, { name: 'Writing', points: '24' }],
    foundations: [...foundationalGrammar, { title: 'Compare without getting lost', explanation: '比較 goes immediately before an adjective when it means relatively. 是…的 highlights a detail of a known past event.', example: '這個宿舍比較新。 / 我是昨天搬家的。' }],
    vocabulary: [{ hanzi: '學校', pinyin: 'xuéxiào', meaning: 'school' }, { hanzi: '宿舍', pinyin: 'sùshè', meaning: 'dormitory' }, { hanzi: '比較', pinyin: 'bǐjiào', meaning: 'relatively; compare' }, { hanzi: '離', pinyin: 'lí', meaning: 'away from' }, { hanzi: '教室', pinyin: 'jiàoshì', meaning: 'classroom' }, { hanzi: '地道', pinyin: 'dìdao', meaning: 'authentic; genuine' }],
    writingWords: ['研究生', '學校', '怎麼', '宿舍', '舊', '新', '比較', '離', '棟', '樓', '遠', '教室'],
    writingPrompt: 'Write about your first day in a dorm. Use the supplied writing words to say where it is, what it is like, and how it relates to school.',
    reading: { passage: '我是新生。我住在一棟比較新的宿舍。宿舍離學校不遠，可是離教室比較遠。今天我在宿舍看書。', question: 'Where does the speaker live?', answer: 'The speaker lives in a relatively new dormitory.' },
    translations: [{ prompt: 'This dorm is relatively new.', answer: '這個宿舍比較新。' }, { prompt: 'My dorm is not far from school.', answer: '我的宿舍離學校不遠。' }, { prompt: 'It was yesterday that I moved.', answer: '我是昨天搬家的。' }, { prompt: 'Besides school, I also work.', answer: '除了學校以外，我還工作。' }],
  },
  {
    id: 'unit-2', title: 'Unit 2 Test', titleZh: '第二單元考試', lessons: 'Lessons 4–6', summary: 'Build confidence with descriptions, actions, results, and longer reading before doing a full test.',
    sections: [{ name: 'Listening', points: '24' }, { name: '的 / 地 / 得', points: '5' }, { name: 'Sentence rearranging', points: '9' }, { name: 'Translation', points: '16' }, { name: 'Reading', points: '26' }, { name: 'Writing', points: '20' }],
    foundations: [...foundationalGrammar, { title: '的 / 地 / 得', explanation: '的 connects a description to a noun. 地 connects an adverbial description to an action. 得 comes after a verb or adjective to describe its result or degree.', example: '新的書 / 慢慢地說 / 說得很好' }],
    vocabulary: [{ hanzi: '心事', pinyin: 'xīnshì', meaning: 'something weighing on one’s mind' }, { hanzi: '演唱會', pinyin: 'yǎnchànghuì', meaning: 'vocal concert' }, { hanzi: '一乾二淨', pinyin: 'yī gān èr jìng', meaning: 'completely' }, { hanzi: '忘', pinyin: 'wàng', meaning: 'to forget' }, { hanzi: '丟三拉四', pinyin: 'diū sān lā sì', meaning: 'scatterbrained; forgetful' }, { hanzi: '實際上', pinyin: 'shíjìshàng', meaning: 'in fact; in reality' }, { hanzi: '差不多', pinyin: 'chàbùduō', meaning: 'almost; about the same' }, { hanzi: '網上', pinyin: 'wǎngshàng', meaning: 'online' }, { hanzi: '網絡', pinyin: 'wǎngluò', meaning: 'internet; network' }, { hanzi: '電腦', pinyin: 'diànnǎo', meaning: 'computer' }, { hanzi: '教授', pinyin: 'jiàoshòu', meaning: 'professor' }, { hanzi: '資料', pinyin: 'zīliào', meaning: 'material; data' }, { hanzi: '或者', pinyin: 'huòzhě', meaning: 'or' }, { hanzi: '吵架', pinyin: 'chǎojià', meaning: 'to quarrel' }, { hanzi: '鑰匙', pinyin: 'yàoshi', meaning: 'key' }, { hanzi: '著急', pinyin: 'zháojí', meaning: 'to be anxious; in a hurry' }, { hanzi: '上癮', pinyin: 'shàngyǐn', meaning: 'to become addicted' }, { hanzi: '嚴重', pinyin: 'yánzhòng', meaning: 'serious' }, { hanzi: '雜誌', pinyin: 'zázhì', meaning: 'magazine' }, { hanzi: '聊天', pinyin: 'liáotiān', meaning: 'to chat' }, { hanzi: '到底', pinyin: 'dàodǐ', meaning: 'what on earth; after all' }, { hanzi: '畢業', pinyin: 'bìyè', meaning: 'to graduate' }, { hanzi: '打算', pinyin: 'dǎsuàn', meaning: 'to plan; intend' }, { hanzi: '掙錢', pinyin: 'zhèngqián', meaning: 'to earn money' }, { hanzi: '新聞', pinyin: 'xīnwén', meaning: 'news' }, { hanzi: '根本', pinyin: 'gēnběn', meaning: 'at all; fundamentally' }, { hanzi: '背景', pinyin: 'bèijǐng', meaning: 'background' }, { hanzi: '提', pinyin: 'tí', meaning: 'to mention; bring up' }, { hanzi: '馬虎', pinyin: 'mǎhu', meaning: 'careless' }, { hanzi: '態度', pinyin: 'tàidu', meaning: 'attitude' }, { hanzi: '原來', pinyin: 'yuánlái', meaning: 'as it turns out; originally' }, { hanzi: '生氣', pinyin: 'shēngqì', meaning: 'to get angry' }, { hanzi: '時代', pinyin: 'shídài', meaning: 'era' }, { hanzi: '免費', pinyin: 'miǎnfèi', meaning: 'free of charge' }, { hanzi: '落伍', pinyin: 'luòwǔ', meaning: 'to lag behind' }, { hanzi: '可靠', pinyin: 'kěkào', meaning: 'dependable' }],
    writingWords: ['跟', '朋友', '吵架', '鑰匙', '著急', '原來', '忘', '便宜', '馬虎', '讓', '時候', '不錯', '褲', '質量', '名牌', '衣服'],
    writingPrompt: 'Write about your university study: courses completed or being taken, credits needed for graduation, why you chose your major, why you take Chinese, and how you plan to use Chinese after graduation. Use an invented example if you prefer.',
    reading: { passage: '小李買了一件便宜的衣服，可是質量不錯。他本來很著急，因為找不到鑰匙，後來才發現鑰匙在朋友的包裡。', question: 'Where were Xiao Li’s keys?', answer: 'They were in a friend’s bag.' },
    translations: [{ prompt: 'She speaks Chinese very clearly.', answer: '她中文說得很清楚。' }, { prompt: 'He walks upstairs slowly.', answer: '他慢慢地走上樓去。' }, { prompt: 'This is a beautiful shirt.', answer: '這是一件漂亮的衣服。' }, { prompt: 'I plan to graduate next year.', answer: '我打算明年畢業。' }],
  },
  {
    id: 'unit-3', title: 'Unit 3 Test', titleZh: '第三單元考試', lessons: 'Lessons 7–8', summary: 'Use guided practice to make job and money language manageable before attempting test conditions.', sourceNote: 'The review source has conflicting translation totals and does not add to 100. ZiLu shows the sections, but does not invent a final weighting.',
    sections: [{ name: 'Listening', points: 'See source' }, { name: 'Vocabulary and grammar', points: 'See source' }, { name: 'Translation', points: '12 or 16 (source conflict)' }, { name: 'Reading', points: 'See source' }, { name: 'Writing', points: 'See source' }],
    foundations: [...foundationalGrammar, { title: 'Two actions at the same time', explanation: 'Use 一邊…一邊… for two ongoing actions. Use 不是…就是… to present two alternatives.', example: '很多大學生一邊上課一邊打工。 / 她不是叫外賣，就是跟同學去飯館兒吃飯。' }],
    vocabulary: [{ hanzi: '受到', pinyin: 'shòudào', meaning: 'to receive' }, { hanzi: '良好', pinyin: 'liánghǎo', meaning: 'good; fine' }, { hanzi: '教育', pinyin: 'jiàoyù', meaning: 'education; to educate' }, { hanzi: '生', pinyin: 'shēng', meaning: 'to give birth; to be born' }, { hanzi: '存', pinyin: 'cún', meaning: 'to deposit; save' }, { hanzi: '收入', pinyin: 'shōurù', meaning: 'income' }, { hanzi: '供', pinyin: 'gōng', meaning: 'to provide financial support' }, { hanzi: '壓力', pinyin: 'yālì', meaning: 'pressure' }, { hanzi: '減輕', pinyin: 'jiǎnqīng', meaning: 'to lessen' }, { hanzi: '負擔', pinyin: 'fùdān', meaning: 'burden' }, { hanzi: '適合', pinyin: 'shìhé', meaning: 'to suit' }, { hanzi: '合適', pinyin: 'héshì', meaning: 'suitable' }, { hanzi: '影響', pinyin: 'yǐngxiǎng', meaning: 'to influence' }, { hanzi: '家庭', pinyin: 'jiātíng', meaning: 'family' }, { hanzi: '經驗', pinyin: 'jīngyàn', meaning: 'experience' }, { hanzi: '零用錢', pinyin: 'língyòngqián', meaning: 'pocket money' }, { hanzi: '獎學金', pinyin: 'jiǎngxuéjīn', meaning: 'scholarship' }, { hanzi: '交', pinyin: 'jiāo', meaning: 'to hand in; turn over' }, { hanzi: '貸款', pinyin: 'dàikuǎn', meaning: 'loan' }, { hanzi: '政府', pinyin: 'zhèngfǔ', meaning: 'government' }, { hanzi: '工資', pinyin: 'gōngzī', meaning: 'wages; pay' }, { hanzi: '家教', pinyin: 'jiājiào', meaning: 'tutor; tutoring job' }, { hanzi: '說到', pinyin: 'shuōdào', meaning: 'speaking of' }, { hanzi: '難怪', pinyin: 'nánguài', meaning: 'no wonder' }],
    writingWords: ['家教', '打過', '為什麼', '過', '經濟', '負擔', '減輕', '經驗', '整天', '電腦', '上癮', '嚴重', '那麼', '想', '取得'],
    writingPrompt: 'Write an invented short note about a job or finances. Use a fictional situation if you prefer; this is practice, not a request for real financial information.',
    reading: { passage: '很多大學生一邊上課一邊打工，掙錢來減輕父母的負擔。小王當家教，雖然很忙，但是他得到了很多經驗。', question: 'Why do many university students work while studying?', answer: 'They work to earn money and lessen their parents’ burden.' },
    translations: [{ prompt: 'Many university students study and work at the same time.', answer: '很多大學生一邊上課一邊打工。' }, { prompt: 'This exam gives me a lot of pressure.', answer: '這次考試給我很大的壓力。' }, { prompt: 'Speaking of this shirt, it suits you very well.', answer: '說到這件衣服，你穿起來很合適。' }, { prompt: 'She either orders takeout or eats at a restaurant with classmates.', answer: '她不是叫外賣，就是跟同學去飯館兒吃飯。' }],
  },
  {
    id: 'final', title: 'Final Exam', titleZh: '期末考試', lessons: 'Lessons 1–10', summary: 'A calm, cumulative catch-up path: learn the basics, connect the patterns, then practise the final’s formats.', sourceNote: 'The final review includes Lessons 9–10 even though a separate Unit 4 review was not provided. Its vocabulary list has 40 occurrences and 39 unique items.',
    sections: [{ name: 'Listening', points: '30' }, { name: 'Multiple choice', points: '6' }, { name: '因為 vs 為了', points: '6' }, { name: '的 / 得 / 地', points: '6' }, { name: 'Vocabulary usage', points: '8' }, { name: 'Sentence arranging', points: '8' }, { name: 'Reading', points: '26' }, { name: 'Writing', points: '10' }],
    foundations: [...foundationalGrammar, { title: '因為 vs 為了', explanation: '因為 gives a reason for something that is true. 為了 expresses a purpose or goal.', example: '因為下雨，我不去。 / 為了考試，我每天複習。' }, { title: 'Cumulative review', explanation: 'Final prep is not memorizing 39 words at once. Study a small group, build a sentence, then return to it tomorrow.', example: 'Word → sentence → short reading → test-style question.' }],
    vocabulary: [{ hanzi: '因為', pinyin: 'yīnwèi', meaning: 'because' }, { hanzi: '為了', pinyin: 'wèile', meaning: 'for the purpose of' }, { hanzi: '地理', pinyin: 'dìlǐ', meaning: 'geography' }, { hanzi: '地方', pinyin: 'dìfang', meaning: 'place' }, { hanzi: '附近', pinyin: 'fùjìn', meaning: 'nearby' }, { hanzi: '文化', pinyin: 'wénhuà', meaning: 'culture' }],
    writingWords: ['地方', '地理', '附近', '城市', '學校', '家', '天氣', '有名', '喜歡', '因為'],
    writingPrompt: 'Describe an imagined place and its geography or location. The review does not provide facts to memorize, so use simple, clearly invented details.',
    reading: { passage: '我喜歡這個地方，因為附近有學校、餐館和公園。這裡的天氣不太冷，所以很多人喜歡在外面運動。為了身體好，我也常常去公園。', question: 'Why does the speaker often go to the park?', answer: 'For good health.' },
    translations: [{ prompt: 'Because the weather is good, I like this place.', answer: '因為天氣很好，我喜歡這個地方。' }, { prompt: 'I study every day for the final exam.', answer: '為了期末考試，我每天學習。' }, { prompt: 'There is a park near my school.', answer: '我的學校附近有一個公園。' }, { prompt: 'She writes Chinese very well.', answer: '她中文寫得很好。' }],
  },
];

export const CH201_EXAMS_BY_ID = new Map(CH201_EXAMS.map((exam) => [exam.id, exam]));

export function getCh201Exam(id: string) {
  return CH201_EXAMS_BY_ID.get(id as ExamId);
}
