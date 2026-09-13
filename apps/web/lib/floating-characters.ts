import { pathways, type Flashcard } from './pathways';

const HAN = /\p{Script=Han}/u;

/** A flashcard plus which pathway (1, 2, or 3) first teaches it -- lets the
 * homepage's floating-characters background tint a character by where it
 * comes from. */
export type SourcedCard = Flashcard & { pathway: number };

function hanCharsOf(hanzi: string): string[] {
  // oxlint-disable-next-line typescript/no-misused-spread -- ZiLu's Traditional characters here are single code points, no combining marks
  return [...hanzi].filter((ch) => HAN.test(ch));
}

function allCards(): SourcedCard[] {
  const cards: SourcedCard[] = [];
  for (const pathway of pathways) {
    for (const waypoint of pathway.waypoints) {
      for (const deck of waypoint.decks) {
        for (const card of deck.cards) {
          cards.push({ ...card, pathway: pathway.number });
        }
      }
    }
  }
  return cards;
}

/** Every distinct flashcard whose hanzi is exactly one Han character, keyed
 * by that character. These have their own real pinyin and meaning, and are
 * the only characters eligible for the drag-to-combine mode below. */
export const SINGLE_CHARACTERS: SourcedCard[] = (() => {
  const seen = new Map<string, SourcedCard>();
  for (const card of allCards()) {
    if (hanCharsOf(card.hanzi).length !== 1) continue;
    if (!seen.has(card.hanzi)) seen.set(card.hanzi, card);
  }
  return [...seen.values()];
})();

/** Every distinct Han character taught anywhere in the pathways -- not just
 * the ones with their own standalone card. A character that only ever
 * appears inside multi-character words (e.g. 洲 in 亞洲) is given a derived
 * reading: its own syllable, sliced out of the first word that teaches it,
 * plus that word for context. Skipped (not just wrong) when a word's pinyin
 * doesn't split cleanly into one token per character. Source of truth for
 * the homepage's floating-characters background -- no hand-picked list. */
export const ALL_CHARACTERS: SourcedCard[] = (() => {
  const byChar = new Map<string, SourcedCard>(
    SINGLE_CHARACTERS.map((card) => [card.hanzi, card]),
  );
  for (const card of allCards()) {
    const chars = hanCharsOf(card.hanzi);
    if (chars.length < 2) continue;
    const tokens = card.pinyin.trim().split(/\s+/);
    if (tokens.length !== chars.length) continue;
    chars.forEach((ch, index) => {
      if (byChar.has(ch)) return;
      byChar.set(ch, {
        hanzi: ch,
        pinyin: tokens[index],
        meaning: `in ${card.hanzi}, ${card.meaning}`,
        pathway: card.pathway,
      });
    });
  }
  return [...byChar.values()];
})();

/** "charA|charB" (sorted so order does not matter) -> the real two-character
 * word they form, for every vocabulary word whose two halves both also exist
 * as standalone single-character cards above. Lets the floating background's
 * drag-to-combine mode work without a hand-curated pairing list. */
export const WORD_COMBOS: Map<string, SourcedCard> = (() => {
  const singles = new Set(SINGLE_CHARACTERS.map((c) => c.hanzi));
  const combos = new Map<string, SourcedCard>();
  for (const card of allCards()) {
    const chars = hanCharsOf(card.hanzi);
    if (chars.length !== 2 || chars[0] === chars[1]) continue;
    const [a, b] = chars;
    if (!singles.has(a) || !singles.has(b)) continue;
    const key = [a, b].sort().join('|');
    if (!combos.has(key)) combos.set(key, card);
  }
  return combos;
})();

export function findCombo(
  charA: string,
  charB: string,
): SourcedCard | undefined {
  if (charA === charB) return undefined;
  return WORD_COMBOS.get([charA, charB].sort().join('|'));
}

/** Every valid combo as its two individual characters plus the word they
 * form, for picking a random one (e.g. the homepage's idle easter egg)
 * without re-deriving characters from a sorted key. */
export const WORD_COMBO_LIST: {
  a: SourcedCard;
  b: SourcedCard;
  word: SourcedCard;
}[] = (() => {
  const byChar = new Map(SINGLE_CHARACTERS.map((c) => [c.hanzi, c]));
  const list: { a: SourcedCard; b: SourcedCard; word: SourcedCard }[] = [];
  for (const [key, word] of WORD_COMBOS) {
    const [charA, charB] = key.split('|');
    const a = byChar.get(charA);
    const b = byChar.get(charB);
    if (a && b) list.push({ a, b, word });
  }
  return list;
})();
