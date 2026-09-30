# Current Class / 我的課

Current Class is a personal study-pack overlay on ZiLu's canonical curriculum. It does not duplicate Pathway 03 vocabulary and does not connect to a private ChatGPT project. Bundled content is reviewed material supplied explicitly for this release.

## Routes

- `/classroom` — available class packs.
- `/classroom/ch201` — Chinese Class hub, recent supplied material, units, collections, Quick Review, and progress.
- `/classroom/ch201/units/[unitId]` — unit overview and working guided, flashcard, sentence-order, speaking, and quiz modes.
- `/classroom/ch201/review` — 5-, 10-, or 20-minute deterministic review selection with optional unit or collection filters.
- `/classroom/ch201/characters` — the supplied 30-character study collection with recognition and existing Hanzi Writer practice.
- `/classroom/ch201/mistakes` — objective errors and self-assessed weak responses shown separately.

## Included content

The first pack uses the stable ID `ch201` and the display title Chinese Class / 中文課. It contains:

- 開學, 宿舍生活, and 在飯館兒 topic units;
- Weeks 1–3 collections with 15 unique canonical Pathway 03 words;
- eight speaking prompts with model responses;
- eight short grammar patterns;
- vocabulary meaning checks, accessible tap/keyboard sentence ordering, and speaking recall;
- 30 Useful Characters / 三十個常用字, explicitly presented as a supplied study order rather than a verified frequency ranking.

## Progress and review

Progress is stored in `localStorage` under `zilu.studyPacks.v1`. The schema is versioned independently from the CH201 content version. Progress is keyed by stable item identity plus skill, so one word appearing in multiple collections shares progress.

Objective results (`correct` and `incorrect`) remain separate from speaking and flashcard self-assessments (`independent`, `assisted`, and `again`). Quick Review prioritizes weak items, due items, unpracticed items, then other practiced material. Attempt history is bounded to 240 entries.

Malformed or unsupported stored data falls back safely. If browser storage is blocked, activities continue in memory and the hub displays a persistence warning. Reset affects only Current Class data; it does not remove pathway progress or appearance settings.

## Content and pronunciation boundaries

Traditional Chinese is canonical. Vocabulary spelling, pinyin, meaning, and source position resolve from the existing Pathway 03 records. Sentence examples preserve the supplied convention, which sometimes displays spoken tone sandhi for 一 and 不; canonical vocabulary retains the app's lexical pinyin. Browser `zh-TW` speech synthesis remains a temporary pronunciation aid, not reviewed audio or pronunciation scoring.

No private journals, exact dorm identifiers, schedules, recordings, microphone access, analytics answers, or external AI calls are included.

## Deferred work

- Full verification against the reported `FullText.md`, `FullWork.md`, and printed workbook sources when lawful local copies are available.
- Richer listening sessions and reviewed audio.
- Private editable examples and validated pack import/export.
- Smarter scheduling beyond the first deterministic review policy.
- Cross-area search and 字力房 subset adapters.
