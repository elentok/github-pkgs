import { join } from "std:path"
import { existsSync } from "std:fs"
import { APPS_BIN } from "./appsDir.ts"
import { Package } from "./types.ts"

export function binSymlink(pkg: Package): string {
  return join(APPS_BIN, pkg.binTarget)
}

export function isInstalled(pkg: Package): boolean {
  return existsSync(binSymlink(pkg))
}
