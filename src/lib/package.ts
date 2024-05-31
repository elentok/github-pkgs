import { join } from "std:path"
import { existsSync } from "std:fs"
import { APPS_ALL, APPS_BIN } from "./appsDir.ts"
import { Package } from "./types.ts"
import { currentPlatform } from "./helpers.ts"

export function binSymlink(pkg: Package): string {
  return join(APPS_BIN, pkg.binTarget)
}

export function isInstalled(pkg: Package): boolean {
  return existsSync(binSymlink(pkg))
}

export function isSupported(pkg: Package): boolean {
  return pkg.assets[currentPlatform()] != null
}

export function installedTagName(pkg: Package): string | undefined {
  const pkgBinSymlink = binSymlink(pkg)
  if (!existsSync(pkgBinSymlink)) {
    return
  }

  const target = Deno.readLinkSync(pkgBinSymlink)
  return target.substring(APPS_ALL.length + pkg.name.length + 2).split("/")[0]
}
