# ZiLu Product Principles

## Mission

ZiLu is an original, interactive Mandarin learning system centered on Traditional Chinese. It is not a PDF reader, a textbook copied into HTML, or a generic dashboard with quizzes attached.

Its learning loop is:

**Discover -> Understand -> Interact -> Practice -> Make mistakes -> Review -> Master -> Use the language**

## 1. Zero knowledge means zero assumptions

ZiLu is for learners who may begin with no knowledge of Chinese.

- Explain pinyin, tones, characters, words, grammar patterns, and study interactions before relying on them.
- Never assume the learner completed Volume 1 merely because the first curriculum-development priority is Volume 2.
- Provide an original Start Here foundation path and just-in-time prerequisites.
- Keep explanations plain, concise, encouraging, and actionable.
- Let experienced learners demonstrate readiness and move ahead.
- Fade pinyin and English support based on mastery, not arbitrary timing.

## 2. Traditional Chinese is canonical

- All learner-facing Chinese uses contextually correct Traditional Chinese.
- Traditional Chinese is the canonical stored form.
- No character-set toggle is planned.
- Pinyin and English are optional learning supports, not alternative canonical content.
- Automated conversion never replaces contextual human review.

## 3. Development order is deliberate

1. Volume 2
2. Volume 3
3. Volume 4
4. Volume 1

This is an implementation-priority order, not a claim that a beginner already possesses Volume 1 skills. The Start Here bridge resolves that product requirement without beginning deep Volume 1 analysis.

## 4. References guide pedagogy; ZiLu authors the experience

- Preserve the original PDFs unchanged and local.
- Never commit or distribute reference PDFs.
- Learn from curriculum sequence, objectives, activity types, skill progression, and pedagogical patterns.
- Do not copy substantial text, page layouts, exercises, images, or proprietary media.
- Create original dialogues, examples, activities, visuals, audio, and real-world simulations.
- Track provenance and licensing for every external asset and curricular claim.

## 5. Communication is the goal

- Balance listening, speaking, reading, and writing.
- Connect vocabulary, pronunciation, tones, characters, grammar, and culture to real use.
- Progress from recognition to guided practice, controlled production, independent production, and communication.
- Do not reduce learning to multiple-choice scoring.

## 6. Mistakes are learning data

- Explain why an answer worked or failed.
- Track misconceptions, not only correctness.
- Feed repeated difficulties into adaptive review.
- Avoid shame, punishment, and opaque scoring.
- Give learners a clear next action.

## 7. Mastery is skill-specific

A concept may have separate states for recognition, meaning, listening, pronunciation, reading, writing, and contextual use. Review should respond to these differences rather than assigning one permanent score.

## 8. Lessons form a connected system

The major areas - Learn, Practice, Explore, and Review - share the same curriculum and progress model.

- Lesson objectives connect to activities and self-assessment.
- Vocabulary connects to dialogue, grammar, characters, audio, and review.
- Mistakes connect to personalized queues.
- Cumulative review prevents lessons from becoming isolated units.
- Saved items and notes retain their lesson context.

## 9. Culture belongs in context

- Explain how and why language is used.
- Integrate etiquette, expectations, regional usage, and social context into tasks.
- Avoid stereotype-driven decoration and disconnected trivia.
- Use original or licensed real-world-style materials.

## 10. Interaction must support learning

Chinese content should be directly explorable: hear it, reveal support, inspect a character, rearrange a sentence, save a word, retry a mistake, or connect it to related language.

Every major interaction or motion effect must improve comprehension, memory, hierarchy, feedback, navigation, focus, or delight without obstructing learning.

## 11. Accessibility is mandatory

- Semantic HTML and screen-reader support.
- Full keyboard operation and visible focus.
- Sufficient contrast and color-independent feedback.
- Responsive type and generous touch targets.
- Captions and transcripts for media.
- Reduced-motion support.
- Alternatives to drag, hover, speech, handwriting, and audio-only interaction.

## 12. Performance is part of quality

- Fast initial loading and sensible code splitting.
- Optimized media and fonts.
- Minimal unnecessary JavaScript and DOM complexity.
- Motion that remains efficient on mobile devices.
- No heavy library without a clear learning benefit.

## 13. Responsive and mobile-aware by design

ZiLu must work across desktop, laptop, tablet, phone, keyboard, pointer, and touch. Core learning must not depend on hover or a large screen. Architecture should allow future mobile clients without duplicating curriculum logic.

## 14. Curriculum data is separate from interface code

Separate lesson metadata, vocabulary, grammar, character data, examples, exercises, progress, review history, and presentation. Traditional Chinese remains canonical in structured content. The same content model should be able to serve web, mobile, APIs, review systems, and future authorized AI features.

## 15. AI is a future, constrained capability

AI is not part of this planning phase. Future AI must respect learner level, completed lessons, known vocabulary, weak areas, Traditional Chinese policy, safety, provenance, and human-review requirements.

## 16. Maintainability outranks spectacle

React, Next.js, TypeScript, Tailwind CSS, and motion tools may be evaluated when implementation is authorized. Advanced animation, 3D, or audio technologies are justified only by a clear learning interaction. The initial architecture should be understandable, testable, and extensible.

## 17. Planning gate

No application scaffold, package installation, page, component, database, authentication system, lesson-data file, flashcard engine, or animation should be built until these planning documents are reviewed and the next phase is explicitly approved.

## Definition of a ZiLu-quality decision

A product decision is aligned when it:

1. works for a true beginner;
2. keeps Traditional Chinese canonical;
3. advances communicative ability;
4. is original and copyright-conscious;
5. connects to the broader learning model;
6. is accessible and responsive;
7. protects performance and maintainability;
8. can be evaluated through learner behavior or mastery evidence.

