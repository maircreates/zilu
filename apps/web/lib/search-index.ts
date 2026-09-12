import {
  MEASURE_WORDS,
  NUMBER_BUILD,
  NUMBERS,
  PARTICLES,
  PRONOUNS,
  RADICALS,
  SECTIONS,
  SURVIVAL_PHRASES,
  TIME_WORDS,
  TONES,
} from './fundamentals';
import { GRAMMAR_THEMES } from './grammar';
import { pathways } from './pathways';

/**
 * A flat, prebuilt index of everything the search palette can find: every
 * flashcard across all pathways, every grammar point, and the glossary items
 * and sections on the Fundamentals page. Built once at module load from the
 * static data, so lookups are just array filtering.
 */

export type SearchHit = {
  kind: 'vocab' | 'grammar' | 'fundamentals';
  /** Main line: the hanzi for a card, the title for grammar/fundamentals. */
  primary: string;
  /** Pinyin, when the entry is a single word. */
  secondary: string;
  /** Meaning for a word; "Grammar" for grammar. */
  tertiary: string;
  /** Where it lives, e.g. "Pathway 01 · Greetings · Deck A". */
  location: string;
  /** Link that opens it. */
  href: string;
  /** True when `primary` itself is Chinese text (so it can be sliced for a
   * highlight, and an exact match against it is a strong signal). */
  primaryIsHanzi: boolean;
  /** Lowercased hanzi to match a Chinese query against. */
  han: string;
  /** Tone-stripped, space-free pinyin ("nihao"). */
  pinyin: string;
  /** Tone-stripped pinyin with syllable spacing kept ("ni hao"). */
  pinyinSpaced: string;
  /** Lowercased English text for word queries (the meaning, or a blob). */
  text: string;
  /** Grammar only: the pattern template, shown in the inline preview. */
  template?: string;
  /** Grammar only: the one-line explanation. */
  why?: string;
  /** Grammar only: one representative example. */
  example?: { hanzi: string; pinyin: string; english: string };
  /** Fundamentals section entries only: a one-line description. */
  note?: string;
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

type WordLike = { hanzi: string; pinyin: string; meaning: string };

function wordHit(
  item: WordLike,
  location: string,
  href: string,
  extraText = '',
): SearchHit {
  const spaced = tonelessSpaced(item.pinyin);
  return {
    kind: 'fundamentals',
    primary: item.hanzi,
    secondary: item.pinyin,
    tertiary: item.meaning,
    location,
    href,
    primaryIsHanzi: true,
    han: item.hanzi.toLowerCase(),
    pinyin: spaced.replace(/ /g, ''),
    pinyinSpaced: spaced,
    text: `${item.meaning} ${extraText}`.toLowerCase().trim(),
  };
}

/** Hand-written keywords for the sections that are prose rather than a word
 * list, so the topic itself is findable even with no glossary item to match. */
const SECTION_KEYWORDS: Record<string, string> = {
  orientation:
    'what chinese means mandarin traditional simplified characters taiwan hong kong macau card',
  characters:
    'how characters work syllable meaning components radical panda cat bear woman no spaces between words',
  radicals:
    'radicals recurring pieces components person mouth heart hand door grass food',
  pinyin: 'pinyin sound system initial final tone spelling alphabet',
  tones:
    'tones tone marks four tones neutral tone pitch tone sandhi third tone',
  sounds:
    'sounds pronunciation aspirated unaspirated tongue curled retroflex j q x zh ch sh r c z b d g u umlaut n ng',
  pronouns: 'pronouns people words i you he she we they plural',
  sentences:
    'sentence structure grammar subject verb object word order time word placement',
  particles:
    'particles little words possessive completed action question suggestion',
  'measure-words': 'measure words counting classifier number noun',
  numbers:
    'numbers dates time zero to ten hundred year month day weekday clock hour half past',
  phrases:
    'survival phrases hello thank you sorry excuse me goodbye greeting apology',
  study: 'how to study tips habits guided loop audio practice pinyinciation',
};

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
            primaryIsHanzi: true,
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
      // Keep pure pinyin separate from the template/why prose: a template
      // like "幾 + measure word + noun" has English scaffolding words that
      // would otherwise leak into pinyin matching (e.g. "noun" looking like
      // a syllable string) and outrank real vocabulary.
      const examplePinyin = point.examples
        .map((example) => example.pinyin)
        .join(' ');
      const exampleEnglish = point.examples
        .map((example) => example.english)
        .join(' ');
      const first = point.examples[0];
      const spaced = tonelessSpaced(examplePinyin);
      hits.push({
        kind: 'grammar',
        primary: point.title,
        secondary: '',
        tertiary: 'Grammar',
        location: `${theme.num} · ${theme.title}`,
        href: `/grammar/${theme.id}#point-${point.id}`,
        primaryIsHanzi: false,
        han: `${point.title} ${point.template} ${exampleHan}`.toLowerCase(),
        pinyin: spaced.replace(/ /g, ''),
        pinyinSpaced: spaced,
        text: `${point.title} ${point.template} ${point.why} ${examplePinyin} ${exampleEnglish}`.toLowerCase(),
        template: point.template,
        why: point.why,
        example: first
          ? { hanzi: first.hanzi, pinyin: first.pinyin, english: first.english }
          : undefined,
      });
    });
  });

  // Fundamentals: the topic sections themselves, findable by keyword even
  // when there is no single glossary item to match.
  SECTIONS.forEach((section) => {
    hits.push({
      kind: 'fundamentals',
      primary: section.title,
      secondary: '',
      tertiary: 'Fundamentals',
      location: `${section.num} · Fundamentals`,
      href: `/fundamentals/${section.id}`,
      primaryIsHanzi: false,
      han: '',
      pinyin: '',
      pinyinSpaced: '',
      text: `${section.title} ${SECTION_KEYWORDS[section.id] ?? ''}`.toLowerCase(),
      note: section.teaser,
    });
  });

  // Fundamentals: the individual glossary-style items (pronouns, numbers,
  // measure words, particles, survival phrases) behave just like vocabulary.
  TONES.forEach((tone) => {
    hits.push(
      wordHit(
        { hanzi: tone.hanzi, pinyin: tone.pinyin, meaning: tone.meaning },
        '05 · The tones',
        '/fundamentals/tones',
      ),
    );
  });
  RADICALS.forEach((radical) => {
    hits.push(
      wordHit(
        {
          hanzi: radical.hanzi,
          pinyin: radical.pinyin,
          meaning: radical.meaning,
        },
        '03 · Radicals',
        '/fundamentals/radicals',
        radical.asComponent ? `also written ${radical.asComponent}` : '',
      ),
    );
  });
  PRONOUNS.forEach((item) => {
    hits.push(wordHit(item, '07 · People words', '/fundamentals/pronouns'));
  });
  MEASURE_WORDS.forEach((item) => {
    hits.push(
      wordHit(
        { hanzi: item.hanzi, pinyin: item.pinyin, meaning: item.use },
        '10 · Measure words',
        '/fundamentals/measure-words',
      ),
    );
  });
  NUMBERS.forEach((item) => {
    hits.push(
      wordHit(item, '11 · Numbers, dates, and time', '/fundamentals/numbers'),
    );
  });
  NUMBER_BUILD.forEach((item) => {
    hits.push(
      wordHit(item, '11 · Numbers, dates, and time', '/fundamentals/numbers'),
    );
  });
  TIME_WORDS.forEach((item) => {
    hits.push(
      wordHit(item, '11 · Numbers, dates, and time', '/fundamentals/numbers'),
    );
  });
  SURVIVAL_PHRASES.forEach((item) => {
    hits.push(
      wordHit(
        item,
        '12 · Survival phrases',
        '/fundamentals/phrases',
        item.situation,
      ),
    );
  });
  PARTICLES.forEach((item) => {
    hits.push(
      wordHit(
        { hanzi: item.hanzi, pinyin: item.pinyin, meaning: item.role },
        '09 · Little words that do a lot',
        '/fundamentals/particles',
      ),
    );
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
    if (idx < 0) return undefined;
    if (hit.kind === 'grammar') {
      const titleIdx = hit.primary.toLowerCase().indexOf(query);
      return titleIdx >= 0
        ? hit.primary.slice(titleIdx, titleIdx + query.length)
        : undefined;
    }
    // Only mark when the match falls inside the part of `text` that is
    // actually shown as `tertiary` (extra context appended after it is not).
    return idx + query.length <= hit.tertiary.length
      ? hit.tertiary.slice(idx, idx + query.length)
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

const KIND_BONUS: Record<SearchHit['kind'], number> = {
  vocab: 4,
  fundamentals: 2,
  grammar: 0,
};

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
      if (hit.primaryIsHanzi && hit.han === lower) {
        score = 110;
        match = { primary: hit.primary };
      } else if (at === 0) {
        score = 96;
        if (hit.primaryIsHanzi)
          match = { primary: hit.primary.slice(0, lower.length) };
      } else if (at > 0) {
        score = 60;
        if (hit.primaryIsHanzi) {
          match = { primary: hit.primary.slice(at, at + lower.length) };
        }
      } else if (lower.length > 1 && hit.han) {
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
    score += KIND_BONUS[hit.kind];
    score -= Math.min(hit.primary.length, 12) * 0.1;
    // Tie-breaker: a crisp gloss ("not; no") is likelier the word you meant
    // than one that merely mentions the query ("(yes/no question particle)").
    score -= Math.min(hit.tertiary.length, 60) * 0.03;
    ranked.push({ result: { ...hit, match }, score });
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit).map((entry) => entry.result);
}
