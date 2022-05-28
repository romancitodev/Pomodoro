import { Schema, model } from "mongoose";

const m = model<Cooldowns>(
	"cooldowns",
	new Schema({
		serverId: { type: String, required: true },
            command: [{
                name: { type: String, required: true },
                data : [
                    {
                        timeLeft: { type: Date, required: true },
                        userId: { type: String, required: true },
                    },
                ]
            }],
	})
);

interface Cooldowns {
    serverId: string;
    command: [{
        name: string;
        data: [{
            timeLeft: Date;
            userId: string;
        }]
    }]
}

export default m;
