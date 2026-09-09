import { GRAMMAR_THEMES } from './grammar';
import { pathways } from './pathways';

/**
 * A flat, prebuilt index of everything the search palette can find: every
 * flashcard across all pathways, plus every grammar point. Built once at module
 * load from the static data, so lookups are just array filtering.
 */

export type SearchHit = {
  kind: 'vocab' | 'grammar';
  /** Main line: the hanzi for a card, the point title for grammar. */
  primary: string;
  /** Pinyin for a card; empty for grammar. */
  secondary: string;
  /** Meaning for a card; the theme name for grammar. */
  tertiary: string;
  /** Where it lives, e.g. "Pathway 01 · Greetings · Deck A". */
  location: string;
  /** Link that opens it: a deep link into /study, or /grammar#point-id. */
  href: string;
  /** Lowercased hanzi text to match a Chinese query against. */
  han: string;
  /** Tone-stripped, punctuation-free pinyin to match a romanised query against. */
  pinyin: string;
  /** Lowercased English text (meaning, or title + explanation) for word queries. */
  english: string;
};

/** "nǐ hǎo" / "ni3 hao3" / "Nǐhǎo!" all collapse to "nihao". */
export function collapsePinyin(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

const HAN_CHAR = /\p{Script=Han}/u;

export function queryIsHan(query: string): boolean {
  return HAN_CHAR.test(query);
}

function buildIndex(): SearchHit[] {
  const hits: SearchHit[] = [];
  const seenVocab = new Set<string>();

  pathways.forEach((pathway, pathwayIndex) => {
    const pathwayLabel = `Pathway ${String(pathway.number).padStart(2, '0')}`;
    pathway.waypoints.forEach((waypoint, waypointIndex) => {
      waypoint.decks.forEach((deck, deckIndex) => {
        deck.cards.forEach((card, cardIndex) => {
          const dedupeKey = `${card.hanzi}|${card.pinyin}`;
          if (seenVocab.has(dedupeKey)) return;
          seenVocab.add(dedupeKey);
          hits.push({
            kind: 'vocab',
            primary: card.hanzi,
            secondary: card.pinyin,
            tertiary: card.meaning,
            location: `${pathwayLabel} · ${waypoint.name} · ${deck.name}`,
            href: `/study?pi=${pathwayIndex}&wi=${waypointIndex}&di=${deckIndex}&ci=${cardIndex}`,
            han: card.hanzi.toLowerCase(),
            pinyin: collapsePinyin(card.pinyin),
            english: card.meaning.toLowerCase(),
          });
        });
      });
    });
  });

  GRAMMAR_THEMES.forEach((theme) => {
    theme.points.forEach((point) => {
      const exampleHan = point.examples
        .map((example) => example.hanzi)
        .join(' ');
      const exampleText = point.examples
        .map((example) => `${example.pinyin} ${example.english}`)
        .join(' ');
      hits.push({
        kind: 'grammar',
        primary: point.title,
        secondary: '',
        tertiary: 'Grammar',
        location: `${theme.num} · ${theme.title}`,
        href: `/grammar#point-${point.id}`,
        han: `${point.title} ${point.template} ${exampleHan}`.toLowerCase(),
        pinyin: collapsePinyin(`${point.template} ${exampleText}`),
        english:
          `${point.title} ${point.template} ${point.why} ${exampleText}`.toLowerCase(),
      });
    });
  });

  return hits;
}

const SEARCH_INDEX = buildIndex();

export type RankedHit = SearchHit & { score: number };

/** Returns up to `limit` hits, best matches first. Empty for a too-short query. */
export function searchEntries(rawQuery: string, limit = 40): SearchHit[] {
  const query = rawQuery.trim();
  const han = queryIsHan(query);
  const minLength = han ? 1 : 2;
  if (query.length < minLength) return [];

  const needleHan = query.toLowerCase();
  const needlePinyin = collapsePinyin(query);
  const needleEnglish = query.toLowerCase();

  const ranked: RankedHit[] = [];

  for (const hit of SEARCH_INDEX) {
    let score = 0;

    if (han) {
      const at = hit.han.indexOf(needleHan);
      if (at === 0) score = 100;
      else if (at > 0) score = 60;
      else if (needleHan.length > 1) {
        // No full match. A phrase like 你好 is often taught as separate words,
        // so credit each character that turns up somewhere.
        let parts = 0;
        for (const ch of needleHan) {
          if (ch.trim() && hit.han.includes(ch)) parts += 1;
        }
        if (parts > 0) score = 18 + parts * 3;
      }
    } else {
      if (needlePinyin) {
        const at = hit.pinyin.indexOf(needlePinyin);
        if (at === 0) score = Math.max(score, 90);
        else if (at > 0) score = Math.max(score, 45);
      }
      const englishAt = hit.english.indexOf(needleEnglish);
      if (englishAt === 0) score = Math.max(score, 80);
      else if (englishAt > 0) score = Math.max(score, 40);
    }

    if (score === 0) continue;
    // Nudge vocabulary above grammar when scores tie, and shorter entries up.
    if (hit.kind === 'vocab') score += 5;
    score -= Math.min(hit.primary.length, 12) * 0.1;
    ranked.push({ ...hit, score });
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}
