import { configuration } from "../../configuration/config";
import  CustomError from "../../structure/Errors";

export default function validDev(id: string) { if (!configuration.devs.includes(id)) return Promise.reject(new CustomError({ error: 'Dev command', description: "You are not a dev!" })); return Promise.resolve(); }
