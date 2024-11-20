import { EmbedBuilder } from 'discord.js';
import userModel from "../../../models/user.js";

export default async (client, interaction, t, c) => {
    const raw = await userModel.findOne({ user: interaction.user.id });
    const data = raw.afk;
    const newReason = interaction.options.getString("reason");
    const global = interaction.options.getBoolean("global");
    const oldReason = data.reason;
}