import { AddonBuilder, createRouter } from "@stremio-addon/sdk";
import { getConfig } from "./config.js";
import type { TorFuseConfig } from "./types.js";

export const addon = new AddonBuilder({
  id: "com.torfuse.addon",
  name: "TorFuse",
  description: "A TorBox-powered Stremio addon",
  version: "0.1.0",
  resources: ["stream"],
  types: ["movie", "series"],
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
      title: "TorFuse Configuration",
      required: true
    }
  ]
});

addon.defineStreamHandler<TorFuseConfig>(
  async ({ type, id, config }) => {
    console.log(`Stream request: ${type} ${id}`);

    const configId = config?.config_id;

    if (!configId) {
      console.log("TorFuse configuration missing");

      return {
        streams: []
      };
    }

    const storedConfig = getConfig(configId);

    if (!storedConfig) {
      console.log("TorFuse configuration not found");

      return {
        streams: []
      };
    }

    const torboxApiKey = storedConfig.torbox_api_key;

    console.log(
      "TorBox API key configured:",
      Boolean(torboxApiKey)
    );

    return {
      streams: [
        {
          name: "TorFuse Test",
          description: "TorFuse stream handler is working",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      ]
    };
  }
);

export const router = createRouter(
  addon.getInterface()
);