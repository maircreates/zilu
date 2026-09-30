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
    vocabulary: [{ hanzi: '工作', pinyin: 'gōngzuò', meaning: 'work; job' }, { hanzi: '認真', pinyin: 'rènzhēn', meaning: 'serious; diligently' }, { hanzi: '清楚', pinyin: 'qīngchu', meaning: 'clear' }, { hanzi: '習慣', pinyin: 'xíguàn', meaning: 'habit; be used to' }, { hanzi: '決定', pinyin: 'juédìng', meaning: 'decide' }, { hanzi: '幫助', pinyin: 'bāngzhù', meaning: 'help' }],
    writingWords: ['工作', '公司', '同事', '每天', '早上', '晚上', '認真', '忙', '覺得', '習慣', '幫助', '希望', '以後', '更', '好', '清楚'],
    writingPrompt: 'Write a short, invented daily routine or work/school experience. Keep it general; do not include private facts you do not want stored in this browser.',
    reading: { passage: '王老師說得很清楚。學生都認真地聽。下課以後，小李慢慢地寫作業，因為他希望寫得更好。', question: 'Why does Xiao Li do homework slowly?', answer: 'He hopes to do it better.' },
    translations: [{ prompt: 'She speaks Chinese very clearly.', answer: '她中文說得很清楚。' }, { prompt: 'He studies diligently.', answer: '他認真地學習。' }, { prompt: 'This is a new book.', answer: '這是一本新的書。' }, { prompt: 'I hope to do better later.', answer: '我希望以後做得更好。' }],
  },
  {
    id: 'unit-3', title: 'Unit 3 Test', titleZh: '第三單元考試', lessons: 'Lessons 7–8', summary: 'Use guided practice to make job and money language manageable before attempting test conditions.', sourceNote: 'The review source has conflicting translation totals and does not add to 100. ZiLu shows the sections, but does not invent a final weighting.',
    sections: [{ name: 'Listening', points: 'See source' }, { name: 'Vocabulary and grammar', points: 'See source' }, { name: 'Translation', points: '12 or 16 (source conflict)' }, { name: 'Reading', points: 'See source' }, { name: 'Writing', points: 'See source' }],
    foundations: [...foundationalGrammar, { title: 'Explain a reason', explanation: 'Use 因為 to give a reason. Keep the reason and result as two clear ideas before joining them.', example: '因為我想省錢，所以我找一份工作。' }],
    vocabulary: [{ hanzi: '工作', pinyin: 'gōngzuò', meaning: 'job; work' }, { hanzi: '薪水', pinyin: 'xīnshuǐ', meaning: 'salary' }, { hanzi: '省錢', pinyin: 'shěngqián', meaning: 'save money' }, { hanzi: '需要', pinyin: 'xūyào', meaning: 'need' }, { hanzi: '計畫', pinyin: 'jìhuà', meaning: 'plan' }, { hanzi: '將來', pinyin: 'jiānglái', meaning: 'future' }],
    writingWords: ['工作', '薪水', '省錢', '花錢', '需要', '計畫', '將來', '希望', '公司', '同事', '忙', '自由', '好處', '決定', '因為', '所以'],
    writingPrompt: 'Write an invented short note about a job or finances. Use a fictional situation if you prefer; this is practice, not a request for real financial information.',
    reading: { passage: '小王想買一台電腦，可是他沒有很多錢。他決定星期六工作，因為他想省錢。將來他希望有一份自己喜歡的工作。', question: 'Why does Xiao Wang work on Saturday?', answer: 'He wants to save money.' },
    translations: [{ prompt: 'I need to save money.', answer: '我需要省錢。' }, { prompt: 'Because she is busy, she works at night.', answer: '因為她很忙，所以她晚上工作。' }, { prompt: 'He has a plan for the future.', answer: '他對將來有計畫。' }, { prompt: 'This job has many benefits.', answer: '這份工作有很多好處。' }],
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
