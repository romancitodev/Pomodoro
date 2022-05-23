import mongoose, { Model } from "mongoose";

export default class DataBase {
	username: string;
	password: string;

	constructor(username: string, password: string) {
		this.username = username;
		this.password = password;
	}

	public async init() {
		await mongoose.connect(
			`mongodb+srv://${this.username}:${this.password}@cluster0.ekstv.mongodb.net/?retryWrites=true&w=majority`
		);
	}

	public async import(path: string): Promise<Model<any, {},{},{}>>  {
		const file: any = await import(path);
		return file['default'];
	}
}
