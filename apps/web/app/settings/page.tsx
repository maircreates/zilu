import type { Metadata } from 'next';

import { SettingsHub } from '@/components/settings-hub';

export const metadata: Metadata = {
  title: 'Settings — ZiLu',
  description: 'Control how ZiLu looks and behaves.',
};

export default function SettingsPage() {
  return <SettingsHub />;
}
