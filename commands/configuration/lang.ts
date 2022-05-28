import { Command } from "../../structure/Command";
import MongoLang from "../../models/langs";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

const langs : Array<string> = ['en','es']

export default class LangSeter extends Command {
    constructor() {
        super({
            category: 'Configuration',
            cooldown: '5s',
            userPerms: ['SendMessages', 'UseApplicationCommands'],
            clientPerms: ['SendMessages'],
            data: new SlashCommandBuilder()
                .setName('set-lang')
                .setDescription('Set the language of the bot.')
                .addStringOption((opc) =>
                     {
                        opc.setName('lang')
                        .setRequired(true)
                        .setDescription('The language of the bot.')
                        for (let lang of langs) {
                            opc.addChoices({name: lang, value: lang})
                        }
                        return opc
                    }
                ),
            async run({ client, interaction }) {
                const lang = interaction.options.getString('lang', true);
                const langDB = await MongoLang.findOne({ serverId: interaction.guildId });
                if (!langDB) {
                    const newLang = new MongoLang({ serverId: interaction.guildId, lang: lang });
                    newLang.save()
                } else {
                    if (langDB.lang !== lang) {
                        langDB.lang = lang;
                        await langDB.save();
                    } else {
                        return client.handleError({
                            error: await client.lang.format_message(interaction, 'set-lang.error.error'),
                            description: await client.lang.format_message(interaction, 'set-lang.error.description'),
                        })
                    }
                }
                const embed = new EmbedBuilder().setTitle(await client.lang.format_message(interaction, 'set-lang.embed.title')).setDescription(await client.lang.format_message(interaction, 'set-lang.embed.description', { words: { lang } })).setColor(client.colors.Default)

                interaction.reply({embeds: [embed]});
            }
            
        })
    }
}