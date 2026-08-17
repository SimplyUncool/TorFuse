import type { TorrentCandidate } from "../types.js";
import {
  normalizeIndexerResults,
  type RawIndexerResult
} from "./normalize.js";
import { dedupeTorrents } from "./dedupe.js";
import {
  getCachedResults,
  setCachedResults
} from "./cache.js";

export type IndexerMediaType =
  | "movie"
  | "series";

export type IndexerSearchQuery = {
  type: IndexerMediaType;

  query?: string;
  imdbId?: string;
  tmdbId?: string;

  season?: number;
  episode?: number;

  limit?: number;
};

export type IndexerSource = {
  name: string;

  search(
    query: IndexerSearchQuery
  ): Promise<RawIndexerResult[]>;
};

export class TorFuseIndexer {
  private readonly sources: IndexerSource[];

  constructor(
    sources: IndexerSource[] = []
  ) {
    this.sources = sources;
  }

  addSource(
    source: IndexerSource
  ): void {
    this.sources.push(source);
  }

  async search(
    query: IndexerSearchQuery
  ): Promise<TorrentCandidate[]> {
    const limit = query.limit ?? 100;

    if (
      !query.type ||
      (
        !query.query &&
        !query.imdbId &&
        !query.tmdbId
      )
    ) {
      return [];
    }

    const cached =
      getCachedResults(query);

    if (cached) {
      return cached.slice(0, limit);
    }

    if (this.sources.length === 0) {
      return [];
    }

    const results = await Promise.allSettled(
      this.sources.map(async (source) => {
        try {
          return await source.search(query);
        } catch (error) {
          console.error(
            `Indexer source "${source.name}" failed:`,
            error
          );

          return [];
        }
      })
    );

    const rawResults: RawIndexerResult[] = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        rawResults.push(...result.value);
      }
    }

    const normalized =
      normalizeIndexerResults(
        rawResults
      );

    const unique =
      dedupeTorrents(normalized);

    const limited =
      unique.slice(0, limit);

    setCachedResults(
      query,
      limited
    );

    return limited;
  }
}