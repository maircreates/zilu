# Traditional Chinese Policy

## Policy statement

Traditional Chinese is the canonical stored and learner-facing Chinese representation in ZiLu. ZiLu does not provide a character-set toggle and does not present another character set as the default or primary form.

This policy covers lessons, titles, navigation, vocabulary, dialogues, grammar examples, instructions, feedback, exercises, review, search, generated content, transcripts, notes supplied by ZiLu, and future mobile or AI experiences.

## Beginner promise

ZiLu assumes that a new learner may know no Chinese at all. Traditional characters remain primary, but beginners receive optional and independently controlled support:

- tone-marked pinyin;
- clear English meaning;
- audio and mouth-position guidance when available;
- character-component and stroke guidance;
- gradual removal of support as recognition improves.

The beginner experience must explain what pinyin, tones, characters, words, and sentence patterns are before expecting the learner to use them. Pinyin is scaffolding, not a replacement writing system or a permanent dependency.

## Canonical data requirements

Each learner-facing Chinese item should eventually store, at minimum:

- an approved Traditional Chinese form;
- tone-marked pinyin;
- a machine-friendly tone representation where useful;
- an English gloss appropriate to the lesson context;
- part of speech or grammatical role when relevant;
- source and review provenance;
- pronunciation or regional-use notes where necessary;
- quality-control status.

The approved Traditional form is the content identifier's canonical written value. Search aliases may exist internally, but they must not change the learner-facing canonical form.

## Normalization workflow

1. Preserve the original source PDF unchanged.
2. Extract only the curriculum facts needed for an original ZiLu item.
3. Identify the source character format and context.
4. Convert into contextually correct Traditional Chinese in a new structured record.
5. Preserve meaning, grammatical function, pinyin, tones, and lesson relationship.
6. Check the result against a reputable Traditional Chinese dictionary and style authority.
7. Have a qualified human reviewer approve ambiguous lexical, regional, or grammatical cases.
8. Record the reviewer, decision, and source provenance.
9. Publish only the approved Traditional form to learner-facing surfaces.

## Contextual accuracy

Automatic conversion is a first-pass aid only. Character conversion can be context-dependent, and a mechanically converted string may preserve glyph shape while producing the wrong word, register, or regional convention.

Quality review must consider:

- the meaning of the whole word, not isolated characters;
- grammatical role in the sentence;
- Taiwan and broader Traditional-Chinese usage differences;
- personal and place names;
- measure words and classifiers;
- idioms and fixed expressions;
- variant characters and dictionary-preferred forms;
- typography and punctuation;
- consistency across vocabulary, dialogue, audio, and assessment records.

## Pinyin and tone preservation

- Tone-marked pinyin is the preferred learner display.
- Neutral tone must be represented consistently.
- Tone changes in connected speech should be taught explicitly without corrupting the lexical citation form.
- Multi-pronunciation characters require word-level pronunciation records rather than a single character-level guess.
- Audio, pinyin, and Traditional text must be checked together.
- Search may accept unmarked pinyin, but teaching displays should retain tone information.

## Meaning and grammar preservation

Normalization must not silently change:

- vocabulary meaning;
- register or politeness;
- part of speech;
- transitivity or complement behavior;
- grammar-point scope;
- sentence intent;
- lesson order or prerequisite relationship.

If a source example cannot be normalized confidently, it must remain unpublished until reviewed. ZiLu should author a new example rather than reproduce or lightly transform a copyrighted source sentence.

## Quality-control gates

### Automated checks

- Require a non-empty canonical Traditional field for every learner-facing Chinese record.
- Detect disallowed character forms and mixed character sets.
- Verify pinyin syllable and tone formatting.
- Detect mismatches between referenced vocabulary and lesson records.
- Flag duplicate canonical entries with conflicting readings or meanings.
- Validate locale-aware punctuation and spacing.

### Human checks

- Native or professionally qualified Traditional Chinese review.
- Context review at the sentence and activity level.
- Pronunciation review against audio.
- Pedagogical review for beginner clarity.
- Copyright review to ensure examples and activities are original.

## Documentation rule

Learner-facing documentation must not use non-Traditional Chinese examples unless the project owner explicitly requests a narrowly defined educational comparison. Internal provenance records may retain source-form metadata, but that data must not leak into normal learner-facing displays.

## Future-volume handling

- Volume 2: use the available Traditional-character textbook as a structural reference; author original ZiLu content and review every item.
- Volume 3: the combined source requires selecting and validating the Traditional form before any learner-facing use.
- Volume 4: the available combined workbook presents another form first, so all future structured records require explicit Traditional-first normalization and review.
- Volume 1: the available source is identified as a non-Traditional edition; it must receive the strictest normalization and human-review workflow when that phase begins.

## Approval standard

No learner-facing Chinese item is ready merely because it passed automated conversion. Publication requires contextual correctness, pedagogical clarity for a zero-knowledge learner, and copyright-conscious original presentation.

