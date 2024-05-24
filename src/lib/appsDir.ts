import { join } from "std:path"

const HOME = Deno.env.get("HOME")
if (HOME == null) {
  throw new Error(`No HOME env variable`)
}

export const APPS_ROOT = join(HOME, ".apps")
export const APPS_ALL = join(APPS_ROOT, "all")
export const APPS_BIN = join(APPS_ROOT, "bin")
