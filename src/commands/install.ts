import { loadConfig } from "../lib/config.ts"
import { installPackage } from "../lib/installPackage.ts"
import pLimit from "npm:p-limit"
import { bullet, error, header, silentSuccess, success, warning } from "../lib/ui.ts"
import { currentPlatform } from "../lib/helpers.ts"
import { isSupported } from "../lib/package.ts"
import { Package } from "../lib/types.ts"

export async function installCommand(pkgNames: string[], { force }: { force: boolean }) {
  const packages = loadConfig()

  const packagesToInstall = pkgNames.length === 0
    ? packages
    : packages.filter((p) => pkgNames.includes(p.name))

  const supportedPackages = packagesToInstall.filter((pkg) => isSupported(pkg))
  const unsupportedPackages = packagesToInstall.filter((pkg) => !isSupported(pkg))

  header(`Installing ${supportedPackages.length} package(s): ${names(supportedPackages)}`)

  if (unsupportedPackages.length > 0) {
    warning(
      `Skipping unsupported package(s): ${names(unsupportedPackages)}`,
    )
  }

  const limit = pLimit(3)

  const promises = supportedPackages.map((pkg) => limit(() => installPackage(pkg, { force })))
  const results = await Promise.all(promises)

  results.sort((a, b) => a.status.localeCompare(b.status))

  let hasErrors = false
  for (const result of results) {
    const { pkg, status, details } = result
    const { name } = pkg
    switch (status) {
      case "error":
        hasErrors = true
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

  if (hasErrors) {
    console.log()
    error("One or more packages failed to install.")
    Deno.exit(1)
  }
}

function names(pkgs: Package[]): string {
  return pkgs.map((p) => p.name).join(", ")
}
