import type { Metadata } from 'next';

import { SettingsHomepagePage } from '@/components/settings-homepage-page';

export const metadata: Metadata = {
  title: 'Homepage — Aesthetics — Settings — ZiLu',
  description:
    'Control the floating Chinese characters on the ZiLu homepage: density, speed, and what hover, click, and drag do.',
};

export default function SettingsHomepageRoute() {
  return <SettingsHomepagePage />;
}
