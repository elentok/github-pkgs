import {
  GITHUB_ASSET_EXTENSIONS,
  GithubAsset,
  GithubAssetExtension,
  GithubRelease,
} from "./types.ts"

export async function fetchRelease(
  repo: string,
  version = "latest",
): Promise<GithubRelease | undefined> {
  const releases = await fetchReleases(repo)
  if (version === "latest") {
    for (const release of releases) {
      if (release.tagName === "stable") {
        continue
      }
      if (!release.prerelease) {
        return release
      }
    }
  }

  return releases.find((release) => release.name === version)
}

interface RawRelease {
  tag_name: string
  name: string
  prerelease: boolean
  published_at: string
  assets: RawAsset[]
}

interface RawAsset {
  name: string
  browser_download_url: string
}

async function fetchReleases(repo: string): Promise<GithubRelease[]> {
  const url = `https://api.github.com/repos/${repo}/releases`
  console.info(`* Fetching releases for ${repo}...`)
  const response = await fetch(url)
  const json = await response.json() as RawRelease[]
  return json.map(parseRelease)
}

function parseRelease(raw: RawRelease): GithubRelease {
  const { tag_name, name, prerelease, published_at, assets } = raw

  return {
    name,
    tagName: tag_name,
    prerelease,
    publishedAt: published_at,
    assets: assets.map(parseAsset),
  }
}

function parseAsset(raw: RawAsset): GithubAsset {
  const { name, browser_download_url } = raw
  return {
    name,
    browserDownloadUrl: browser_download_url,
    ext: identifyExtension(name),
  }
}

function identifyExtension(filename: string): GithubAssetExtension | undefined {
  for (const ext of GITHUB_ASSET_EXTENSIONS) {
    if (filename.endsWith(ext)) {
      return ext
    }
  }
}
