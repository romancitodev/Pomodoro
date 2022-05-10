import { Interaction } from "discord.js";
import  CustomError from "../../structure/Errors";

export default function isOwner(interaction: Interaction) { if (interaction.guild?.ownerId !== interaction.user.id) return Promise.reject(new CustomError({ error: 'Owner command', description: "You are not the owner of the guild!" })); return Promise.resolve(); }
