import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import { NavEmbedBuilder } from "../../structure/NavEmbedBuilder";

//const categoryArray = ["Utils", "Fun", "Configuration"];

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
			async run({ interaction }) {
				const embeds: EmbedBuilder[] = [];
				for (let i = 1; i <= 5; i++) {
					embeds.push(new EmbedBuilder().setTitle(`Category ${i}`).setDescription("Description"));
				}
				const nav = new NavEmbedBuilder(embeds);
				nav.start(interaction);
			},
		});
	}
}
