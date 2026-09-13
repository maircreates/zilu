import type { Metadata } from 'next';

import { SettingsDisplayHub } from '@/components/settings-display-hub';

export const metadata: Metadata = {
  title: 'Display — Settings — ZiLu',
  description: 'Aesthetics, UI, and Theme settings for ZiLu.',
};

export default function SettingsDisplayPage() {
  return <SettingsDisplayHub />;
}
