# ZiLu

ZiLu is a beginner-first Mandarin learning experience for people starting with zero Chinese knowledge. The interactive foundation lesson lives under `apps/web`.

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

The current lesson teaches the greeting `你好` through six stages: Meet, Listen, Notice, Practice, Recall, and Review. Pinyin and meaning support can be hidden, and listening practice currently uses the learner's browser-provided Traditional Chinese voice.

## Learning design

- [`docs/start-here-curriculum.md`](docs/start-here-curriculum.md) defines the complete ten-lesson Start Here pathway and its bridge into Volume 2.
- [`docs/lesson-system.md`](docs/lesson-system.md) defines the reusable lesson model, interaction rules, and content standards.
