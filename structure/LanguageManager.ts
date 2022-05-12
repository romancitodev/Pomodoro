import { LangOptionsInterface } from "../types/LanguageInterface";
import Logger from "./ConsoleColors";

export default class LanguageManager {
	public languages: string[] = [];

	private logger = new Logger();
	constructor({ lang = false }: { lang: string | boolean }) {
		lang ? this.languages.push(lang as string) : (this.languages = []);
	}

	public async setLanguage(lang: Array<string>): Promise<void> {
		for (const l of lang) {
			try {
				await import(`../locales/${l}.json`);
				if (!this.languages.includes(l)) {
					this.languages.push(l);
				} else {
					this.logger.warn(
						`Language ${l} already exists in the list.`
					);
				}
			} catch (e) {
				this.logger.warn(`Language ${l} not found!`);
			}
		}
	}

	public async format_message(key: string, options: { words: LangOptionsInterface } = { words: {}}): Promise<string> {
        const lang = this.languages[0];
        const key_split = key.split('.');
		const json = await import(`../locales/${lang}.json`);
		const value = this.get_value(key_split, json);
		if (typeof value != 'string') throw new Error(`Language key ${key} not found!`);
			return value.replace(/{(.*?)}/g, (match, p1) => {
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

