import type { Metadata } from 'next';

import { SettingsHomepagePage } from '@/components/settings-homepage-page';

export const metadata: Metadata = {
  title: 'Floating Characters — Aesthetics — Settings — ZiLu',
  description:
    'Control the floating Chinese characters in the ZiLu background: density, speed, and what hover, click, and drag do.',
};

export default function SettingsHomepageRoute() {
  return <SettingsHomepagePage />;
}
