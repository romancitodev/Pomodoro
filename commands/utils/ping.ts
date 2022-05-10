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
			conditions: ["onlyDev"],
			data: new SlashCommandBuilder()
				.setName("ping")
				.setDescription("Pong!"),
			run: async ({ client, interaction }) => {
				const embed = new EmbedBuilder()
					.setTitle("`📡` | Pinging...")
					.setColor(client.colors.Invisible);
				const reply = await interaction.reply({
					embeds: [embed],
					fetchReply: true,
				});

				const ping = reply.createdTimestamp - Date.now();

				embed.setTitle("`📡` | Ping response");
				embed.setColor(client.colors.Success);
				embed.setDescription(
					`> \`${emoji(
						ping
					)} Message Latency: ${ping}ms\`\n> \`${emoji(
						client.ws.ping
					)} API Latency: ${client.ws.ping}ms\``
				);
				await reply.edit({ embeds: [embed] });
			},
		});
	}
}
