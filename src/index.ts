import express from "express";
import {
  createConfigId,
  encodeConfig,
  storeConfig
} from "./config.js";
import { renderConfigPage } from "./config-page.js";
import { router } from "./addon.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(
  express.urlencoded({
    extended: false
  })
);

app.get("/configure", (_req, res) => {
  res.type("html").send(
    renderConfigPage(
      "TorFuse — Configure",
      "Connect TorBox to Stremio with your own API key.",
      `
        <form
          method="POST"
          action="/configure"
        >

          <label for="torbox_api_key">
            TorBox API Key
          </label>

          <input
            id="torbox_api_key"
            name="torbox_api_key"
            type="password"
            required
            autocomplete="off"
            placeholder="Enter your TorBox API key"
          />

          <button type="submit">
            Generate Manifest
          </button>

        </form>

        <div class="hint">
          Your API key is sent to TorFuse over HTTPS and is
          never placed in the configuration URL.
        </div>
      `
    )
  );
});

app.post("/configure", (req, res) => {
  const apiKey = req.body?.torbox_api_key;

  if (
    typeof apiKey !== "string" ||
    apiKey.trim().length === 0
  ) {
    res.status(400).type("html").send(
      renderConfigPage(
        "TorFuse — Error",
        "Something went wrong.",
        `
          <div class="success">
            A TorBox API key is required.
          </div>

          <a
            class="button"
            href="/configure"
          >
            Go Back
          </a>
        `
      )
    );

    return;
  }

  const configId = createConfigId();

  storeConfig(configId, {
    torbox_api_key: apiKey.trim(),
    created_at: Date.now()
  });

  const encodedConfig = encodeConfig({
    config_id: configId
  });

  const baseUrl =
    `${req.protocol}://${req.get("host")}`;

  const manifestUrl =
    `${baseUrl}/${encodedConfig}/manifest.json`;

  const stremioUrl =
    `stremio://${baseUrl.replace(/^https?:\/\//, "")}/${encodedConfig}/manifest.json`;

  res.type("html").send(
    renderConfigPage(
      "TorFuse — Ready",
      "Your TorBox-powered Stremio addon is configured and ready.",
      `
        <div class="success">
          Configuration generated successfully.
        </div>

        <label>
          Manifest URL
        </label>

        <div class="url">
          ${manifestUrl}
        </div>

        <div class="buttons">

          <a
            class="button"
            href="${stremioUrl}"
          >
            Install in Stremio
          </a>

          <button
            class="button secondary"
            onclick="navigator.clipboard.writeText(${JSON.stringify(manifestUrl)})"
          >
            Copy Manifest
          </button>

        </div>

        <div class="footer">
          Your manifest contains an opaque configuration
          identifier. Your TorBox API key is stored separately
          on the TorFuse server.
        </div>
      `
    )
  );
});

app.use(async (req, res) => {
  try {
    const url = new URL(
      req.originalUrl,
      `http://${req.headers.host}`
    );

    const request = new Request(url, {
      method: req.method,
      headers: new Headers(
        req.headers as Record<string, string>
      )
    });

    const response = await router(request);

    if (!response) {
      res.status(404).end();
      return;
    }

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status);

    const body = await response.arrayBuffer();

    res.send(Buffer.from(body));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `TorFuse listening on port ${port}`
  );
});