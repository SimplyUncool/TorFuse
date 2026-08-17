import { TorBoxClient } from "./client.js";

export type CachedTorrent = {
  hash: string;
  cached: boolean;
};

export async function checkCachedTorrents(
  client: TorBoxClient,
  hashes: string[]
): Promise<CachedTorrent[]> {
  const uniqueHashes = [
    ...new Set(
      hashes
        .map((hash) =>
          hash.trim().toLowerCase()
        )
        .filter(Boolean)
    )
  ];

  if (uniqueHashes.length === 0) {
    return [];
  }

  return client.checkCached(
    uniqueHashes
  );
}