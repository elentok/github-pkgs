import { array, object, string } from "npm:yup"
import { Package } from "./types.ts"

const assetSchema = object({
  regexp: string().required(),
  binSource: string(),
})

const packageSchema = object({
  name: string().required(),
  githubRepo: string().required(),
  binTarget: string(),
  assets: object({
    "linux-x86": assetSchema.default(undefined),
    "linux-arm": assetSchema.default(undefined),
    "mac-arm": assetSchema.default(undefined),
    "mac-x86": assetSchema.default(undefined),
  }).partial(),
})

export const packagesSchema = array(packageSchema)

export function asPackage(obj: unknown): Package {
  return packageSchema.cast(obj)
}
