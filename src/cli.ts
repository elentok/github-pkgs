import { Command } from "npm:commander"
import { list } from "./commands/list.ts"
import { installCommand } from "./commands/install.ts"
// import { build } from "./commands/build.ts"
// import { LayerError, LayoutError } from "./lib/types.ts"
// import { format } from "./commands/format.ts"
// import { copy } from "./commands/copy.ts"

function main() {
  const program = new Command()

  program.command("list")
    .description("List available packages")
    .action(list)

  program.command("install")
    .argument("[pkg...]")
    .description("Install packages")
    .action(installCommand)

  // try {
  program.parse()
  // } catch (e) {
  //   if (e instanceof LayerError || e instanceof LayoutError) {
  //     console.error(e.message)
  //     Deno.exit(1)
  //   } else {
  //     throw e
  //   }
  // }
}

if (import.meta.main) {
  main()
}