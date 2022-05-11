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
					.setTitle(`${member.user.tag}'s information`)
					.setColor(client.colors.Invisible)
					.setThumbnail(
						`${member.user.displayAvatarURL({
							size: 2048,
							extension: "png",
						})}`
					)
					.addFields(
						[{
							name: "Username",
							value: `${member.user.tag}`,
							inline: false,
						},
						{
							name: "Status",
							value: `${`${
								member_status !== undefined
									? Status[member_status]
									: Status.offline
							}`}`,
							inline: false,
						},
						{
							name: "Roles",
							value: `${member_roles || "`None`"}`,
							inline: false,
						}]
					);

				return interaction.reply({ embeds: [embed] });
			},
		});
	}
}
