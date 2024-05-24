export type Platform = "linux-x86" | "linux-arm" | "mac-x86" | "mac-arm"

export interface Package {
  name: string
  githubRepo: string
  stripComponents: number
  binTarget: string
  version: string
  assets: Partial<Record<Platform, PackageAsset>>
}

export interface PackageAsset {
  binSource?: string
  regexp: string
}

export interface InstallResult {
  status: "installed" | "already-installed" | "unsupported-platform" | "error"
  details?: string
}
