import { SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";
import { Command } from "../../structure/Command";

export default class UserInfo extends Command {
	constructor() {
		super({
			category: "Fun",
			cooldown: "5s",
			userPerms: ["SendMessages", "UseApplicationCommands"],
			clientPerms: ["SendMessages"],
			data: new SlashCommandBuilder()
				.setName("userinfo")
				.setDescription("Get information about a user.")
				.addUserOption((opc) =>
					opc
						.setName("user")
						.setRequired(true)
						.setDescription("The user to get information about.")
				),
			run: async ({ client, interaction }) => {
				const member = interaction.options.getMember(
					"user"
				) as GuildMember;
				const member_roles = member.roles.cache
					.map((r) => (r.name != "@everyone" ? r : null))
					.join(" ");

				enum Status {
					online = "`🟢`",
					idle = "`🌙`",
					dnd = "`⛔`",
					offline = "`🔘`",
					invisible = "`🔘`",
				}

				const member_status = member.presence?.status;

				const embed = new EmbedBuilder()
					.setTitle(await client.lang.format_message(interaction,'userinfo.embed.title', { words: { user: member.user.tag } }))
					.setColor(client.colors.Invisible)
					.setThumbnail(
						`${member.user.displayAvatarURL({
							size: 2048,
							extension: "png",
						})}`
					)
					.addFields(
						[{
							name: await client.lang.format_message(interaction, 'userinfo.embed.fields.name'),
							value: `${member.user.tag}`,
							inline: false,
						},
						{
							name:  await client.lang.format_message(interaction, 'userinfo.embed.fields.status'),
							value: `${`${
								member_status !== undefined
									? Status[member_status]
									: Status.offline
							}`}`,
							inline: false,
						},
						{
							name: await client.lang.format_message(interaction,'userinfo.embed.fields.roles'),
							value: `${member_roles || await client.lang.format_message(interaction,'userinfo.none')}`,
							inline: false,
						}]
					);

				return interaction.reply({ embeds: [embed] });
			},
		});
	}
}
