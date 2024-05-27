import { loadConfig } from "../lib/config.ts"
import { installPackage } from "../lib/installPackage.ts"

export function installCommand(pkgNames: string[]) {
  const packages = loadConfig()

  const packagesToInstall = pkgNames.length === 0
    ? packages
    : packages.filter((p) => pkgNames.includes(p.name))

  for (const pkg of packagesToInstall) {
    installPackage(pkg)
  }
}
