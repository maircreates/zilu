# ZiLu

ZiLu is a beginner-first Mandarin learning experience for people starting with zero Chinese knowledge. The web app pairs an original Start Here fundamentals bridge with flashcard pathways built from the Volume 2 and Volume 3 reference vocabulary.

## Project principles

- Volume 2 remains Pathway 02, and Volume 3 is Pathway 03.
- Volume 4 is deferred until its textbook source is available.
- All learner-facing Chinese must use Traditional Chinese.
- The foundation path assumes zero prior knowledge of Chinese.
- Copyrighted reference books remain local and are never committed or distributed through this repository.

## Run the web app

From `apps/web`:

```text
pnpm install
pnpm dev
```

The app has three pages:

- **Home (`/`)** — entry point linking to the fundamentals and the flashcard pathways.
- **Fundamentals (`/fundamentals`)** — an original Start Here bridge: how Traditional characters, pinyin, and tones fit together, the four tones plus the neutral tone, high-value pinyin sound contrasts, core sentence structures, numbers, and essential survival phrases, each with browser pronunciation.
- **Study (`/study`)** — the flashcard experience, organized as Pathway → Waypoint → Deck → Flashcard. Pathway 02 and Pathway 03 each include ten topic-based Waypoints and two vocabulary Decks per Waypoint. Learners can flip cards, move backward and forward, shuffle a Deck, hear browser-provided Traditional Chinese pronunciation, and use the Pinyinciation switch to move pinyin between the front and back of each card.

### Guided study

Every Deck also offers a guided study loop (`/study?guided=1` opens it directly): a short beginner introduction, one card at a time, flip to check, then mark **Still learning** or **Got it**. Cards marked *Still learning* return later; the session ends once every card is *Got it*, and progress is saved in the browser. The learner's Pinyinciation preference carries across the whole app.

## Current scope

The flashcard experience, the guided study loop, and the fundamentals bridge are in scope. Accounts, cloud progress, scoring, spaced-repetition scheduling, and additional activity types are intentionally deferred.
