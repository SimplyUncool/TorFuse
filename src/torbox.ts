const TORBOX_BASE_URL = "https://api.torbox.app/v1";

export type TorBoxResponse<T> = {
  success: boolean;
  error: string | null;
  detail: string;
  data: T;
};

export type TorBoxTorrent = {
  id: number;
  name: string;
  hash: string;
  size: number;
  progress: number;
  download_speed: number;
  upload_speed: number;
  eta: number;
  status: string;
  files: TorBoxFile[];
};

export type TorBoxFile = {
  id: number;
  name: string;
  size: number;
  short_name?: string;
  absolute_path?: string;
};

export type TorBoxCachedResult = {
  [hash: string]: unknown;
};

export type TorBoxCreateTorrentResult = {
  torrent_id: number;
  name?: string;
};

export type TorBoxDownloadResult = {
  [key: string]: unknown;
};

export class TorBoxClient {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey.trim()) {
      throw new Error("TorBox API key is missing");
    }

    this.apiKey = apiKey.trim();
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<TorBoxResponse<T>> {
    const response = await fetch(
      `${TORBOX_BASE_URL}${path}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          ...(options.headers ?? {})
        }
      }
    );

    let body: TorBoxResponse<T>;

    try {
      body = await response.json() as TorBoxResponse<T>;
    } catch {
      throw new Error(
        `TorBox returned invalid JSON (${response.status})`
      );
    }

    if (!response.ok || !body.success) {
      throw new Error(
        body.detail ||
        body.error ||
        `TorBox API request failed (${response.status})`
      );
    }

    return body;
  }

  async checkCached(
    hashes: string[]
  ): Promise<TorBoxCachedResult> {
    if (hashes.length === 0) {
      return {};
    }

    const params = new URLSearchParams();

    for (const hash of hashes) {
      params.append("hash", hash);
    }

    params.set("format", "object");
    params.set("list_files", "true");

    const result =
      await this.request<TorBoxCachedResult>(
        `/api/torrents/checkcached?${params.toString()}`
      );

    return result.data;
  }

  async createTorrent(
    magnet: string,
    options: {
      name?: string;
      addOnlyIfCached?: boolean;
      seed?: 1 | 2 | 3;
    } = {}
  ): Promise<TorBoxCreateTorrentResult> {
    const form = new FormData();

    form.set("magnet", magnet);

    if (options.name) {
      form.set("name", options.name);
    }

    if (options.addOnlyIfCached !== undefined) {
      form.set(
        "add_only_if_cached",
        String(options.addOnlyIfCached)
      );
    }

    if (options.seed !== undefined) {
      form.set("seed", String(options.seed));
    }

    const result =
      await this.request<TorBoxCreateTorrentResult>(
        "/api/torrents/createtorrent",
        {
          method: "POST",
          body: form
        }
      );

    return result.data;
  }

  async getTorrent(
    torrentId: number,
    bypassCache = false
  ): Promise<TorBoxTorrent> {
    const params = new URLSearchParams({
      id: String(torrentId),
      bypass_cache: String(bypassCache)
    });

    const result =
      await this.request<TorBoxTorrent>(
        `/api/torrents/mylist?${params.toString()}`
      );

    return result.data;
  }

  async requestDownload(
    torrentId: number,
    fileId: number,
    options: {
      redirect?: boolean;
      appendName?: boolean;
    } = {}
  ): Promise<TorBoxDownloadResult | string> {
    const params = new URLSearchParams({
      token: this.apiKey,
      torrent_id: String(torrentId),
      file_id: String(fileId)
    });

    if (options.redirect !== undefined) {
      params.set(
        "redirect",
        String(options.redirect)
      );
    }

    if (options.appendName !== undefined) {
      params.set(
        "append_name",
        String(options.appendName)
      );
    }

    const response = await fetch(
      `${TORBOX_BASE_URL}/api/torrents/requestdl?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        },
        redirect: "manual"
      }
    );

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      return (
        response.headers.get("location") ??
        ""
      );
    }

    let body: unknown;

    try {
      body = await response.json();
    } catch {
      throw new Error(
        `TorBox requestdl returned invalid JSON (${response.status})`
      );
    }

    if (!response.ok) {
      throw new Error(
        `TorBox requestdl failed (${response.status})`
      );
    }

    return body as TorBoxDownloadResult;
  }
}