import { Schema, model } from "mongoose";

const m = model(
	"cooldowns",
	new Schema({
		serverId: { type: String, required: true },
		list: {
            command: {
                name: { type: String, required: true },
                data : [
                    {
                        timeLeft: { type: Date, required: true },
                        userId: { type: String, required: true },
                    },
                ]
            },
		},
	})
);

export default m;
