/** The four destinations that used to crowd the header's text nav --
 * Fundamentals, Grammar, Study, and Settings -- moved to a fixed dock at the
 * bottom of every page, game-HUD style: a row of round "skill button" icons
 * instead of a row of words. Each icon is a single Traditional character in
 * a circle, the same visual language as the brand mark (字), so a learner
 * already reads these as ZiLu's icon convention rather than a new one. */
const SKILLS = [
  { id: 'fundamentals', href: '/fundamentals', label: 'Fundamentals', glyph: '基' },
  { id: 'grammar', href: '/grammar', label: 'Grammar', glyph: '法' },
  { id: 'study', href: '/study', label: 'Study', glyph: '習' },
  { id: 'settings', href: '/settings', label: 'Settings', glyph: '設' },
] as const;

export type SkillId = (typeof SKILLS)[number]['id'];

export function SkillBar({ active }: { active?: SkillId }) {
  return (
    <nav className="skill-bar" aria-label="Primary">
      {SKILLS.map((skill) => (
        <a
          key={skill.id}
          href={skill.href}
          className="skill-button"
          aria-current={active === skill.id ? 'page' : undefined}
        >
          <span className="skill-button-glyph" lang="zh-Hant" aria-hidden="true">
            {skill.glyph}
          </span>
          <span className="skill-button-label">{skill.label}</span>
        </a>
      ))}
    </nav>
  );
}
