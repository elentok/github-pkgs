import * as path from "std:path"
import { fetchRelease } from "./github/github.ts"
import { GithubAsset, GithubRelease } from "./github/types.ts"
import { currentPlatform } from "./helpers.ts"
import { AssetConfig, InstallResult, Package } from "./types.ts"
import { APPS_ALL, APPS_BIN } from "./appsDir.ts"

export async function findAsset(pkg: Package): Promise<InstallResult | AssetContext> {
  const assetConfig = pkg.assets[currentPlatform()]
  if (assetConfig == null) {
    console.info(`Package ${pkg.name} does not support ${currentPlatform()}`)
    return { status: "unsupported-platform" }
  }

  const release = await fetchRelease(pkg.githubRepo, pkg.version)
  if (release == null) {
    console.error(`Could not find releases for ${pkg.name}`)
    return { status: "error", details: "Could find any releases" }
  }

  const asset = release.assets.find((a) => a.name.match(assetConfig.regexp))
  if (asset == null) {
    console.error(`Could not find asset for ${pkg.name} (${assetConfig.regexp})`)
    return { status: "error", details: `Could find asset to match regexp '${assetConfig.regexp} ` }
  }

  const ext = asset.ext ?? path.extname(asset.name)
  const releaseDirname = path.join(APPS_ALL, pkg.name, release.tagName)
  const assetFilename = path.join(releaseDirname, `${pkg.name}${ext}`)
  const fullBinSource = path.join(releaseDirname, assetConfig.binSource ?? pkg.binTarget)
  const fullBinTarget = path.join(APPS_BIN, pkg.binTarget)

  return {
    pkg,
    assetConfig,
    asset,
    release,
    releaseDirname,
    assetFilename,
    fullBinSource,
    fullBinTarget,
  }
}

export interface AssetContext {
  pkg: Package
  assetConfig: AssetConfig
  release: GithubRelease
  asset: GithubAsset
  releaseDirname: string
  assetFilename: string
  fullBinSource: string
  fullBinTarget: string
}
