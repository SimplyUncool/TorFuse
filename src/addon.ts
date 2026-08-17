import { AddonBuilder, createRouter } from "@stremio-addon/sdk";
import { getConfig } from "./config.js";
import type {
  TorFuseConfig,
  TorrentCandidate
} from "./types.js";
import {
  TorFuseIndexer,
  type IndexerMediaType
} from "./indexer/index.js";

type ParsedStremioRequest = {
  imdbId: string;
  season?: number;
  episode?: number;
};

function parseStremioId(
  type: "movie" | "series",
  id: string
): ParsedStremioRequest | null {
  if (type === "movie") {
    if (!/^tt\d+$/.test(id)) {
      return null;
    }

    return {
      imdbId: id
    };
  }

  const parts = id.split(":");

  if (parts.length !== 3) {
    return null;
  }

  const [
    imdbId,
    seasonString,
    episodeString
  ] = parts;

  if (
    !imdbId ||
    !/^tt\d+$/.test(imdbId)
  ) {
    return null;
  }

  const season =
    Number(seasonString);

  const episode =
    Number(episodeString);

  if (
    !Number.isInteger(season) ||
    season < 0 ||
    !Number.isInteger(episode) ||
    episode < 0
  ) {
    return null;
  }

  return {
    imdbId,
    season,
    episode
  };
}

export const addon = new AddonBuilder({
  id: "com.torfuse.addon",

  name: "TorFuse",

  description:
    "A TorBox-powered Stremio addon",

  version: "0.1.0",

  resources: ["stream"],

  types: [
    "movie",
    "series"
  ],

  idPrefixes: ["tt"],

  catalogs: [],

  behaviorHints: {
    configurable: true,
    configurationRequired: true
  },

  config: [
    {
      key: "config_id",

      type: "text",

      title:
        "TorFuse Configuration",

      required: true
    }
  ],

  stremioAddonsConfig: {
    issuer:
      "https://stremio-addons.net",

    signature:
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..-M26iEYrPCrci7-aG-vWIw.r3VO0OLhvNjQwCh14VZNvfpL0D23Kb26-gUuXR3feivOadovZE4bdlbaR3La7lfX57uGKzmnOzycoB34GpCpsgsnq4SSIpQuOT2MyBoJK3jBHjSgJ1nYH-GC_9-pRQlR.cuO_MzV0P71m2MZ0Lvdqyw"
  }
});

const indexer =
  new TorFuseIndexer();

addon.defineStreamHandler<TorFuseConfig>(
  async ({
    type,
    id,
    config
  }) => {
    console.log(
      `Stream request: ${type} ${id}`
    );

    const configId =
      config?.config_id;

    if (!configId) {
      console.log(
        "TorFuse configuration missing"
      );

      return {
        streams: []
      };
    }

    const storedConfig =
      getConfig(configId);

    if (!storedConfig) {
      console.log(
        "TorFuse configuration not found"
      );

      return {
        streams: []
      };
    }

    const parsed =
      parseStremioId(
        type as "movie" | "series",
        id
      );

    if (!parsed) {
      console.log(
        "Invalid Stremio video ID:",
        id
      );

      return {
        streams: []
      };
    }

    const mediaType:
      IndexerMediaType =
      type === "movie"
        ? "movie"
        : "series";

    console.log(
      "Parsed request:",
      {
        mediaType,
        imdbId: parsed.imdbId,
        season: parsed.season,
        episode: parsed.episode
      }
    );

    console.log(
      "TorBox API key configured:",
      Boolean(
        storedConfig.torbox_api_key
      )
    );

    const candidates:
      TorrentCandidate[] =
      await indexer.search({
        type: mediaType,

        imdbId:
          parsed.imdbId,

        season:
          parsed.season,

        episode:
          parsed.episode,

        limit: 100
      });

    console.log(
      `Indexer returned ${candidates.length} candidates`
    );

    return {
      streams: [
        {
          name: "TorFuse Test",

          description:
            "TorFuse stream handler is working",

          url:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      ]
    };
  }
);

export const router =
  createRouter(
    addon.getInterface()
  );