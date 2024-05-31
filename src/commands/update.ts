import { loadConfig } from "../lib/config.ts"
import { installPackages } from "../lib/installPackages.ts"
import { isInstalled } from "../lib/package.ts"

export async function updateCommand(pkgNames: string[]) {
  const packages = loadConfig()

  const packagesToUpdate = pkgNames.length === 0
    ? packages.filter((p) => isInstalled(p))
    : packages.filter((p) => pkgNames.includes(p.name))

  await installPackages(packagesToUpdate, { update: true })
}
