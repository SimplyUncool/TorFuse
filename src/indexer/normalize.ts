import type { TorrentCandidate } from "../types.js";

export type RawIndexerResult = {
  name?: unknown;
  title?: unknown;
  hash?: unknown;
  infoHash?: unknown;
  magnet?: unknown;
  magnetLink?: unknown;
  size?: unknown;
  sizeBytes?: unknown;
  seeders?: unknown;
  leechers?: unknown;
  source?: unknown;
  url?: unknown;
};

function stringValue(
  value: unknown
): string | undefined {
  return typeof value === "string" &&
    value.trim().length > 0
    ? value.trim()
    : undefined;
}

function numberValue(
  value: unknown
): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export function normalizeIndexerResult(
  result: RawIndexerResult
): TorrentCandidate | null {
  const name =
    stringValue(result.name) ??
    stringValue(result.title);

  const hash =
    stringValue(result.hash) ??
    stringValue(result.infoHash);

  if (!name || !hash) {
    return null;
  }

  return {
    name,
    hash: hash.toLowerCase(),

    magnet:
      stringValue(result.magnet) ??
      stringValue(result.magnetLink),

    size:
      numberValue(result.sizeBytes) ??
      numberValue(result.size),

    seeders: numberValue(result.seeders),

    leechers: numberValue(result.leechers),

    source: stringValue(result.source),

    url: stringValue(result.url)
  };
}

export function normalizeIndexerResults(
  results: RawIndexerResult[]
): TorrentCandidate[] {
  return results
    .map(normalizeIndexerResult)
    .filter(
      (result): result is TorrentCandidate =>
        result !== null
    );
}