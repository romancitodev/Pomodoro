import { Event } from "../../structure/Events";
import { Pomodoro } from "../../structure/Client";

export default class Ready extends Event {
	constructor(client: Pomodoro) {
		super(client, "ready");
	}

	async run() {
		this.client.logger.raw('----------------------------------')
		this.client.logger.log(`${this.client.user?.tag} is online!`);
	}
}
