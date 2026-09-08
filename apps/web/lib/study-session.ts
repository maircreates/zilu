import { pathways, type Flashcard } from './pathways';

/**
 * Guided study started as a single-deck pilot and is now available on every
 * deck in `pathways`. The intro is
 * generated from each deck's own topic and size rather than hand-authored per
 * deck, so adding a new Pathway, Waypoint, or Deck to `pathways.ts` picks up
 * guided study automatically -- no changes needed here.
 */
export type GuidedStudyDeck = {
  key: string;
  pathwayLabel: string;
  waypointLabel: string;
  deckLabel: string;
  topic: string;
  topicChinese: string;
  intro: string[];
  cards: Flashcard[];
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function buildIntro(
  waypointName: string,
  waypointChinese: string,
  deckLabel: string,
  cardCount: number,
): string[] {
  const wordCount = `${cardCount} word${cardCount === 1 ? '' : 's'}`;
  return [
    `This is ${deckLabel} of the "${waypointName}" Waypoint (${waypointChinese}).`,
    `You will meet ${wordCount} one card at a time, always written in Traditional Chinese.`,
    'Look at a card and say it to yourself, then flip it to check the meaning and pinyin.',
    'Choose "Still learning" to meet a word again soon, or "Got it" once you know it.',
    'The session ends when every card is marked "Got it". Progress is saved on this device, and your Pinyinciation choice carries over from the deck browser.',
  ];
}

/**
 * Returns the guided-study payload for a deck position, or `undefined` when
 * that position does not resolve to a real deck. Vocabulary is read straight
 * from `pathways`, so the Traditional Chinese content stays single-sourced.
 */
export function findGuidedStudyDeck(
  pathwayNumber: number,
  waypointNumber: number,
  deckId: 'a' | 'b',
): GuidedStudyDeck | undefined {
  const pathway = pathways.find((item) => item.number === pathwayNumber);
  const waypoint = pathway?.waypoints.find(
    (item) => item.number === waypointNumber,
  );
  const deck = waypoint?.decks.find((item) => item.id === deckId);
  if (!pathway || !waypoint || !deck || deck.cards.length === 0) {
    return undefined;
  }

  return {
    key: `${pathwayNumber}-${waypointNumber}-${deckId}`,
    pathwayLabel: `Pathway ${pad(pathway.number)}`,
    waypointLabel: `Waypoint ${pad(waypoint.number)}`,
    deckLabel: deck.name,
    topic: waypoint.name,
    topicChinese: waypoint.chinese,
    intro: buildIntro(
      waypoint.name,
      waypoint.chinese,
      deck.name,
      deck.cards.length,
    ),
    cards: deck.cards,
  };
}
