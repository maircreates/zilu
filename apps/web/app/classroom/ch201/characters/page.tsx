import type { Metadata } from 'next';

import { CharacterCollection } from '@/components/study-packs/character-collection';

export const metadata: Metadata = { title: '30 Useful Characters — Chinese Class — ZiLu', description: 'A curated character study collection taught through useful combinations.' };

export default function Ch201CharactersRoute() {
  return <CharacterCollection />;
}
