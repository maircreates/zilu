import type { Metadata } from 'next';

import { SettingsStubPage } from '@/components/settings-stub-page';

export const metadata: Metadata = {
  title: 'Theme — Display — Settings — ZiLu',
  description: 'Solarpunk / Cyberpunk color theme settings for ZiLu.',
};

export default function SettingsThemePage() {
  return (
    <SettingsStubPage
      title="Theme"
      description="Solarpunk / Cyberpunk color themes. For now, use the toggle in the footer of any page."
    />
  );
}
