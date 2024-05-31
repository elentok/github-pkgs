import { loadConfig } from "../lib/config.ts"
import { installPackages } from "../lib/installPackages.ts"

export async function installCommand(pkgNames: string[], { force }: { force: boolean }) {
  const packages = loadConfig()

  const packagesToInstall = pkgNames.length === 0
    ? packages
    : packages.filter((p) => pkgNames.includes(p.name))

  await installPackages(packagesToInstall, { force })
}
