import volume1Vocabulary from './pathway01-vocabulary.json';
import volume2Vocabulary from './vocabulary.json';
import volume3Vocabulary from './volume3-vocabulary.json';
import volume4Vocabulary from './volume4-vocabulary.json';

export type Flashcard = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type Deck = {
  id: 'a' | 'b';
  name: string;
  cards: Flashcard[];
};

export type Waypoint = {
  id: string;
  number: number;
  name: string;
  chinese: string;
  decks: Deck[];
};

export type Pathway = {
  id: string;
  number: number;
  name: string;
  chinese: string;
  description: string;
  waypoints: Waypoint[];
};

const volume1Topics = [
  ['greetings', 'Greetings', '問候'],
  ['family', 'Family', '家庭'],
  ['time-date', 'Time and Date', '時間和日期'],
  ['hobbies', 'Hobbies', '愛好'],
  ['visiting-friends', 'Visiting Friends', '看朋友'],
  ['appointments', 'Making Appointments', '約時間'],
  ['studying-chinese', 'Studying Chinese', '學中文'],
  ['school-life', 'School Life', '學校生活'],
  ['shopping', 'Shopping', '購物'],
  ['transportation', 'Transportation', '交通'],
] as const;

const volume2Topics = [
  ['weather', 'Weather', '天氣'],
  ['dining', 'Dining', '用餐'],
  ['directions', 'Asking Directions', '問路'],
  ['birthday', 'Birthday Party', '生日舞會'],
  ['doctor', 'Seeing a Doctor', '看病'],
  ['dating', 'Dating', '約會'],
  ['apartment', 'Renting an Apartment', '租房子'],
  ['sports', 'Sports', '運動'],
  ['travel', 'Travel', '旅行'],
  ['airport', 'At the Airport', '在機場'],
] as const;

const volume3Topics = [
  ['semester', 'Starting a New Semester', '開學'],
  ['dorm-life', 'Dorm Life', '宿舍生活'],
  ['restaurant', 'At a Restaurant', '在飯館兒'],
  ['shopping', 'Shopping', '買東西'],
  ['classes', 'Choosing Classes', '選課'],
  ['dating', 'Dating', '男朋友女朋友'],
  ['computers', 'Computers and the Internet', '電腦和網絡'],
  ['part-time-work', 'Working Part-Time', '打工'],
  ['education', 'Education', '教育'],
  ['geography', 'Geography of China', '中國地理'],
] as const;

const volume4Topics = [
  ['holidays', "China's Holidays", '中國的節日'],
  ['changes', 'Changes in China', '中國的變化'],
  ['yunnan-trip', 'A Trip to Yunnan', '去雲南旅遊'],
  ['health', 'Lifestyle and Health', '生活與健康'],
  ['gender-equality', 'Gender Equality', '男女平等'],
  ['environment', 'Environmental Protection and Energy Conservation', '環境保護與節約能源'],
  ['wealth-management', 'Wealth Management and Investing', '理財與投資'],
  ['chinese-history', "China's History", '中國歷史'],
  ['job-interview', 'Job Interview', '面試'],
  ['smaller-world', 'The World Is Getting Smaller', '世界變小了'],
] as const;

function makeWaypoints(
  topics: ReadonlyArray<readonly [string, string, string]>,
  source: Record<string, Flashcard[]>,
  lessonOffset: number,
): Waypoint[] {
  return topics.map(([id, name, chinese], index) => {
    const lesson = index + lessonOffset;
    return {
      id,
      number: index + 1,
      name,
      chinese,
      decks: [
        { id: 'a', name: 'Deck A', cards: source[`${lesson}-a`] },
        { id: 'b', name: 'Deck B', cards: source[`${lesson}-b`] },
      ],
    };
  });
}

export const pathways: Pathway[] = [
  {
    id: 'first-steps',
    number: 1,
    name: 'First Steps',
    chinese: '入門',
    description: 'Start from zero: greetings, family, dates, hobbies, and the everyday basics.',
    waypoints: makeWaypoints(volume1Topics, volume1Vocabulary as Record<string, Flashcard[]>, 1),
  },
  {
    id: 'everyday-connections',
    number: 2,
    name: 'Everyday Connections',
    chinese: '日常連結',
    description: 'Useful Mandarin for the places, plans, and people in everyday life.',
    waypoints: makeWaypoints(volume2Topics, volume2Vocabulary as Record<string, Flashcard[]>, 11),
  },
  {
    id: 'wider-horizons',
    number: 3,
    name: 'Wider Horizons',
    chinese: '拓展視野',
    description: 'Build independence through school, work, relationships, technology, and travel.',
    waypoints: makeWaypoints(volume3Topics, volume3Vocabulary as Record<string, Flashcard[]>, 1),
  },
  {
    id: 'deeper-fluency',
    number: 4,
    name: 'Deeper Fluency',
    chinese: '學以致用',
    description: 'Engage with real adult topics -- society, history, money, and the wider world -- in fluent, natural Chinese.',
    waypoints: makeWaypoints(volume4Topics, volume4Vocabulary as Record<string, Flashcard[]>, 11),
  },
];
