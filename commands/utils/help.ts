import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";

const categoryArray = ["Utils", "Fun", "Configuration"];

export default class help extends Command {
	constructor() {
		super({
			category: "Utils",
			cooldown: "5s",
			userPerms: ["SendMessages"],
			clientPerms: ["SendMessages"],
			data: new SlashCommandBuilder()
				.setName("help")
				.setDescription("List all commands."),
			async run({ client, interaction }) {
				const embed = new EmbedBuilder();
                embed.setColor(client.colors.Invisible);
                embed.setTitle("commands");
                embed.setDescription("List of all commands.");
				await interaction.reply({ embeds: [embed] });
			},
		});
	}
}
