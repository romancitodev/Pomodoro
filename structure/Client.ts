import {
	ActivityType,
	Client,
	Collection,
	Interaction,
	User,
	GatewayIntentBits,
	Partials,
} from "discord.js";
import { Bot_Token, configuration, Colors } from "../configuration/config";
import { readdirSync } from "fs";
import Logger from "./ConsoleColors";
import { Command } from "./Command";
import DataBase from "./DataBase";
import CustomError from "./Errors";
import LanguageManager from "./LanguageManager";

export class Pomodoro extends Client {
	owner: User | null;
	token = Bot_Token;
	commands: Collection<string, any> = new Collection();
	colors;
	logger = new Logger();
	database;
	lang = new LanguageManager({ lang: 'es' })
	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildPresences
			],
			failIfNotExists: false,
			partials:[Partials.Channel, Partials.GuildMember, Partials.User],
			allowedMentions: {
				parse: ["everyone", "roles", "users"],
			},
			sweepers: {
				messages: { interval: 60000, lifetime: 60000 },
			},
			presence: {
				status: "online",
				activities: [
					{
						name: "Study",
						type: ActivityType.Competing,
					},
				],
			},
		});
		this.colors = Colors;
		this.database = new DataBase(
			configuration.mongoData.username,
			configuration.mongoData.password
		);
		this.owner = this.application?.owner as User;
	}

	public async init() {
		this.loadCommands();
		this.loadEvents();
		this.database.init().then(() => {
			this.logger.log("Database initialized!");
		});
		super.login(this.token);
	}

	private async loadCommands(): Promise<void> {
		const cmd: Array<any> = [];
		readdirSync("./commands").forEach(async (dir) => {
			const commands = readdirSync(`./commands/${dir}`).filter((file) =>
				file.endsWith(".ts")
			);
			for (const file of commands) {
				const command = await import(`../commands/${dir}/${file}`);
				const commandInstance: Command = new command.default();

				if (commandInstance.options.data.name !== undefined) {
					this.commands.set(
						commandInstance.options.data.name,
						command
					);
					cmd.push(
						JSON.parse(JSON.stringify(commandInstance.options.data))
					);
					this.logger.log(
						`Loaded command: ${commandInstance.options.data.name}`
					);
				} else {
					this.logger.error(`Command ${file} has no name!`);
				}
			}
		});
		this.on("ready", () => {
			if (configuration.testing === true)
				this.guilds.cache
					.get(configuration.serverId)
					?.commands.set(cmd);
			else this.application?.commands.set(cmd);
		});
	}

	private async loadEvents(): Promise<void> {
		readdirSync("./events").forEach(async (dir) => {
			const events = readdirSync(`./events/${dir}`).filter((file) =>
				file.endsWith(".ts")
			);
			for (const file of events) {
				const event = await import(`../events/${dir}/${file}`);
				const eventInstance = new event.default(this);
				if (event.once)
					this.once(eventInstance.name, (...args: any[]) =>
						eventInstance.run(...args)
					);
				else
					this.on(eventInstance.name, (...args: any[]) =>
						eventInstance.run(...args)
					);
			}
		});
	}

	public handleError({
		error,
		description,
	}: {
		error: string;
		description: string;
	}) {
		return Promise.reject(new CustomError({ error, description }));
	}

	public async checkPermissionsForUser({
		interaction,
		cmd,
	}: {
		interaction: Interaction<"cached">;
		cmd: any;
	}) {
		const command: Command = new cmd.default();
		if (interaction.member.permissions.has(command.options.userPerms))
			return Promise.resolve();
		else
			return Promise.reject(
				new CustomError({
					error: "Missing Permissions",
					description: `You don't have the required permissions to use this command!\n(You need \`${command.options.userPerms
						.filter((perm) =>
							interaction.member.permissions.missing(perm)
						)
						.join(", ")}\`)`,
				})
			);
	}

	public async checkPermissionsForMe({
		interaction,
		cmd,
	}: {
		interaction: Interaction<"cached">;
		cmd: any;
	}) {
		const command: Command = new cmd.default();
		if (interaction.guild.me?.permissions.has(command.options.clientPerms))
			return Promise.resolve();
		else
			return Promise.reject(
				new CustomError({
					error: "Missing Permissions",
					description: `I don't have the required permissions to use this command! (I need \`${command.options.clientPerms
						.filter((perm) =>
							interaction.guild.me?.permissions.missing(perm)
						)
						.join(", ")}\`)`,
				})
			);
	}
}
