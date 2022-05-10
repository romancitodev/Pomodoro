import { Pomodoro } from "./Client";

export abstract class Event {
	constructor(
		public client: Pomodoro,
		public name: string,
		public once: boolean = false
	) {}
	public abstract run(...args: any[]): any;
}
