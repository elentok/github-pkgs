import { shell, ShellResult } from "./shell.ts"
import { Platform } from "./types.ts"
import * as fs from "std:fs"
import * as path from "std:path"
import { bullet } from "./ui.ts"

export function currentPlatform(): Platform {
  if (Deno.build.os === "darwin") {
    return Deno.build.arch === "x86_64" ? "mac-x86" : "mac-arm"
  } else {
    return Deno.build.arch === "x86_64" ? "linux-x86" : "linux-arm"
  }
}

export async function download(
  url: string,
  filename: string,
  { overwrite = false }: { overwrite?: boolean } = {},
): Promise<void> {
  if (await fs.exists(filename)) {
    if (overwrite) {
      await Deno.remove(filename)
    } else {
      throw new Error(`Cannot download ${url}, file ${filename} already exists`)
    }
  } else {
    await fs.ensureDir(path.dirname(filename))
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`)
  }

  const data = new Uint8Array(await response.arrayBuffer())
  await Deno.writeFile(filename, data)
}

export function makeExecutable(filename: string): Promise<ShellResult> {
  bullet(`making ${filename} executable ...`)
  return shell("chmod", { args: ["u+x", filename] })
}
