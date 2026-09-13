import { Settings } from 'lucide-react';

/** The gear icon that lives in each page's topbar next to search, linking to
 * the Settings > Display area. */
export function SettingsTrigger() {
  return (
    <a href="/settings" className="topbar-settings" aria-label="Settings">
      <Settings aria-hidden="true" />
    </a>
  );
}
