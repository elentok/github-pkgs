export interface GithubAsset {
  name: string
  browserDownloadUrl: string
  ext?: GithubAssetExtension
}

export const GITHUB_ASSET_EXTENSIONS = [".tar.gz", ".tar.xz", ".tgz", ".zip"] as const
export type GithubAssetExtension = typeof GITHUB_ASSET_EXTENSIONS[number]

export interface GithubRelease {
  tagName: string
  name: string
  prerelease: boolean
  publishedAt: string
  assets: GithubAsset[]
}
