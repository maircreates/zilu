import type { Metadata } from 'next';

import { SECTIONS } from '@/lib/fundamentals';
import { FundamentalsSectionPage } from '@/components/fundamentals-section-page';

type PageProps = {
  params: Promise<{ section: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { section: sectionId } = await params;
  const section = SECTIONS.find((item) => item.id === sectionId);
  if (!section) {
    return { title: 'Fundamentals — ZiLu' };
  }
  return {
    title: `${section.title} — Fundamentals — ZiLu`,
    description: section.teaser,
  };
}

export default async function FundamentalsSectionRoute({ params }: PageProps) {
  const { section } = await params;
  return <FundamentalsSectionPage sectionId={section} />;
}
