/**
 * 字力房 -> 調對決 (Tone Duel) data. Classic, well-established minimal-pair
 * sets -- the same syllable said with different tones, which is exactly
 * where tone-deafness in non-tonal-language speakers costs the most (a
 * single wrong tone is a different word, not an accent). Each set's items
 * are read aloud via the browser's own TTS (same zh-TW voice used
 * everywhere else in the app) rather than pre-recorded audio.
 */

export type TonePairItem = {
  hanzi: string;
  pinyin: string;
  tone: 1 | 2 | 3 | 4 | 5;
  meaning: string;
};

export type TonePairSet = {
  id: string;
  syllable: string;
  items: TonePairItem[];
};

export const TONE_PAIR_SETS: TonePairSet[] = [
  {
    id: 'ma',
    syllable: 'ma',
    items: [
      { hanzi: '媽', pinyin: 'mā', tone: 1, meaning: 'mom' },
      { hanzi: '麻', pinyin: 'má', tone: 2, meaning: 'hemp; numb' },
      { hanzi: '馬', pinyin: 'mǎ', tone: 3, meaning: 'horse' },
      { hanzi: '罵', pinyin: 'mà', tone: 4, meaning: 'to scold' },
      { hanzi: '嗎', pinyin: 'ma', tone: 5, meaning: 'question particle' },
    ],
  },
  {
    id: 'shi',
    syllable: 'shi',
    items: [
      { hanzi: '詩', pinyin: 'shī', tone: 1, meaning: 'poem' },
      { hanzi: '十', pinyin: 'shí', tone: 2, meaning: 'ten' },
      { hanzi: '使', pinyin: 'shǐ', tone: 3, meaning: 'to make, to cause' },
      { hanzi: '是', pinyin: 'shì', tone: 4, meaning: 'to be' },
    ],
  },
  {
    id: 'tang',
    syllable: 'tang',
    items: [
      { hanzi: '湯', pinyin: 'tāng', tone: 1, meaning: 'soup' },
      { hanzi: '糖', pinyin: 'táng', tone: 2, meaning: 'sugar; candy' },
      { hanzi: '躺', pinyin: 'tǎng', tone: 3, meaning: 'to lie down' },
      { hanzi: '燙', pinyin: 'tàng', tone: 4, meaning: 'scalding hot' },
    ],
  },
  {
    id: 'wang',
    syllable: 'wang',
    items: [
      { hanzi: '汪', pinyin: 'wāng', tone: 1, meaning: '(a dog’s bark; a surname)' },
      { hanzi: '王', pinyin: 'wáng', tone: 2, meaning: 'king' },
      { hanzi: '網', pinyin: 'wǎng', tone: 3, meaning: 'net; the internet' },
      { hanzi: '忘', pinyin: 'wàng', tone: 4, meaning: 'to forget' },
    ],
  },
  {
    id: 'guo',
    syllable: 'guo',
    items: [
      { hanzi: '國', pinyin: 'guó', tone: 2, meaning: 'country' },
      { hanzi: '果', pinyin: 'guǒ', tone: 3, meaning: 'fruit' },
      { hanzi: '過', pinyin: 'guò', tone: 4, meaning: 'to pass; to cross' },
    ],
  },
  {
    id: 'mai',
    syllable: 'mai',
    items: [
      { hanzi: '買', pinyin: 'mǎi', tone: 3, meaning: 'to buy' },
      { hanzi: '賣', pinyin: 'mài', tone: 4, meaning: 'to sell' },
    ],
  },
  {
    id: 'wen',
    syllable: 'wen',
    items: [
      { hanzi: '聞', pinyin: 'wén', tone: 2, meaning: 'to smell; to hear of' },
      { hanzi: '問', pinyin: 'wèn', tone: 4, meaning: 'to ask' },
    ],
  },
];
