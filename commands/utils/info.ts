import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import { emojiCategories } from "../../types/InternalCommandTypes";

const categoryArray = ["Utils", "Fun", "Configuration"];

export default class Help extends Command {
	constructor() {
		super({
			category: "Utils",
			cooldown: "5s",
			userPerms: ["SendMessages", "UseApplicationCommands"],
			clientPerms: ["SendMessages"],
			conditions: ["inDevelopment"],
			data: new SlashCommandBuilder()
				.setName("info")
				.setDescription("information about a command or category ✨.")
				.addSubcommand((sub) =>
					sub
						.setName("category")
						.setDescription(
							"List all categories or search a specific category."
						)
						.addStringOption((opc) => {
							opc.setName("category");
							opc.setRequired(true);
							opc.setDescription("The name of the category.");
							for (const c of categoryArray) {
								opc.addChoices({ name: c, value: c });
							}
							return opc;
						})
				)
				.addSubcommand((sub) =>
					sub
						.setName("command")
						.setDescription("List all commands.")
						.addStringOption((opc) => {
							opc.setName("command");
							opc.setRequired(true);
							opc.setDescription("The name of the command.");
							return opc;
						})
				),
			async run({ client, interaction }) {
				const subcmd = interaction.options.getSubcommand(true);

				const embed = new EmbedBuilder();
				embed.setColor(client.colors.Invisible);

				const functions = {
					category: async () => {
						const category = interaction.options.getString(
							"category",
							true
						);
						const commands = client.commands
							.filter((c) => {
								const cmd = new c.default();
								return cmd.options.category === category;
							})
							.map((c) => {
								const cmd = new c.default();
								return cmd.options.data;
							});

						const emoji =
							emojiCategories[
								category as keyof typeof emojiCategories
							];

						embed.setTitle(
							await client.lang.format_message(interaction,'info.category.title',{ words: { emoji, category, commands: commands.length }})
						);
						embed.setDescription(
							`${commands
								.map((c) => {
									let description = "";
									if (c.options.length > 0) {
										for (const opt of c.options) {
											if (opt.type)
												description += `\`/${c.name} ::\` ${c.description}\n`;
											else
												description += `\`/${c.name} ${opt.name} ::\` ${opt.description}\n`;
										}
									} else { 
										description += `\`/${c.name} ::\` ${c.description}\n`;
									}
									return description;
								})
								.join("\n")}`
						);

						return interaction.reply({ embeds: [embed] });
					},
					command: async () => {
						const command = interaction.options.getString(
							"command",
							true
						);
						const cmd: Command = new (client.commands.get(command)).default();

						if (!cmd)
							return client.handleError({
								error: await client.lang.format_message(interaction,'info.command.error01.error'),
								description:
									await client.lang.format_message(interaction,'info.command.error01.description'),
							});

						const cmdData = cmd.options;

						embed.setTitle(await client.lang.format_message(interaction,'info.command.embed.title'));
						embed.addFields(
							[{
								name: await client.lang.format_message(interaction,'info.command.embed.fields.command_name'),
								value: `\`${cmdData.data.name}\``,
								inline: true,
							},
							{
								name: await client.lang.format_message(interaction,'info.command.embed.fields.description'),
								value: `\`${cmdData.data.description}\``,
								inline: true,
							},
							{
								name: await client.lang.format_message(interaction,'info.command.embed.fields.category'),
								value: `\`${cmdData.category}\``,
								inline: true,
							},
							{
								name: await client.lang.format_message(interaction,'info.command.embed.fields.cooldown'),
								value: `\`${cmdData.cooldown}\``,
								inline: true,
							},
							{
								name: await client.lang.format_message(interaction,'info.command.embed.fields.userperms'),
								value: `\`${cmdData.userPerms.join(", ")}\``,
								inline: true,
							},
							{
								name: await client.lang.format_message(interaction,'info.command.embed.fields.botperms'),
								value: `\`${cmdData.clientPerms.join(", ")}\``,
								inline: true,
							}]
						);

						return interaction.reply({ embeds: [embed] });
					},
				};

				await functions[subcmd as keyof typeof functions]();
			},
		});
	}
}
