import mongoose from "mongoose";

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
}
