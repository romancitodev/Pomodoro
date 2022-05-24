import { ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageActionRowComponentBuilder} from "discord.js";

export class NavEmbedBuilder {
    embeds: EmbedBuilder[] = [];
    counter: number = 0;
    constructor(embeds: EmbedBuilder[]) { 
        if (embeds.length < 2) throw new Error('NavEmbedBuilder requires at least 2 embeds');
        this.embeds = embeds;
        
    }

    public async start(interaction: ChatInputCommandInteraction<'cached'>) {
        
        const collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000, filter: (i) => i.user.id === interaction.user.id });
        const l_button = new ButtonBuilder()
            .setLabel('◀️​')
            .setCustomId('left')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        
        const r_button = new ButtonBuilder()
            .setLabel('​▶️')
            .setCustomId('right')
            .setStyle(ButtonStyle.Primary)
        
        const mid_button = new ButtonBuilder()
            .setLabel('🗑️')
            .setCustomId('mid')
            .setStyle(ButtonStyle.Danger)
            
        const buttons = [l_button, mid_button, r_button];
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons);

        interaction.reply({ embeds: [this.embeds[0].setFooter({ text: `Page ${this.counter + 1} of ${this.embeds.length}`})],components: [row] });

        collector?.on('collect', async (i) => {
            i.deferUpdate()
            if (i.customId == 'mid') {
                i.deleteReply();
                collector.stop('pressed mid button');
            }
            if (i.customId == 'left') {
                this.counter--;
                if (this.counter < 0) this.counter = 0;
                
            } else  if (i.customId == 'right'){
                this.counter++;
                if (this.counter >= this.embeds.length) this.counter = this.embeds.length - 1;
            }
            if (this.counter === 0) { l_button.setDisabled(true); r_button.setDisabled(false); }
            if (this.counter === this.embeds.length - 1) { l_button.setDisabled(false); r_button.setDisabled(true); }
            if (this.counter > 0 && this.counter < this.embeds.length - 1) { l_button.setDisabled(false); r_button.setDisabled(false); }
            const buttons = [l_button, mid_button, r_button];
            const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons);

            interaction.editReply({ embeds: [this.embeds[this.counter].setFooter({ text: `Page ${this.counter+1} of ${this.embeds.length}`})], components: [row] });
        })

        collector?.on('end', async (_collected, reason) => {
            if (reason != 'pressed mid button') interaction.editReply({content: "Navigation ended", components: []});
        })
    }
}