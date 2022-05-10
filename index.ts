import { Pomodoro } from "./structure/Client";

const Client = new Pomodoro();
Client.init()

process.on("unhandledRejection", (err: any) => {
    Client.logger.error(err.stack);
})