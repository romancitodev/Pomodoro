import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../structure/Command";

const emoji = (ping: number) => {
	if (ping < 100) return "🟢";
	if (ping < 200) return "🟡";
	return "🔴";
};

export default class Ping extends Command {
	constructor() {
		super({
			category: "Utils",
			cooldown: "5s",
			userPerms: ["SendMessages", "UseApplicationCommands"],
			clientPerms: ["SendMessages"],
			data: new SlashCommandBuilder()
				.setName("ping")
				.setDescription("Pong!"),
			run: async ({ client, interaction }) => {
				const embed = new EmbedBuilder()
					.setTitle(await client.lang.format_message(interaction,'ping.embed.before'))
					.setColor(client.colors.Invisible);
				const reply = await interaction.reply({
					embeds: [embed],
					fetchReply: true,
				});

				const ping = reply.createdTimestamp - Date.now();

				embed.setTitle(await client.lang.format_message(interaction,'ping.embed.title'));
				embed.setColor(client.colors.Success);
				embed.setDescription(
					await client.lang.format_message(interaction,"ping.embed.description", {
						words: {	
							emojiping: emoji(ping),
							emojitime: emoji(client.ws.ping),
							ping: ping,
							time: client.ws.ping,
						},
					})
				);
				await reply.edit({ embeds: [embed] });
			},
		});
	}
}
