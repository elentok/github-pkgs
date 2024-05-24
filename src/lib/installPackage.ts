import * as path from "std:path"
import { fetchRelease } from "./github/github.ts"
import { currentPlatform } from "./helpers.ts"
import { isInstalled } from "./package.ts"
import { InstallResult, Package } from "./types.ts"
import { APPS_ALL } from "./appsDir.ts"

export async function installPackage(pkg: Package): Promise<InstallResult> {
  if (isInstalled(pkg)) {
    console.info(`* Package ${pkg.name} is already installed`)
    return { status: "already-installed" }
  }

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

  download({ pkg, assetConfig, release, asset })

  console.log("[bazinga] [installPackage.ts] installPackage", release)
  // const version = pkg.version
}

function download(
  { pkg, assetConfig, release, asset }: {
    pkg: Package
    assetConfig: PackageAsset
    release: GithubRelease
    asset: GithubAsset
  },
): Promise<InstallResult> {
  // const releaseDirname = path.join(APPS_ALL, pkg.name, release.tagName)
  // const ext = asset.ext ?? path.extname(asset.name)
  // const assetFilename = path.join(releaseDirname, `${pkg.name}{ext}`)
  // const binSource = assetConfig.binSource ?? pkg.binTarget

  // // TODO:
  // return { status: "error" }
}
