import { Schema, model } from "mongoose";

const m = model(
	"Tasks",
	new Schema({
		server: { type: String, required: true },
		user: { type: String, required: true },
		task: [
			{
				name: { type: String, required: true },
				cicles: { type: Number, required: true },
				id: { type: String, required: true },
				status: {
					started: { type: Boolean, required: true, default: false },
					startedAt: {
						type: Date,
						default: null,
					},
				},
			},
		],
	})
);

export default m;
