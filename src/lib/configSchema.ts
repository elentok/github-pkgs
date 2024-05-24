import * as Yup from "npm:yup"

const assetSchema = Yup.object({
  regexp: Yup.string().required(),
  binSource: Yup.string(),
})

const packageConfigSchema = Yup.object({
  name: Yup.string().required(),
  githubRepo: Yup.string().required(),
  binTarget: Yup.string(),
  stripComponents: Yup.number(),
  assets: Yup.object({
    "linux-x86": assetSchema.default(undefined),
    "linux-arm": assetSchema.default(undefined),
    "mac-arm": assetSchema.default(undefined),
    "mac-x86": assetSchema.default(undefined),
  }).partial(),
})

export type PackageConfig = Yup.InferType<typeof packageConfigSchema>

export const configSchema = Yup.array(packageConfigSchema)
