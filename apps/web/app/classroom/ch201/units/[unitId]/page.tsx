import type { Metadata } from 'next';

import { StudyUnitPage } from '@/components/study-packs/study-unit-page';
import { getCh201Unit } from '@/lib/study-packs/ch201';

type Props = {
  params: Promise<{ unitId: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unitId } = await params;
  const unit = getCh201Unit(unitId);
  return unit ? { title: `${unit.titleEn} — Chinese Class — ZiLu`, description: unit.summary } : { title: 'Class unit — ZiLu' };
}

export default async function Ch201UnitRoute({ params, searchParams }: Props) {
  const [{ unitId }, { mode }] = await Promise.all([params, searchParams]);
  return <StudyUnitPage unitId={unitId} mode={mode} />;
}
