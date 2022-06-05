import { Guild, GuildMember, TextChannel } from "discord.js";
import { Pomodoro } from "../../structure/Client";
import { Event } from "../../structure/Events";

export default class Welcomer extends Event{
    constructor(client: Pomodoro) {
        super(client, 'guildCreate');
    }
    public async run(guild: Guild) {
        const channel = guild.channels.cache.filter(c => c.isText() && c.permissionsFor(guild.me as GuildMember).has('SendMessages')).first() as TextChannel;
        
        channel.send({ content: `Welcome to ${guild.name}!` });
    }
}