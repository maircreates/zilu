import type { Metadata } from 'next';

import { GRAMMAR_THEMES } from '@/lib/grammar';
import { GrammarThemePage } from '@/components/grammar-theme-page';

type PageProps = {
  params: Promise<{ theme: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { theme: themeId } = await params;
  const theme = GRAMMAR_THEMES.find((item) => item.id === themeId);
  if (!theme) {
    return { title: 'Grammar — ZiLu' };
  }
  return {
    title: `${theme.title} — Grammar — ZiLu`,
    description: theme.intro,
  };
}

export default async function GrammarThemeRoute({ params }: PageProps) {
  const { theme } = await params;
  return <GrammarThemePage themeId={theme} />;
}
