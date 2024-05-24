import * as path from "std:path"
import { Package } from "./types.ts"
import { configSchema } from "./configSchema.ts"

function defaultConfigFile(): string {
  const thisFilename = path.fromFileUrl(import.meta.url)
  return path.join(path.dirname(thisFilename), "..", "..", "config", "packages.json")
}

export function loadConfig(filename: string = defaultConfigFile()): Package[] {
  const raw = JSON.parse(Deno.readTextFileSync(filename))
  const pkgConfigs = configSchema.cast(raw) ?? []
  return pkgConfigs.map((pkgConfig) => ({
    binTarget: pkgConfig.name,
    stripComponents: 0,
    version: "latest",
    ...pkgConfig,
  }))
}
