const TORBOX_API_URL =
  "https://api.torbox.app/v1";

export type TorBoxClientOptions = {
  apiKey: string;
  timeoutMs?: number;
};

export type TorBoxCachedResult = {
  hash: string;
  cached: boolean;
};

type TorBoxResponse<T> = {
  success: boolean;
  error: string | null;
  detail: string;
  data: T;
};

export class TorBoxClient {
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(
    options: TorBoxClientOptions
  ) {
    this.apiKey = options.apiKey;
    this.timeoutMs =
      options.timeoutMs ?? 10000;
  }

  private async request<T>(
    path: string,
    init: RequestInit = {}
  ): Promise<T> {
    const controller =
      new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      this.timeoutMs
    );

    try {
      const response =
        await fetch(
          `${TORBOX_API_URL}${path}`,
          {
            ...init,

            headers: {
              Authorization:
                `Bearer ${this.apiKey}`,

              Accept:
                "application/json",

              ...(init.headers ?? {})
            },

            signal:
              controller.signal
          }
        );

      const body =
        await response.json() as TorBoxResponse<T>;

      if (
        !response.ok ||
        !body.success
      ) {
        throw new Error(
          body.detail ||
          body.error ||
          `TorBox API returned HTTP ${response.status}`
        );
      }

      return body.data;
    } finally {
      clearTimeout(timeout);
    }
  }

  async checkCached(
    hashes: string[]
  ): Promise<TorBoxCachedResult[]> {
    const normalizedHashes =
      hashes
        .map(hash =>
          hash.trim().toLowerCase()
        )
        .filter(Boolean);

    if (
      normalizedHashes.length === 0
    ) {
      return [];
    }

    const data =
      await this.request<
        Record<string, boolean>
      >(
        "/api/torrents/checkcached",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            hashes: normalizedHashes
          })
        }
      );

    return Object.entries(data).map(
      ([hash, cached]) => ({
        hash: hash.toLowerCase(),
        cached: Boolean(cached)
      })
    );
  }
}