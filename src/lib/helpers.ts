import { Platform } from "./types.ts"

export function currentPlatform(): Platform {
  if (Deno.build.os === "darwin") {
    return Deno.build.arch === "x86_64" ? "mac-x86" : "mac-arm"
  } else {
    return Deno.build.arch === "x86_64" ? "linux-x86" : "linux-arm"
  }
}
