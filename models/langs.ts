import { Schema, model } from "mongoose";

const m = model(
	"Langs",
	new Schema({
		server: { type: String, required: true },
		lang: { type: String, required: true },
	})
);

export default m;
