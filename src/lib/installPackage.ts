import * as fs from "std:fs"
import { download, makeExecutable } from "./helpers.ts"
import { isInstalled } from "./package.ts"
import { InstallResult, Package } from "./types.ts"
import { APPS_BIN } from "./appsDir.ts"
import { extract } from "./extract.ts"
import { findAsset } from "./findAsset.ts"
import { bullet } from "./ui.ts"

export async function installPackage(pkg: Package): Promise<InstallResult> {
  if (isInstalled(pkg)) {
    return { pkg, status: "already-installed" }
  }

  const assetContext = await findAsset(pkg)
  if ("status" in assetContext) {
    return assetContext
  }

  const { asset, assetFilename, fullBinSource, fullBinTarget } = assetContext

  bullet(`Downloading ${assetFilename}...`)
  await download(asset.browserDownloadUrl, assetFilename, { overwrite: true })

  if (pkg.extract) {
    await extract(assetFilename, pkg.stripComponents)
  } else {
    await makeExecutable(assetFilename)
  }

  await makeExecutable(fullBinSource)

  await link(fullBinTarget, fullBinSource)

  return { pkg, status: "success" }
}

async function link(target: string, source: string) {
  console.info("* Linking...")

  await Deno.mkdir(APPS_BIN, { recursive: true })
  if (await fs.exists(target)) {
    await Deno.remove(target)
  }

  Deno.symlink(source, target)
}
