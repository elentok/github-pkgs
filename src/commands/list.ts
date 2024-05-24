import { loadConfig } from "../lib/config.ts"

export function list() {
  const packages = loadConfig()
  console.log(packages)
}
