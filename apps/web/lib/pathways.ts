import vocabulary from './vocabulary.json';

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

const topics = [
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

const source = vocabulary as Record<string, Flashcard[]>;

export const pathway = {
  id: 'everyday-connections',
  name: 'Everyday Connections',
  chinese: '日常連結',
  description: 'Useful Mandarin for the places, plans, and people in everyday life.',
  waypoints: topics.map(([id, name, chinese], index): Waypoint => {
    const lesson = index + 11;
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
  }),
};
