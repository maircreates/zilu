import type { Metadata } from 'next';

import { SettingsThemePage } from '@/components/settings-theme-page';

export const metadata: Metadata = {
  title: 'Theme — Display — Settings — ZiLu',
  description: 'Cyberpunk, Silkpunk, and Taopunk color themes for ZiLu, each with a day and night mode.',
};

export default function SettingsThemeRoute() {
  return <SettingsThemePage />;
}
