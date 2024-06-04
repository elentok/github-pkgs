import * as path from "std:path"
import { shell } from "./shell.ts"
import { bullet } from "./ui.ts"

export async function extract(filename: string, stripComponents = 0): Promise<void> {
  const basename = path.basename(filename)
  const dirname = path.dirname(filename)
  const { cmd, args } = extractCommand(basename, stripComponents)

  bullet(`Extracting ${filename}...`)
  const result = await shell(cmd, { args, cwd: dirname })
  if (!result.success) {
    throw new Error(
      `Failed to extract, command "${extractCommand}" (cwd = "${dirname}") return non-zero exit code.`,
    )
  }
}

function extractCommand(
  filename: string,
  stripComponents: number,
): { cmd: string; args: string[] } {
  if (filename.endsWith(".tar.gz") || filename.endsWith(".tgz")) {
    return {
      cmd: "tar",
      args: ["--strip-components", stripComponents.toString(), "-xzf", filename],
    }
  }

  if (filename.endsWith(".tbz")) {
    return {
      cmd: "tar",
      args: ["--strip-components", stripComponents.toString(), "-xjf", filename],
    }
  }

  if (filename.endsWith(".tar.xz")) {
    return {
      cmd: "tar",
      args: ["--strip-components", stripComponents.toString(), "-xf", filename],
    }
  }

  if (filename.endsWith(".zip")) {
    // "-o" - overwrites file without confirmation
    return {
      cmd: "unzip",
      args: ["-o", filename],
    }
  }

  if (filename.endsWith(".gz")) {
    return {
      cmd: "gunzip",
      args: [filename],
    }
  }

  throw new Error(`Can't extract ${filename}, extension not supported`)
}
