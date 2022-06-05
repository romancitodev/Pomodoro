import { Interaction } from "discord.js";
import cooldown from "../models/cooldowns";
import { cooldownSuggest } from "../types/InternalCommandTypes";
import { Command } from "./Command";
import CustomError from "./Errors";
import LanguageManager from "./LanguageManager";

const lang = new LanguageManager({ lang: "es" });

export default class CooldownManager {
	private units = {
		s: 1000,
		m: 60000,
		h: 3600000,
		d: 86400000,
	};
	public translateTime(cooldown: cooldownSuggest) {
		const time = cooldown.slice(0, cooldown.length - 1);
		const unit = cooldown[cooldown.length - 1];
		const time_in_ms =
			Number(time) * this.units[unit as keyof typeof this.units];
		const date = new Date(Date.now() + time_in_ms);
		return date;
	}

	public async addCooldown(interaction: Interaction<"cached">, cmd: Command) {
		const results = await cooldown.find({
			serverId: interaction.guildId
		});

		const result = results.find(c => c.command.find((u:any) => u.name === cmd.options.data.name));

		if (!result) {
			const newCooldown = new cooldown({
				serverId: interaction.guildId,
				command: [{
					name: cmd.options.data.name,
					data: [
						{
							timeLeft: this.translateTime(cmd.options.cooldown as cooldownSuggest),
							userId: interaction.user.id,
						},
					],
				}],
			});

			await newCooldown.save();
		} else {
			const user = result.command.find((u: { name: string, data: [{ timeLeft: Date, userId: string }] }) => u.data.find((u: { timeLeft: Date, userId: string }) => u.userId === interaction.user.id));
			console.log('user', user);
			 console.log('result', result)
			if (typeof user === "undefined") {
				result.command.push({
					name: cmd.options.data.name,
					data: [
						{
							timeLeft: this.translateTime(cmd.options.cooldown as cooldownSuggest),
							userId: interaction.user.id,
						},
					],
				});
			} else {
				user.data.push({
					timeLeft: this.translateTime(cmd.options.cooldown as cooldownSuggest),
					userId: interaction.user.id,
				});
			}
			await result.save();
		}
	}

	public async checkCooldown(interaction: Interaction<"cached">, cmd: Command) {
		const results = await cooldown.find({
			serverId: interaction.guildId
		});

		const result = results.find(c => c.command.find((u:any) => u.name === cmd.options.data.name));

		const user = result?.command.find((u) => u.data.find((u) => u.userId === interaction.user.id));
		if (user) {
			const timeLeft = user.data[0].timeLeft.getTime() - Date.now();
			if (timeLeft > 0) {
				throw new CustomError({ error: "cooldown", description: await lang.format_message(interaction, 'cooldown.check.error', { words: {time: timeLeft / 1000}}) });
			} else {
				this.removeCooldown(interaction, cmd);
			}
		}

	}

	public async removeCooldown(interaction: Interaction<"cached">, cmd: Command) {
		const results = await cooldown.find({
			serverId: interaction.guildId
		});

		const result = results.find(c => c.command.find((u:any) => u.name === cmd.options.data.name));

		const user = result?.command.find((u: { name: string, data: [{ timeLeft: Date, userId: string }] }) => u.data.find((u: { timeLeft: Date, userId: string }) => u.userId === interaction.user.id));

		if (user) {
			user.data.shift();
		}
		await result?.save();
	}

}
