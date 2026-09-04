# ZiLu

ZiLu is a beginner-first Mandarin learning experience for people starting with zero Chinese knowledge. The current web app focuses on the vocabulary from the Volume 2 reference textbook.

## Project principles

- Volume 2 is the first development priority.
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

The current study flow is organized as Pathway → Waypoint → Deck → Flashcard. It includes ten topic-based Waypoints and two vocabulary Decks per Waypoint. Learners can flip cards, move backward and forward, shuffle a Deck, hear browser-provided Traditional Chinese pronunciation, and use the Pinyinciation switch to move pinyin between the front and back of each card.

## Current scope

Only the flashcard experience is in scope right now. Additional learning activities, accounts, scoring, and progress systems are intentionally deferred.
