import type {
  RawIndexerResult
} from "../normalize.js";

import type {
  IndexerSearchQuery
} from "../index.js";

export type TorznabEndpoint = {
  name: string;
  baseUrl: string;
  apiKey?: string;
  timeoutMs?: number;
};

type XmlItem = {
  title?: string;
  link?: string;
  guid?: string;
  enclosure?: string;
  size?: string;
  attributes: Map<string, string>;
};

const DEFAULT_TIMEOUT = 5000;

function decodeXml(
  value: string
): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function getTag(
  xml: string,
  tag: string
): string | undefined {
  const match = xml.match(
    new RegExp(
      `<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`,
      "i"
    )
  );

  return match?.[1]
    ? decodeXml(match[1].trim())
    : undefined;
}

function parseItems(
  xml: string
): XmlItem[] {
  const items: XmlItem[] = [];

  const matches = xml.matchAll(
    /<item\b[^>]*>([\s\S]*?)<\/item>/gi
  );

  for (const match of matches) {
    const item = match[1];

    if (!item) {
      continue;
    }

    const attributes =
      new Map<string, string>();

    const attributeMatches =
      item.matchAll(
        /<torznab:attr\b[^>]*name=["']([^"']+)["'][^>]*value=["']([^"']*)["'][^>]*\/?>/gi
      );

    for (const attribute of attributeMatches) {
      const name = attribute[1];
      const value = attribute[2];

      if (
        name &&
        value !== undefined
      ) {
        attributes.set(
          name.toLowerCase(),
          decodeXml(value)
        );
      }
    }

    const enclosureMatch =
      item.match(
        /<enclosure\b[^>]*url=["']([^"']+)["'][^>]*>/i
      );

    items.push({
      title: getTag(item, "title"),

      link: getTag(item, "link"),

      guid: getTag(item, "guid"),

      enclosure:
        enclosureMatch?.[1],

      size: getTag(item, "size"),

      attributes
    });
  }

  return items;
}

function numberValue(
  value: string | undefined
): number | undefined {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : undefined;
}

function normalizeEndpoint(
  endpoint: TorznabEndpoint
): string {
  return endpoint.baseUrl
    .replace(/\/+$/, "");
}

export class TorznabSource {
  readonly name: string;

  private readonly endpoint:
    TorznabEndpoint;

  constructor(
    endpoint: TorznabEndpoint
  ) {
    this.endpoint = endpoint;
    this.name = endpoint.name;
  }

  async search(
    options: IndexerSearchQuery
  ): Promise<RawIndexerResult[]> {
    const controller =
      new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      this.endpoint.timeoutMs ??
        DEFAULT_TIMEOUT
    );

    try {
      const params =
        new URLSearchParams();

      params.set(
        "t",
        options.type === "movie"
          ? "movie"
          : "tvsearch"
      );

      if (this.endpoint.apiKey) {
        params.set(
          "apikey",
          this.endpoint.apiKey
        );
      }

      if (options.query) {
        params.set(
          "q",
          options.query
        );
      }

      if (options.imdbId) {
        params.set(
          "imdbid",
          options.imdbId.replace(
            /^tt/,
            ""
          )
        );
      }

      if (options.tmdbId) {
        params.set(
          "tmdbid",
          options.tmdbId
        );
      }

      if (
        options.season !== undefined
      ) {
        params.set(
          "season",
          String(options.season)
        );
      }

      if (
        options.episode !== undefined
      ) {
        params.set(
          "ep",
          String(options.episode)
        );
      }

      params.set(
        "limit",
        String(options.limit ?? 100)
      );

      const response =
        await fetch(
          `${normalizeEndpoint(
            this.endpoint
          )}?${params.toString()}`,
          {
            method: "GET",

            headers: {
              Accept:
                "application/xml, text/xml"
            },

            signal:
              controller.signal
          }
        );

      if (!response.ok) {
        throw new Error(
          `${this.name} returned HTTP ${response.status}`
        );
      }

      const xml =
        await response.text();

      return parseItems(xml).map(
        (item): RawIndexerResult => ({
          name: item.title,

          hash:
            item.attributes.get(
              "infohash"
            ) ??
            item.attributes.get(
              "info_hash"
            ),

          magnet:
            item.attributes.get(
              "magneturl"
            ) ??
            item.attributes.get(
              "magneturi"
            ),

          size:
            numberValue(
              item.size
            ),

          seeders:
            numberValue(
              item.attributes.get(
                "seeders"
              )
            ),

          leechers:
            numberValue(
              item.attributes.get(
                "peers"
              ) ??
              item.attributes.get(
                "leechers"
              )
            ),

          source:
            this.name,

          url:
            item.link ??
            item.guid ??
            item.enclosure
        })
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}