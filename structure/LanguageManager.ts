import { LangOptionsInterface } from "../types/LanguageInterface";
import lang_model from "../models/langs";
import { ChatInputCommandInteraction, Interaction } from "discord.js";

export default class LanguageManager {
	private languages: string = "";
	constructor({ lang }: { lang: string }) {
		this.languages = lang
	}

	public async format_message(interaction: ChatInputCommandInteraction<'cached'> | Interaction<"cached">, key: string, options: { words: LangOptionsInterface } = { words: {} }): Promise<string> {
		const lang_db = await lang_model.findOne({serverId: interaction.guildId});
		const lang = lang_db?.lang ?? this.languages;
        const key_split = key.split('.');
		const json = await import(`../locales/${lang}.json`);
		const value = this.get_value(key_split, json);
		if (typeof value != 'string') throw new Error(`Language key ${key} not found!`);
			return value.replace(/{(.*?)}/g, (_match, p1) => {
				return options.words[p1];
			})
    }
    
    private get_value(key_split: string[], json: any): any {
        if (key_split.length === 1) {
            return json[key_split[0]];
        } else {
            return this.get_value(key_split.slice(1), json[key_split[0]]);
        }
    }
}

