import type { CharacterJson } from 'hanzi-writer';

/** ZiLu hosts stroke data for every vocabulary character under
 * /hanzi-data/<char>.json (from the hanzi-writer-data project). Anything not
 * in that set -- a rarer character in a grammar example, say -- falls back to
 * the same dataset's public CDN mirror. */
export async function loadCharData(char: string): Promise<CharacterJson> {
  try {
    const local = await fetch(`/hanzi-data/${encodeURIComponent(char)}.json`);
    if (local.ok) return (await local.json()) as CharacterJson;
  } catch {
    // fall through to the CDN mirror
  }
  const cdn = await fetch(
    `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`,
  );
  if (!cdn.ok) throw new Error(`No stroke data for ${char}`);
  return (await cdn.json()) as CharacterJson;
}
