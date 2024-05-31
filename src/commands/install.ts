import { loadConfig } from "../lib/config.ts"
import { installPackage } from "../lib/installPackage.ts"
import pLimit from "npm:p-limit"
import { error, silentSuccess, success, warning } from "../lib/ui.ts"
import { currentPlatform } from "../lib/helpers.ts"

export async function installCommand(pkgNames: string[]) {
  const packages = loadConfig()

  const packagesToInstall = pkgNames.length === 0
    ? packages
    : packages.filter((p) => pkgNames.includes(p.name))

  const limit = pLimit(3)

  const promises = packagesToInstall.map((pkg) => limit(() => installPackage(pkg)))
  const results = await Promise.all(promises)

  results.sort((a, b) => a.status.localeCompare(b.status))

  for (const result of results) {
    const { pkg, status, details } = result
    const { name } = pkg
    switch (status) {
      case "error":
        error(`${name} failed to install: ${details}`)
        break

      case "success":
        success(`${name} was installed successfully`)
        break

      case "already-installed":
        silentSuccess(`${name} is already installed`)
        break

      case "unsupported-platform":
        warning(`${name} is unsupported on ${currentPlatform()}`)
        break
    }
  }
}
