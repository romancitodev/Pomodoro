export interface Config {
    serverId: string;
    testing: boolean;
    mongoData: { username: string; password: string };
    devs: Array<string>;
}