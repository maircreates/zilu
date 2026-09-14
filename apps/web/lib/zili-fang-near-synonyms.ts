/**
 * 字力房 -> 字打架 (Word Fight) data. Near-synonym clusters that a bilingual
 * dictionary collapses into one English word, so the distinction has no
 * translation to lean on -- the only way it clicks is seeing a wrong/right
 * pair side by side. Deliberately different pairs from the ones already
 * covered in lib/grammar.ts's "mix-ups" theme (會/能/可以, 想/要, 二/兩,
 * etc.) rather than repeating them.
 *
 * Every explanation and example sentence here is written from scratch, the
 * same policy as lib/grammar.ts -- no textbook material is reproduced.
 */

export type WordFightExample = {
  wrong: string;
  wrongPinyin: string;
  right: string;
  rightPinyin: string;
  why: string;
};

export type WordFight = {
  id: string;
  words: string;
  title: string;
  instinct: string;
  rule: string;
  examples: WordFightExample[];
};

export const WORD_FIGHTS: WordFight[] = [
  {
    id: 'jiu-cai',
    words: '就 vs 才',
    title: 'Earlier than expected vs. later than expected',
    instinct:
      'English uses "then" or nothing at all for both, so learners reach for whichever one they saw most recently.',
    rule:
      '就 marks something happening sooner, easier, or more smoothly than expected. 才 marks something happening later, with more effort, or more reluctantly than expected. Same event, opposite implied attitude.',
    examples: [
      {
        wrong: '他六歲才上學，很聰明。',
        wrongPinyin: 'Tā liù suì cái shàngxué, hěn cōngmíng.',
        right: '他六歲就上學了，很聰明。',
        rightPinyin: 'Tā liù suì jiù shàngxué le, hěn cōngmíng.',
        why: 'Starting school at six is impressively early -- 就 marks "sooner than expected." 才 would imply he started late, which contradicts "very smart."',
      },
      {
        wrong: '我等了三個小時，你就來了！',
        wrongPinyin: 'Wǒ děngle sān ge xiǎoshí, nǐ jiù lái le!',
        right: '我等了三個小時，你才來了！',
        rightPinyin: 'Wǒ děngle sān ge xiǎoshí, nǐ cái lái le!',
        why: 'A three-hour wait is a complaint about lateness, so 才 ("finally, later than it should have been") fits -- 就 would sound like the wait was short.',
      },
    ],
  },
  {
    id: 'hai-zai',
    words: '還 vs 再',
    title: 'An unchanged state vs. a future repeat',
    instinct: 'Both get translated as "again," so learners swap them freely.',
    rule:
      '還 describes something still true right now -- a state that hasn\'t changed. 再 describes doing something one more time, and points at the future.',
    examples: [
      {
        wrong: '他再是學生。',
        wrongPinyin: 'Tā zài shì xuéshēng.',
        right: '他還是學生。',
        rightPinyin: 'Tā hái shì xuéshēng.',
        why: '"He is still a student" describes an unchanged state -- that\'s 還, not 再, which would mean he became a student again.',
      },
      {
        wrong: '明天我還去。',
        wrongPinyin: 'Míngtiān wǒ hái qù.',
        right: '明天我再去。',
        rightPinyin: 'Míngtiān wǒ zài qù.',
        why: 'A future repeated visit is a new instance of the action, not a continuing state -- that calls for 再.',
      },
    ],
  },
  {
    id: 'de-de-di',
    words: '的 vs 得 vs 地',
    title: 'Three particles, one pronunciation (de)',
    instinct:
      'All three sound identical, so a learner typing pinyin has to actively choose the right character every time -- and usually just picks 的 out of habit.',
    rule:
      '的 sits before a noun to mark possession or description ("my ___," "red ___"). 得 sits after a verb or adjective to introduce how well/how much something happens. 地 sits before a verb to turn the word in front of it into an adverb describing how the action is done.',
    examples: [
      {
        wrong: '他跑的很快。',
        wrongPinyin: 'Tā pǎo de hěn kuài.',
        right: '他跑得很快。',
        rightPinyin: 'Tā pǎo de hěn kuài.',
        why: '"Runs very fast" is a degree complement describing the running itself, placed after the verb -- that\'s 得, not 的.',
      },
      {
        wrong: '他慢慢的走進教室。',
        wrongPinyin: 'Tā mànmàn de zǒujìn jiàoshì.',
        right: '他慢慢地走進教室。',
        rightPinyin: 'Tā mànmàn de zǒujìn jiàoshì.',
        why: '"Slowly" describes how he walks and sits before the verb -- an adverb built with 地, not the possessive 的.',
      },
    ],
  },
  {
    id: 'weile-yinwei',
    words: '為了 vs 因為',
    title: 'A goal you\'re aiming at vs. a reason that already happened',
    instinct: 'Both get glossed as "because," so learners reach for 因為 for everything, including goals.',
    rule:
      '為了 introduces a goal or purpose -- something you\'re doing this FOR, usually still in the future. 因為 introduces a cause -- something that already made an effect happen.',
    examples: [
      {
        wrong: '因為學好中文，他每天練習寫字。',
        wrongPinyin: 'Yīnwèi xuéhǎo Zhōngwén, tā měitiān liànxí xiězì.',
        right: '為了學好中文，他每天練習寫字。',
        rightPinyin: 'Wèile xuéhǎo Zhōngwén, tā měitiān liànxí xiězì.',
        why: '"Mastering Chinese" is the goal he\'s working toward, not a cause that already happened -- that\'s 為了, not 因為.',
      },
      {
        wrong: '為了下雨，我們沒去公園。',
        wrongPinyin: 'Wèile xiàyǔ, wǒmen méi qù gōngyuán.',
        right: '因為下雨，我們沒去公園。',
        rightPinyin: 'Yīnwèi xiàyǔ, wǒmen méi qù gōngyuán.',
        why: 'The rain already happened and caused them to skip the park -- a completed cause, which is 因為, not the forward-looking 為了.',
      },
    ],
  },
];
