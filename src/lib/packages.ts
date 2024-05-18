import * as path from "std:path"
import { Package } from "./types.ts"
import { asPackage, packagesSchema } from "./schema.ts"

function defaultConfigFile(): string {
  const thisFilename = path.fromFileUrl(import.meta.url)
  return path.join(path.dirname(thisFilename), "..", "..", "config", "packages.json")
}

export function loadPackages(filename: string = defaultConfigFile()): Package[] {
  const raw = JSON.parse(Deno.readTextFileSync(filename))
  return packagesSchema.cast(raw)
  // return raw.map(asPackage)
}
