import express from "express";
import { AddonBuilder, createRouter } from "@stremio-addon/sdk";

const app = express();
const port = Number(process.env.PORT) || 3000;

const addon = new AddonBuilder({
  id: "com.torfuse.addon",
  name: "TorFuse",
  description: "A TorBox-powered Stremio addon",
  version: "0.1.0",
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ["tt"],
  catalogs: []
});

addon.defineStreamHandler(async ({ type, id }) => {
  console.log(`Stream request: ${type} ${id}`);

  return {
    streams: [
      {
        name: "TorFuse Test",
        description: "TorFuse stream handler is working",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    ]
  };
});

const router = createRouter(addon.getInterface());

app.use(async (req, res) => {
  try {
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);

    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>)
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
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`TorFuse listening on port ${port}`);
});