# ZiLu Lesson System

## Goal

ZiLu lessons are data-driven so the same accessible interaction system can teach Start Here, Volume 2, and later material without rebuilding the interface for every lesson.

## Core model

Each lesson record contains:

- stable lesson ID and pathway position;
- title, short objective, and estimated duration;
- canonical Traditional Chinese language items;
- optional pinyin and English learning supports;
- six ordered learning stages;
- original prompts, answer choices, feedback, and explanations;
- completion rules and the identifier of the next lesson.

Stages use a discriminated `kind` field so the player can render the appropriate reusable activity:

- `meet`
- `listen`
- `notice`
- `choice`
- `recall`
- `review`

## Content rules

1. Traditional Chinese is the canonical learner-facing Chinese form.
2. Pinyin and English can be hidden without changing the canonical record.
3. New language is introduced in meaning-bearing context.
4. Recognition precedes unsupported production.
5. Feedback explains why an answer works; it does not only mark right or wrong.
6. One stage should have one primary learning job.
7. Reference books guide scope and progression but are never copied into lesson records.

## Player responsibilities

The reusable lesson player owns:

- stage navigation and progress;
- audio playback and unavailable-audio feedback;
- pinyin and meaning visibility controls;
- answer selection and explanatory feedback;
- recall checking;
- completion state;
- keyboard, screen-reader, touch, and reduced-motion behavior.

The content record owns what is taught. Theme components own how the background and surfaces look. These responsibilities remain separate so visual changes cannot silently alter learning content.

## Current implementation boundary

The first implementation stores lesson data locally and uses the browser's installed `zh-TW` speech voice as a temporary pronunciation source. Before public curriculum release, browser speech must be replaced or supplemented with reviewed original or properly licensed recordings.

Persistent accounts, cloud progress, spaced-repetition scheduling, and authoring tools are later milestones. The first vertical slice proves the learning loop before those systems are added.
