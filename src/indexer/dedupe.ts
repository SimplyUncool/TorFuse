import type { TorrentCandidate } from "../types.js";

export function dedupeTorrents(
  torrents: TorrentCandidate[]
): TorrentCandidate[] {
  const seen = new Set<string>();
  const unique: TorrentCandidate[] = [];

  for (const torrent of torrents) {
    const hash = torrent.hash.trim().toLowerCase();

    if (!hash || seen.has(hash)) {
      continue;
    }

    seen.add(hash);

    unique.push({
      ...torrent,
      hash
    });
  }

  return unique;
}