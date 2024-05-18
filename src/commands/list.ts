import { loadPackages } from "../lib/packages.ts"

export function list() {
  const packages = loadPackages()
  console.log(packages)
}
