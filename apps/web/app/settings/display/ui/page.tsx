import type { Metadata } from 'next';

import { SettingsStubPage } from '@/components/settings-stub-page';

export const metadata: Metadata = {
  title: 'UI — Display — Settings — ZiLu',
  description: 'Layout and interface density settings for ZiLu.',
};

export default function SettingsUiPage() {
  return (
    <SettingsStubPage
      title="UI"
      description="Layout and interface density."
    />
  );
}
