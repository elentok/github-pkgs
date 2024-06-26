export type Platform = "linux-x86" | "linux-arm" | "mac-x86" | "mac-arm"

export interface Package {
  name: string
  githubRepo: string
  stripComponents: number
  binTarget: string
  version: string
  extract: boolean
  postExtract?: string
  assets: Partial<Record<Platform, AssetConfig>>
}

export interface AssetConfig {
  binSource?: string
  regexp: string
}

export interface InstallResult {
  pkg: Package
  status: "up-to-date" | "success" | "already-installed" | "unsupported-platform" | "error"
  details?: string
}

export interface InstallFlags {
  force?: boolean
  update?: boolean
}
