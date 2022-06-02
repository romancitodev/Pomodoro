import { ClientEvents } from "discord.js";
import { Pomodoro } from "./Client";
export abstract class Event {
	constructor(
		public client: Pomodoro,
		public name: keyof ClientEvents ,
		public once: boolean = false
	) {}
	public abstract run(...args: any[]): any;
}
