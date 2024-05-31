import chalk from "npm:chalk"

export function success(text: string) {
  console.info(chalk.green(`✔ ${text}`))
}

export function silentSuccess(text: string) {
  console.info(chalk.gray(`✔ ${text}`))
}

const orange = chalk.rgb(255, 165, 0)

export function warning(text: string) {
  console.info(orange(`⚠ ${text}`))
}

export function error(text: string) {
  console.info(chalk.red(`✘ ${text}`))
}

export function bullet(text: string) {
  console.info(`• ${text}`)
}
