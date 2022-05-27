import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,MessageActionRowComponentBuilder, SelectMenuBuilder, ComponentType } from "discord.js";
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

				// vamos a hacer un dropdown menu
				// para que el usuario pueda elegir

				// vamos a hacer un array de embeds que tengan guardados los comandos

				const embeds: EmbedBuilder[] = [];
				
				embeds.push(new EmbedBuilder().setTitle('Help command').setDescription(`${categoryArray.map(category => `> ✨ \`${category}\``).join('\n')}`).setColor(client.colors.Default));

				for (const category of categoryArray) {
					const commands = client.commands.filter(c => {
						const cmd = new (c).default;
						return cmd.options.category === category;
					})
					const embed = new EmbedBuilder()
						.setTitle(`${category}`)
						.setDescription(`${commands.map(c => {
							const cmd = new (c).default;
							return `> \✨ \`${cmd.options.data.name}\``;
						}).join('\n')}`)
						.setColor(client.colors.Default)
						.setFooter({ text: `${commands.size} commands` });
					embeds.push(embed);
				}

				const menu = new SelectMenuBuilder().setPlaceholder('Check my categories!').setCustomId('menu').addOptions([
					{ label: '🔧 Utils', description: 'Utils category', value: '0' },
					{ label: '🎉 Fun', description: 'Fun category', value: '1' },
					{ label: '⚒️ Configuration', description: 'Configuration category', value: '2' },
					{label:'🏠 Menu', description:'Back to the menu', value:'3'}
				])

				const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([menu])

				const rep = await interaction.reply({ embeds: [embeds[0]], components: [row], fetchReply: true });

				const collector = rep.createMessageComponentCollector({
					componentType: ComponentType.SelectMenu,
					time: 60000,
					filter: (i) => i.user.id === interaction.user.id
				})

				collector.on('collect', async (i) => {
					i.deferUpdate()
					const index = i.values[0]
					if(index === '3'){
						await interaction.editReply({ embeds: [embeds[0]] });
					} else {
						await interaction.editReply({ embeds: [embeds[Number(index)+1]]});
					}
				})

				collector.on('end', async (_collected, reason) => {
					if (reason === 'time') {
						await interaction.editReply({ content: 'Menu Expired' });
					}
				})
			},
		});
	}
}
