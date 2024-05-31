import { loadConfig } from "../lib/config.ts"
import { currentPlatform } from "../lib/helpers.ts"
import { installedTagName, isInstalled } from "../lib/package.ts"
import { Package } from "../lib/types.ts"
import chalk from "npm:chalk"

export function list() {
  const packages = loadConfig()
  for (const pkg of packages) {
    const status = getStatus(pkg)
    const icon = getStatusIcon(status)
    let text = `${icon} ${pkg.name}`
    if (status === "installed") {
      const tagName = installedTagName(pkg)
      text = chalk.green(`${text} (${tagName})`)
    } else if (status === "unsupported") {
      text = `${text} (unsupported)`
    }

    console.info(text)
  }
}

type PkgStatus = "installed" | "unsupported" | "not-installed"

function getStatusIcon(status: PkgStatus): string {
  switch (status) {
    case "installed":
      return "✔"
    case "unsupported":
      return "✘"
    case "not-installed":
      return "•"
  }
}

function getStatus(pkg: Package): PkgStatus {
  if (isInstalled(pkg)) {
    return "installed"
  }

  if (pkg.assets[currentPlatform()] == null) {
    return "unsupported"
  }

  return "not-installed"
}
