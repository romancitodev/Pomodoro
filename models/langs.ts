import { Schema, model } from "mongoose";

const m = model<Langs>(
	"Langs",
	new Schema({
		serverId: { type: String, required: true },
		lang: { type: String, required: true },
	})
);

interface Langs {
	serverId: string;
	lang: string;
}

export default m;

