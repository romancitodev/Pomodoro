import chalk from "chalk";

export default class Logger {
	public log(message: string) {
		console.log(chalk.cyan(`[CONSOLE]`) + ` ${message}`);
	}

	public raw(message: string) {
		console.log(message);
	}

	public warn(message: string) {
		console.warn(chalk.yellow(`[WARNING]`) + ` ${message}`);
	}

	public error(message: string) {
		console.error(chalk.red(`[ERROR]`) + ` ${message}`);
	}
}
