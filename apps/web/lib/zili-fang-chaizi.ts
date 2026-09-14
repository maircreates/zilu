/**
 * 字力房 -> 拆字 (Character Deconstruction) data. Breaking a character into
 * its components turns "memorize a random shape" into "recognize a
 * pattern" -- these are standard, widely-taught teaching mnemonics, not
 * rigorous historical etymology (a couple, like 家 and 忙, are genuinely
 * debated among scholars). Framed on the page as memory aids, not history.
 */

export type ChaiziPart = {
  hanzi: string;
  meaning: string;
  /** Whether this part is carrying meaning or just supplying the sound
   * (a phono-semantic compound) -- most characters are one of each, not
   * two meaning-parts, and it's worth a learner seeing both kinds. */
  role: 'meaning' | 'sound';
};

export type ChaiziEntry = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  parts: ChaiziPart[];
  story: string;
};

export const CHAIZI_ENTRIES: ChaiziEntry[] = [
  {
    hanzi: '好',
    pinyin: 'hǎo',
    meaning: 'good',
    parts: [
      { hanzi: '女', meaning: 'woman', role: 'meaning' },
      { hanzi: '子', meaning: 'child', role: 'meaning' },
    ],
    story: 'A woman with her child by her side -- a scene read as good, fine, well.',
  },
  {
    hanzi: '休',
    pinyin: 'xiū',
    meaning: 'to rest',
    parts: [
      { hanzi: '亻', meaning: 'person', role: 'meaning' },
      { hanzi: '木', meaning: 'tree', role: 'meaning' },
    ],
    story: 'A person leaning against a tree, taking a break.',
  },
  {
    hanzi: '明',
    pinyin: 'míng',
    meaning: 'bright',
    parts: [
      { hanzi: '日', meaning: 'sun', role: 'meaning' },
      { hanzi: '月', meaning: 'moon', role: 'meaning' },
    ],
    story: 'Sun and moon together -- the two brightest things in the sky, so: bright, clear.',
  },
  {
    hanzi: '林',
    pinyin: 'lín',
    meaning: 'woods, grove',
    parts: [
      { hanzi: '木', meaning: 'tree', role: 'meaning' },
      { hanzi: '木', meaning: 'tree', role: 'meaning' },
    ],
    story: 'Two trees side by side -- enough to call it a grove.',
  },
  {
    hanzi: '森',
    pinyin: 'sēn',
    meaning: 'forest',
    parts: [
      { hanzi: '木', meaning: 'tree', role: 'meaning' },
      { hanzi: '木', meaning: 'tree', role: 'meaning' },
      { hanzi: '木', meaning: 'tree', role: 'meaning' },
    ],
    story: 'Three trees -- more than a grove, a full forest.',
  },
  {
    hanzi: '家',
    pinyin: 'jiā',
    meaning: 'home, family',
    parts: [
      { hanzi: '宀', meaning: 'roof', role: 'meaning' },
      { hanzi: '豕', meaning: 'pig', role: 'meaning' },
    ],
    story: 'A roof over livestock -- an old farming household, kept together under one roof.',
  },
  {
    hanzi: '安',
    pinyin: 'ān',
    meaning: 'peace, safety',
    parts: [
      { hanzi: '宀', meaning: 'roof', role: 'meaning' },
      { hanzi: '女', meaning: 'woman', role: 'meaning' },
    ],
    story: 'A woman safe under a roof -- at ease, secure.',
  },
  {
    hanzi: '信',
    pinyin: 'xìn',
    meaning: 'to trust; a letter',
    parts: [
      { hanzi: '亻', meaning: 'person', role: 'meaning' },
      { hanzi: '言', meaning: 'speech, words', role: 'meaning' },
    ],
    story: 'A person standing by their own words -- trustworthy. The same idea gives us "letter": words carried from one person to another.',
  },
  {
    hanzi: '看',
    pinyin: 'kàn',
    meaning: 'to look, to watch',
    parts: [
      { hanzi: '手', meaning: 'hand', role: 'meaning' },
      { hanzi: '目', meaning: 'eye', role: 'meaning' },
    ],
    story: 'A hand shading the eyes to see something far away -- to look, to watch.',
  },
  {
    hanzi: '忙',
    pinyin: 'máng',
    meaning: 'busy',
    parts: [
      { hanzi: '忄', meaning: 'heart', role: 'meaning' },
      { hanzi: '亡', meaning: 'to lose, to perish', role: 'meaning' },
    ],
    story: 'A heart that\'s "lost itself" -- so busy there\'s no time to think.',
  },
  {
    hanzi: '想',
    pinyin: 'xiǎng',
    meaning: 'to think, to miss',
    parts: [
      { hanzi: '相', meaning: 'to look at, appearance', role: 'meaning' },
      { hanzi: '心', meaning: 'heart', role: 'meaning' },
    ],
    story: 'Looking at something with the heart, not the eyes -- to think about, to long for.',
  },
  {
    hanzi: '男',
    pinyin: 'nán',
    meaning: 'man',
    parts: [
      { hanzi: '田', meaning: 'field', role: 'meaning' },
      { hanzi: '力', meaning: 'strength, power', role: 'meaning' },
    ],
    story: 'Strength applied in the field -- the traditional image behind "man."',
  },
  {
    hanzi: '字',
    pinyin: 'zì',
    meaning: 'character, word',
    parts: [
      { hanzi: '宀', meaning: 'roof', role: 'meaning' },
      { hanzi: '子', meaning: 'child', role: 'meaning' },
    ],
    story: 'A child being raised under a roof -- and by extension, characters "raised" (produced) from the small set of basic roots. This is where ZiLu\'s own name comes from.',
  },
  {
    hanzi: '位',
    pinyin: 'wèi',
    meaning: 'position, seat; a polite measure word for people',
    parts: [
      { hanzi: '亻', meaning: 'person', role: 'meaning' },
      { hanzi: '立', meaning: 'to stand', role: 'meaning' },
    ],
    story: 'A person, standing in their place -- a position, a seat, a spot reserved for someone.',
  },
  {
    hanzi: '媽',
    pinyin: 'mā',
    meaning: 'mom',
    parts: [
      { hanzi: '女', meaning: 'woman', role: 'meaning' },
      { hanzi: '馬', meaning: '(supplies the sound "ma")', role: 'sound' },
    ],
    story: 'Most characters aren\'t two meanings stacked together -- they\'re one meaning part plus one sound part. Here 女 tells you it\'s about a woman/female relation; 馬 (mǎ) isn\'t "horse" at all here, it\'s just lending its sound. Compare it to the ma1-ma5 set in 調對決 (Tone Duel).',
  },
];
