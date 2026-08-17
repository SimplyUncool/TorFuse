import { randomBytes } from "node:crypto";
import type { StoredConfig } from "./types.js";

const configs = new Map<string, StoredConfig>();

export function createConfigId(): string {
  return randomBytes(32).toString("base64url");
}

export function storeConfig(
  configId: string,
  config: StoredConfig
): void {
  configs.set(configId, config);
}

export function getConfig(
  configId: string
): StoredConfig | undefined {
  return configs.get(configId);
}

export function encodeConfig(config: object): string {
  return encodeURIComponent(JSON.stringify(config));
}