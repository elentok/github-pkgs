import pLimit from "npm:p-limit"
import { currentPlatform } from "./helpers.ts"
import { installPackage } from "./installPackage.ts"
import { isSupported } from "./package.ts"
import { InstallFlags, Package } from "./types.ts"
import { error, header, silentSuccess, success, warning } from "./ui.ts"

export async function installPackages(
  packages: Package[],
  flags: InstallFlags = {},
): Promise<void> {
  const supportedPackages = packages.filter((pkg) => isSupported(pkg))
  const unsupportedPackages = packages.filter((pkg) => !isSupported(pkg))

  header(`Installing ${supportedPackages.length} package(s): ${names(supportedPackages)}`)

  if (unsupportedPackages.length > 0) {
    warning(
      `Skipping unsupported package(s): ${names(unsupportedPackages)}`,
    )
  }

  const limit = pLimit(3)

  const promises = supportedPackages.map((pkg) => limit(() => installPackage(pkg, flags)))
  const results = await Promise.all(promises)

  results.sort((a, b) => a.status.localeCompare(b.status))

  header("Done:")
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

      case "up-to-date":
        silentSuccess(`${name} is up to date`)
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
