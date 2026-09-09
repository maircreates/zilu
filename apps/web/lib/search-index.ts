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
  /** Meaning for a card; "Grammar" for grammar. */
  tertiary: string;
  /** Where it lives, e.g. "Pathway 01 · Greetings · Deck A". */
  location: string;
  /** Link that opens it: a deep link into /study, or /grammar#point-id. */
  href: string;
  /** Lowercased hanzi to match a Chinese query against. */
  han: string;
  /** Tone-stripped, space-free pinyin ("nihao"). */
  pinyin: string;
  /** Tone-stripped pinyin with syllable spacing kept ("ni hao"). */
  pinyinSpaced: string;
  /** Lowercased English text for word queries (the meaning, or a grammar blob). */
  text: string;
};

/** Which slice of which display field the query matched, for highlighting. */
export type SearchMatch = {
  primary?: string;
  secondary?: string;
  tertiary?: string;
};

export type SearchResult = SearchHit & { match: SearchMatch };

const COMBINING = /[̀-ͯ]/g;

/** "chàng gē(r)" -> "chang ger"; keeps syllable spaces, drops tones and punctuation. */
function tonelessSpaced(value: string): string {
  return value
    .normalize('NFD')
    .replace(COMBINING, '')
    .toLowerCase()
    .replace(/[^a-z ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "nǐ hǎo" / "ni3 hao3" / "Nǐhǎo!" all collapse to "nihao". */
export function collapsePinyin(value: string): string {
  return tonelessSpaced(value).replace(/ /g, '');
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
          const spaced = tonelessSpaced(card.pinyin);
          hits.push({
            kind: 'vocab',
            primary: card.hanzi,
            secondary: card.pinyin,
            tertiary: card.meaning,
            location: `${pathwayLabel} · ${waypoint.name} · ${deck.name}`,
            href: `/study?pi=${pathwayIndex}&wi=${waypointIndex}&di=${deckIndex}&ci=${cardIndex}`,
            han: card.hanzi.toLowerCase(),
            pinyin: spaced.replace(/ /g, ''),
            pinyinSpaced: spaced,
            text: card.meaning.toLowerCase(),
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
        pinyinSpaced: '',
        text: `${point.title} ${point.template} ${point.why} ${exampleText}`.toLowerCase(),
      });
    });
  });

  return hits;
}

const SEARCH_INDEX = buildIndex();

type Scored = { score: number; mark?: string };

/**
 * Rank a romanised query against one entry's pinyin. An exact syllable beats a
 * partial one: "cha" scores 茶 (chá) far above 唱 (chàng).
 */
function scorePinyin(hit: SearchHit, query: string): Scored {
  if (!query || !hit.pinyin) return { score: 0 };
  if (query === hit.pinyin)
    return { score: 100, mark: hit.secondary || undefined };

  const displaySylls = hit.secondary ? hit.secondary.split(/\s+/) : [];
  const toneless = hit.pinyinSpaced ? hit.pinyinSpaced.split(' ') : [];

  const exact = toneless.indexOf(query);
  if (exact >= 0) return { score: 86, mark: displaySylls[exact] };

  if (toneless[0]?.startsWith(query)) {
    return { score: 66, mark: displaySylls[0] };
  }
  const later = toneless.findIndex((syllable) => syllable.startsWith(query));
  if (later > 0) return { score: 50, mark: displaySylls[later] };

  if (hit.pinyin.includes(query)) return { score: 34 };
  return { score: 0 };
}

/**
 * Rank an English query against one entry. A whole word beats a word-start
 * beats a mid-word substring: "no" scores 不 ("not; no") above "noon".
 */
function scoreEnglish(hit: SearchHit, query: string): Scored {
  const markSlice = (): string | undefined => {
    const idx = hit.text.indexOf(query);
    if (hit.kind === 'vocab') {
      return idx >= 0 ? hit.tertiary.slice(idx, idx + query.length) : undefined;
    }
    const titleIdx = hit.primary.toLowerCase().indexOf(query);
    return titleIdx >= 0
      ? hit.primary.slice(titleIdx, titleIdx + query.length)
      : undefined;
  };

  const words = hit.text.split(/[^a-z]+/).filter(Boolean);
  if (words.includes(query)) return { score: 92, mark: markSlice() };
  if (words.some((word) => word.startsWith(query))) {
    return { score: 58, mark: markSlice() };
  }
  if (query.length >= 5) {
    // Loose stem match so "compare" also finds "comparing" / "comparison".
    const stem = query.slice(0, query.length - 2);
    if (words.some((word) => word.startsWith(stem))) {
      return { score: 46, mark: markSlice() };
    }
  }
  if (hit.text.includes(query)) return { score: 28, mark: markSlice() };
  return { score: 0 };
}

/** Returns up to `limit` hits, best matches first. Empty for a too-short query. */
export function searchEntries(rawQuery: string, limit = 40): SearchResult[] {
  const query = rawQuery.trim();
  const han = queryIsHan(query);
  const minLength = han ? 1 : 2;
  if (query.length < minLength) return [];

  const lower = query.toLowerCase();
  const pinyinNeedle = collapsePinyin(query);

  const ranked: { result: SearchResult; score: number }[] = [];

  for (const hit of SEARCH_INDEX) {
    let score = 0;
    let match: SearchMatch = {};

    if (han) {
      const at = hit.han.indexOf(lower);
      if (hit.kind === 'vocab' && hit.han === lower) {
        score = 110;
        match = { primary: hit.primary };
      } else if (at === 0) {
        score = 96;
        if (hit.kind === 'vocab')
          match = { primary: hit.primary.slice(0, lower.length) };
      } else if (at > 0) {
        score = 60;
        if (hit.kind === 'vocab') {
          match = { primary: hit.primary.slice(at, at + lower.length) };
        }
      } else if (lower.length > 1) {
        // A phrase like 你好 is often taught as separate words; credit each
        // character that turns up somewhere.
        let parts = 0;
        for (const ch of lower) {
          if (ch.trim() && hit.han.includes(ch)) parts += 1;
        }
        if (parts > 0) score = 16 + parts * 3;
      }
    } else {
      const pinyin = scorePinyin(hit, pinyinNeedle);
      const english = scoreEnglish(hit, lower);
      if (pinyin.score >= english.score && pinyin.score > 0) {
        score = pinyin.score;
        if (pinyin.mark) match = { secondary: pinyin.mark };
      } else if (english.score > 0) {
        score = english.score;
        if (english.mark) {
          match =
            hit.kind === 'grammar'
              ? { primary: english.mark }
              : { tertiary: english.mark };
        }
      }
    }

    if (score === 0) continue;
    if (hit.kind === 'vocab') score += 4;
    score -= Math.min(hit.primary.length, 12) * 0.1;
    ranked.push({ result: { ...hit, match }, score });
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit).map((entry) => entry.result);
}
