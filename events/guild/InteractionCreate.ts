import {
	EmbedBuilder,
	Interaction,
	ChatInputCommandInteraction,
} from "discord.js";
import { Pomodoro } from "../../structure/Client";
import CustomError from "../../structure/Errors";
import { Event } from "../../structure/Events";
import { Command } from "../../structure/Command";
import CooldownManager from "../../structure/CooldownManager";
export default class IntCreate extends Event {
	constructor(client: Pomodoro) {
		super(client, "interactionCreate");
	}
	cooldown = new CooldownManager();
	public async run(
		interaction:
			| Interaction<"cached">
			| ChatInputCommandInteraction<"cached">
	) {
		if (interaction.isCommand()) {
			const { commandName: name } = interaction;
			const cmd = new (this.client.commands.get(
				name
			).default)() as Command;

			for (const condition of cmd.options.conditions || []) {
				const imported = await import(
					`../../src/conditions/${condition}.ts`
				);
				const conditionFunc = imported.default;

				const result = conditionFunc(interaction.user.id).catch(
					(err: any) => {
						if (err instanceof CustomError) {
							return Promise.reject(err);
						}
					}
				);

				try {
					await result;
				} catch (err: any) {
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle("`❌` | Error")
								.setDescription(
									`> ❌ **Error**: ${err.message}\n> 📑 **Description**: ${err.description}`
								)
								.setColor(this.client.colors.Error),
						],
						ephemeral: true,
					});
				}
			}

			try {
				await this.client.checkPermissionsForUser({
					interaction,
					cmd,
				});
				await this.client.checkPermissionsForMe({
					interaction,
					cmd,
				});
				await this.cooldown.checkCooldown(interaction, cmd);
			} catch (err: any) {
				if (err instanceof CustomError)
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle("`❌` | Error")
								.setDescription(
									`> ❌ **Error**: ${err.message}\n> 📑 **Description**: ${err.description}`
								)
								.setColor(this.client.colors.Error),
						],
						ephemeral: true,
					});
			}

			cmd.run({ client: this.client, interaction }).catch((err: any) => {
				if (err instanceof CustomError)
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle("`❌` | Error")
								.setDescription(
									`> ❌ **Error**: ${err.message}\n> 📑 **Description**: ${err.description}`
								)
								.setColor(this.client.colors.Error),
						],
						ephemeral: true,
					});
				else this.client.logger.warn(`[${this.name}] -> ${err.stack}`);
			});

			// disabled temporary cooldown because generate a lot of errors
			//this.cooldown.addCooldown(interaction, cmd);
		}
	}
}
