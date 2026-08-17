import type { TorrentCandidate } from "../types.js";

type CacheEntry = {
  results: TorrentCandidate[];
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL = 5 * 60 * 1000;

function createKey(
  query: unknown
): string {
  return JSON.stringify(query);
}

export function getCachedResults(
  query: unknown
): TorrentCandidate[] | undefined {
  const key = createKey(query);
  const entry = cache.get(key);

  if (!entry) {
    return undefined;
  }

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }

  return entry.results;
}

export function setCachedResults(
  query: unknown,
  results: TorrentCandidate[],
  ttl = DEFAULT_TTL
): void {
  const key = createKey(query);

  cache.set(key, {
    results,
    expiresAt: Date.now() + ttl
  });
}

export function clearIndexerCache(): void {
  cache.clear();
}