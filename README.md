# ZiLu

ZiLu is a beginner-first Mandarin learning experience for people starting with zero Chinese knowledge. The web app combines an original fundamentals bridge, grammar reference, four vocabulary pathways, guided study, focused drills, and a browser-local Current Class area.

## Project principles

- Volumes 1–4 are represented as vocabulary pathways. Full lesson development follows the separately documented source and review boundaries.
- All learner-facing Chinese must use Traditional Chinese.
- The foundation path assumes zero prior knowledge of Chinese.
- Copyrighted reference books remain local and are never committed or distributed through this repository.

## Run the web app

From `apps/web`:

```text
pnpm install
pnpm dev
```

Major areas include:

- **Fundamentals (`/fundamentals`)** — thirteen original beginner orientation pages.
- **Grammar (`/grammar`)** — nine practical grammar themes with examples and pronunciation.
- **Study (`/study`)** — four flashcard pathways organized as Pathway → Waypoint → Deck → Flashcard.
- **Current Class (`/classroom`)** — personal class packs layered over canonical curriculum content. The first pack is Chinese Class / 中文課, with three CH201 topic units, Quick Review, per-skill progress, and a mistake queue.
- **字力房 (`/zili-fang`)** — experimental focused drills.
- **Settings (`/settings`)** — theme, appearance, and interface preferences.

### Guided study

Every Deck also offers a guided study loop (`/study?guided=1` opens it directly): a short beginner introduction, one card at a time, flip to check, then mark **Still learning** or **Got it**. Cards marked *Still learning* return later; the session ends once every card is *Got it*, and progress is saved in the browser. The learner's Pinyinciation preference carries across the whole app.

## Current scope

Accounts, cloud progress, validated pronunciation scoring, and automatic synchronization with private class sources remain out of scope. Progress is stored in the current browser.

See [`docs/current-class.md`](docs/current-class.md) for the Current Class implementation and storage behavior.
