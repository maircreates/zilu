import type { Metadata } from 'next';

import { SettingsAestheticsHub } from '@/components/settings-aesthetics-hub';

export const metadata: Metadata = {
  title: 'Aesthetics — Display — Settings — ZiLu',
  description: 'Visual flourishes layered on top of the core ZiLu experience.',
};

export default function SettingsAestheticsPage() {
  return <SettingsAestheticsHub />;
}
