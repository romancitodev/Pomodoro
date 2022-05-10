import {  ChatInputCommandInteraction, PermissionFlags, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder,  } from "discord.js";
import { Pomodoro } from "../structure/Client";
import { categories, cooldownSuggest, Conditions } from "./InternalCommandTypes";

interface CommandType {
	userPerms: Array<keyof PermissionFlags>;
	clientPerms: Array<keyof PermissionFlags>;
	category: categories;
	cooldown?: cooldownSuggest;
	data: SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	conditions?: Array<Conditions>;
	run({
		client,
		interaction,
	}: {
		client: Pomodoro;
		interaction: ChatInputCommandInteraction<'cached'>;
	}): Promise<any>;
}

export default CommandType;
