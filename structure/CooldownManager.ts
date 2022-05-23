import { Interaction } from "discord.js";
import cooldown from "../models/cooldowns";
import { cooldownSuggest } from "../types/InternalCommandTypes";
import { Command } from "./Command";
import CustomError from "./Errors";

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

		const result = results.find(c => c.list.command.name === cmd.options.data.name);

		if (!result) {
			const newCooldown = new cooldown({
				serverId: interaction.guildId,
				list: {
					command: {
						name: cmd.options.data.name,
						data: [
							{
								timeLeft: this.translateTime(cmd.options.cooldown as cooldownSuggest),
								userId: interaction.user.id,
							},
						],
					},
				},
			});

			await newCooldown.save();
		} else {
				result.list.command.data.push({
					timeLeft: this.translateTime(cmd.options.cooldown as cooldownSuggest),
					userId: interaction.user.id,
				});
				await result.save();
		}
	}

	public async checkCooldown(interaction: Interaction<"cached">, cmd: Command) {
		const results = await cooldown.find({
			serverId: interaction.guildId
		});

		const result = results.find(c => c.list.command.name === cmd.options.data.name);

		const user = result.list.command.data.find((u: any) => u.userId === interaction.user.id);
		
		if (user) {
			const timeLeft = user.timeLeft.getTime() - Date.now();
			if (timeLeft > 0) {
				throw new CustomError({ error: "cooldown", description: `You must wait ${timeLeft / 1000} seconds before using this command again.` });
			} else {
				this.removeCooldown(interaction, cmd);
			}
		}

	}

	public async removeCooldown(interaction: Interaction<"cached">, cmd: Command) {
		const results = await cooldown.find({
			serverId: interaction.guildId
		});

		const result = results.find(c => c.list.command.name === cmd.options.data.name);

		const user = result.list.command.data.find((u: any) => u.userId === interaction.user.id);

		if (user) {
			result.list.command.data.splice(result.list.command.data.indexOf(user), 1);
			await result.save();
		}
	}

}
