import * as path from "std:path"
import { shell } from "./shell.ts"

export async function extract(filename: string, stripComponents = 0): Promise<void> {
  const basename = path.basename(filename)
  const dirname = path.dirname(filename)
  const cmd = extractCommand(basename, stripComponents)

  const result = await shell(cmd, { cwd: dirname })
  if (!result.success) {
    throw new Error(`Failed to extract, command "${extractCommand}" return non-zero exit code.`)
  }
}

function extractCommand(filename: string, stripComponents: number): string {
  if (filename.endsWith(".tar.gz") || filename.endsWith(".tgz")) {
    return `tar --strip-components ${stripComponents} -xzf ${filename}`
  }

  if (filename.endsWith(".tar.xz")) {
    return `tar --strip-components ${stripComponents} -xf ${filename}`
  }

  if (filename.endsWith(".zip")) {
    // "-o" - overwrites file without confirmation
    return `unzip -o ${filename}`
  }

  if (filename.endsWith(".gz")) {
    return `gunzip ${filename}`
  }

  throw new Error(`Can't extract ${filename}, extension not supported`)
}
