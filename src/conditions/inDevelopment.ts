import { configuration } from "../../configuration/config";
import  CustomError from "../../structure/Errors";

export default function validDev(id: string) { if (!configuration.devs.includes(id)) return Promise.reject(new CustomError({ error: 'Command in development', description: "Command in development yet!" })); return Promise.resolve(); }